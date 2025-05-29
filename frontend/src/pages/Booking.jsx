import React, { useEffect, useState } from "react";
import { Button, Carousel, Footer, Card, Spinner, Modal } from "flowbite-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  BsDribbble,
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsMailbox,
  BsPhone,
  BsTwitter,
  BsYoutube,
} from "react-icons/bs";
import { Link as ScrollLink } from "react-scroll";
import logo from "../assets/logo.png";
import image1 from "../assets/heroSlider/1.jpg";
import image2 from "../assets/heroSlider/2.jpg";
import image3 from "../assets/heroSlider/3.jpg";
import room1 from "../assets/rooms/1-lg.png";

export default function Booking() {
  const [fetchLoading, setFetchLoading] = useState(null);
  const [roomCategory, setRoomCategory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState(null);

  const fetchRoomCategory = async () => {
    try {
      setFetchLoading(true);
      const res = await fetch(`/api/roomcategory/getroomcategories`);
      const data = await res.json();
      if (res.ok) {
        setRoomCategory(data.roomcategories);
        setFetchLoading(false);
      }
    } catch (error) {
      console.log(error.message);
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomCategory();
  }, []);

  const handleCheckAvailability = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
    setAvailabilityStatus(null);
    setAvailabilityError(null);
  };

  const checkAvailability = async () => {
    if (!checkInDate || !checkOutDate) {
      setAvailabilityError("Please select both check-in and check-out dates.");
      return;
    }

    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      setAvailabilityError("Check-out date must be after check-in date.");
      return;
    }

    try {
      setAvailabilityLoading(true);
      setAvailabilityError(null);

      const res = await fetch(`/api/booking/check-availability`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomCategoryId: selectedRoom.id,
          checkInDate,
          checkOutDate,
        }),
      });

      const data = await res.json();
      setAvailabilityLoading(false);

      if (res.ok) {
        setAvailabilityStatus(data.available ? "Available" : "Not Available");
        if (data.available) {
          // Optionally, redirect to a booking form or page
          // Example: history.push(`/book/${selectedRoom.id}?checkIn=${checkInDate}&checkOut=${checkOutDate}`);
        }
      } else {
        setAvailabilityError(data.message || "Failed to check availability.");
      }
    } catch (error) {
      setAvailabilityLoading(false);
      setAvailabilityError("An error occurred while checking availability.");
      console.log(error.message);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedRoom(null);
    setCheckInDate("");
    setCheckOutDate("");
    setAvailabilityStatus(null);
    setAvailabilityError(null);
  };

  const rooms = [];

  return (
    <div className="relative">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {/* Rooms section */}
          <section className="py-16 bg-gray-100" id="rooms">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center mb-4">
                Rooms & Suites
              </h2>
              <p className="text-center text-lg text-gray-600 mb-12">
                Our luxurious rooms and suites are designed to provide the
                ultimate comfort and relaxation, with every detail carefully
                considered to ensure a truly unforgettable stay.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {fetchLoading ? (
                  <div className="flex justify-center items-center h-96">
                    <Spinner size="xl" />
                  </div>
                ) : (
                  <>
                    {roomCategory.map((room) => (
                      <Card
                        key={room.id}
                        imgSrc={`http://localhost:3001/uploads/${room.image}`}
                        className="overflow-hidden shadow-lg rounded-lg"
                      >
                        <h3 className="text-2xl font-semibold mb-2">
                          {room.category_name}
                        </h3>
                        <p className="text-gray-600 mb-1">{room.description}</p>
                        <div className="flex items-center justify-between text-gray-600 text-lg mb-2">
                          <span>
                            <b>Rs {room.price}.00</b>
                          </span>
                        </div>
                        <Button
                          className="bg-customBlue"
                          onClick={() => handleCheckAvailability(room)}
                        >
                          Check Availability
                        </Button>
                      </Card>
                    ))}
                  </>
                )}
              </div>
            </div>
          </section>

          {/* Availability Modal */}
          <Modal show={showModal} onClose={handleModalClose} size="md">
            <Modal.Header>Check Availability</Modal.Header>
            <Modal.Body>
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-gray-900">
                  {selectedRoom?.category_name}
                </h3>
                <div>
                  <label
                    htmlFor="checkInDate"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Check-In Date
                  </label>
                  <input
                    type="date"
                    id="checkInDate"
                    className="w-full p-2 border rounded"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]} // Prevent past dates
                  />
                </div>
                <div>
                  <label
                    htmlFor="checkOutDate"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Check-Out Date
                  </label>
                  <input
                    type="date"
                    id="checkOutDate"
                    className="w-full p-2 border rounded"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    min={
                      checkInDate
                        ? new Date(
                            new Date(checkInDate).getTime() + 24 * 60 * 60 * 1000
                          )
                            .toISOString()
                            .split("T")[0]
                        : ""
                    } // Ensure check-out is after check-in
                  />
                </div>
                {availabilityError && (
                  <p className="text-red-500 text-sm">{availabilityError}</p>
                )}
                {availabilityStatus && (
                  <p
                    className={`text-sm ${
                      availabilityStatus === "Available"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {availabilityStatus}
                  </p>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="bg-customBlue"
                onClick={checkAvailability}
                disabled={availabilityLoading}
              >
                {availabilityLoading ? <Spinner size="sm" /> : "Check"}
              </Button>
              <Button color="gray" onClick={handleModalClose}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Call to Action */}
          <section className="bg-customBlue text-white py-16">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-32">
                <div>
                  <h2 className="text-4xl font-bold mb-4">
                    Book Your Stay Now
                  </h2>
                  <p className="text-lg mb-6">
                    Experience the height of luxury with our exclusive rooms and
                    suites, designed to provide the ultimate comfort and
                    relaxation.
                  </p>
                  <div className="flex items-center mb-4">
                    <BsPhone className="text-2xl mr-4" />
                    <span className="text-lg">+1 (123) 456-7890</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <BsMailbox className="text-2xl mr-4" />
                    <span className="text-lg">
                      <a href="mailto:info@salford.com" className="text-white">
                        info@salford.com
                      </a>
                    </span>
                  </div>
                  <Button className="bg-white text-customBlue mt-10">
                    Book Now
                  </Button>
                </div>
                <div className="hidden md:block">
                  <img src={image1} alt="" className="rounded-lg" width={500} />
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <Footer container>
            <div className="w-full">
              <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
                <div>
                  <Link to="/">
                    <img src={logo} alt="" className="w-48 " />
                  </Link>
                  <div className="w-96">
                    <p className="text-gray-600 mt-4 ">
                      Salford & Co.™ is a luxury hotel that provides the
                      ultimate comfort and relaxation, with every detail
                      designed for your ultimate relaxation.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
                  <div>
                    <Footer.Title title="services" />
                    <Footer.LinkGroup col>
                      <Footer.Link href="">Booking</Footer.Link>
                      <ScrollLink to="rooms" smooth={true} duration={1000}>
                        <Footer.Link href="#">Rooms</Footer.Link>
                      </ScrollLink>
                    </Footer.LinkGroup>
                  </div>
                  <div>
                    <Footer.Title title="Follow us" />
                    <Footer.LinkGroup col>
                      <Footer.Link href="#">Facebook</Footer.Link>
                      <Footer.Link href="#">Instagram</Footer.Link>
                    </Footer.LinkGroup>
                  </div>
                  <div>
                    <Footer.Title title="Legal" />
                    <Footer.LinkGroup col>
                      <Footer.Link href="#">Privacy Policy</Footer.Link>
                      <Footer.Link href="#">Terms & Conditions</Footer.Link>
                    </Footer.LinkGroup>
                  </div>
                </div>
              </div>
              <Footer.Divider />
              <div className="w-full sm:flex sm:items-center sm:justify-between">
                <Footer.Copyright href="#" by="Salford & Co.™" year={2024} />
                <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
                  <Footer.Icon href="#" icon={BsFacebook} />
                  <Footer.Icon href="#" icon={BsInstagram} />
                  <Footer.Icon href="#" icon={BsTwitter} />
                  <Footer.Icon href="#" icon={BsYoutube} />
                </div>
              </div>
            </div>
          </Footer>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}