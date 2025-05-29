require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const models = require("../models");
const { errorHandler } = require("../utils/error");

async function signUp(req, res, next) {
  try {
    const { email, username, password } = req.body;

    // Manual validation
    if (!email || !username || !password) {
      return res.status(400).json({ success: false, message: "Email, username, and password are required" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const existingEmail = await models.User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const existingUsername = await models.User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ success: false, message: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = {
      username,
      email,
      password: hash,
      role: "user", // Default to user, not admin
    };

    const newUser = await models.User.create(user);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    console.error("SignUp Error:", error);
    next(errorHandler(500, "Failed to create user", error));
  }
}

async function signIn(req, res, next) {
  try {
    const { username, password } = req.body;

    // Manual validation
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password are required" });
    }

    const user = await models.User.findOne({ where: { username } });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    const { password: pass, ...rest } = user.dataValues;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 3600000,
      })
      .json(rest);
  } catch (error) {
    console.error("SignIn Error:", error);
    next(errorHandler(500, "Failed to sign in", error));
  }
}

async function google(req, res, next) {
  console.log("Google OAuth Request Body:", req.body); // Debug log

  try {
    const { email, name, photoURL } = req.body;

    // Manual validation
    if (!email || !name) {
      console.error("Validation failed: Email and name are required");
      return res.status(400).json({ success: false, message: "Email and name are required" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.error("Validation failed: Invalid email format");
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const names = name.split(" ");
    const firstName = names[0] || "";
    const lastName = names[1] || "";
    let username = `${firstName}${lastName}`.toLowerCase() || `user${Math.floor(Math.random() * 10000)}`;

    // Ensure username uniqueness
    const existingUsername = await models.User.findOne({ where: { username } });
    if (existingUsername) {
      username = `${username}${Math.floor(Math.random() * 1000)}`;
    }

    let user = await models.User.findOne({ where: { email } });

    if (!user) {
      const newUser = {
        username,
        email,
        password: null, // No password for OAuth users
        firstname: firstName,
        lastname: lastName,
        profilepicurl: photoURL || "",
        role: "user", // Default to user
      };
      console.log("Creating new user:", newUser); // Debug log
      user = await models.User.create(newUser);
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    const { password, ...rest } = user.dataValues;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 3600000,
      })
      .json(rest);
  } catch (error) {
    console.error("Google OAuth Error:", error);
    next(errorHandler(500, "Google OAuth failed", error));
  }
}

async function signOut(req, res, next) {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json({ success: true, message: "User signed out successfully" });
  } catch (error) {
    console.error("SignOut Error:", error);
    next(errorHandler(500, "Failed to sign out", error));
  }
}

module.exports = {
  signUp,
  signIn,
  google,
  signOut,
};