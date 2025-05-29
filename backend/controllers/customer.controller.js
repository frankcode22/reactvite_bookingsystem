const models = require("../models");
const { Customer } = require('../models'); // Adjust path to your models

// Get all customers using stored procedure
// function getCustomers(req, res) {
//   models.sequelize
//     .query("SELECT * FROM GetCustomers")
//     .then((customers) => {
//       res.status(200).json({
//         success: true,
//         customers: customers[0],
//       });
//     })
//     .catch((err) => {
//       res.status(400).json({
//         success: false,
//         message: err.message,
//       });
//     });
// }

async function getCustomers(req, res) {
  try {
    // Retrieve all customers using Sequelize model
    const customers = await Customer.findAll();

    return res.status(200).json({
      success: true,
      customers,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}



async function createCustomer(req, res) {
  const { p_name, p_contact_no, p_email } = req.body;

  // Validate input
  // if (!p_name || !p_contact_no || !p_email) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Please fill in all fields",
  //   });
  // }

  try {
    // Create customer using Sequelize model
    const customer = await Customer.create({
      name: p_name,
      contact_no: p_contact_no,
      email: p_email,
    });

    return res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: customer, // Optional: return created customer data
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}



// Create a new customer using stored procedure
// function createCustomer(req, res) {
//   const { p_name, p_contact_no, p_email } = req.body;

//   if (!p_name || !p_contact_no || !p_email) {
//     return res.status(400).json({
//       success: false,
//       message: "Please fill in all fields",
//     });
//   }

//   models.sequelize
//     .query("CALL CreateCustomer(:p_name, :p_contact_no, :p_email)", {
//       replacements: { p_name, p_contact_no, p_email },
//     })
//     .then((result) => {
//       res.status(201).json({
//         success: true,
//         message: "Customer created successfully",
//       });
//     })
//     .catch((err) => {
//       res.status(400).json({
//         success: false,
//         message: err.message,
//       });
//     });
// }

// Update customer using stored procedure
function updateCustomer(req, res) {
  const { id } = req.params;
  const { p_name, p_contact_no, p_email } = req.body;

  models.sequelize
    .query("CALL UpdateCustomer(:id, :p_name, :p_contact_no, :p_email)", {
      replacements: { id, p_name, p_contact_no, p_email },
    })
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Customer updated successfully",
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    });
}

// Delete customer using stored procedure
function deleteCustomer(req, res) {
  const { id } = req.params;

  models.sequelize
    .query("CALL DeleteCustomer(:id)", {
      replacements: { id },
    })
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Customer deleted successfully",
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    });
}

module.exports = {
  getCustomers: getCustomers,
  createCustomer: createCustomer,
  updateCustomer: updateCustomer,
  deleteCustomer: deleteCustomer,
};
