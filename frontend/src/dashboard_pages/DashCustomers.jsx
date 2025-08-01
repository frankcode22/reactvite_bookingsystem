import {
  Alert,
  Avatar,
  Breadcrumb,
  Button,
  Label,
  Modal,
  Pagination,
  Select,
  Spinner,
  Table,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
  FileInput,
} from "flowbite-react";
import { AnimatePresence, motion } from "framer-motion";
import { React, useEffect, useRef, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaUserEdit } from "react-icons/fa";
import {
  HiEye,
  HiEyeOff,
  HiHome,
  HiInformationCircle,
  HiOutlineExclamationCircle,
  HiPlusCircle,
} from "react-icons/hi";
import { MdDeleteForever } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashCustomers() {
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    p_name: "",
    p_email: "",
    p_contact_no: "",
  });
  const [editFormData, setEditFormData] = useState({});
  const [customers, setCustomers] = useState([]);
  const [createLoding, setCreateLoding] = useState(null);
  const [updateLoding, setUpdateLoding] = useState(null);
  const [fetchLoding, setFetchLoding] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showDeleteConfirmetion, setShowDeleteConfirmetion] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [image, setImage] = useState(null);

  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [editedCategory, setEditedCategory] = useState(null);

  const fetchCustomer = async () => {
    try {
      setFetchLoding(true);
      const res = await fetch(`/api/customer/getcustomers`);
      const data = await res.json();
      if (res.ok) {
        setCustomers(data.customers);
        setFetchLoding(false);
      }
    } catch (error) {
      console.log(error.message);
      setFetchLoding(false);
    }
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const totalPages = Math.ceil(customers.length / itemsPerPage);

  const onPageChange = (page) => setCurrentPage(page);
  const currentData = customers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  // Pagination

  useEffect(() => {
    fetchCustomer();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setCreateLoding(true);
      const res = await fetch("/api/customer/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setFormData({});
        fetchCustomer();
        setCreateLoding(false);
        setFormData({
          p_name: "",
          p_email: "",
          p_contact_no: "",
        });
      } else {
        setCreateLoding(false);
        setShowAlert(true);
        setAlertMessage(data.message);
        setTimeout(() => {
          setShowAlert(false);
          setAlertMessage("");
        }, 5000);
      }
    } catch (error) {
      console.log(error.message);
      setCreateLoding(false);
    }
  };

  const deleteRoomCategoryHandler = async () => {
    if (!userIdToDelete) return; // Check if there's an ID to delete
    try {
      const res = await fetch(`/api/customer/delete/${userIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        fetchCustomer();
        setShowDeleteConfirmetion(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdateLoding(true);
      const res = await fetch(`/api/customer/update/${editFormData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });
      const data = await res.json();
      if (res.ok) {
        fetchCustomer();
        setUpdateLoding(false);
        setOpenModalEdit(false);
      } else {
        setUpdateLoding(false);
        setShowAlert(true);
        setAlertMessage(data.message);
        setTimeout(() => {
          setShowAlert(false);
          setAlertMessage("");
        }, 5000);
      }
    } catch (error) {
      console.log(error.message);
      setUpdateLoding(false);
    }
  };

  return (
    <div className="p-3 w-full">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Breadcrumb aria-label="Default breadcrumb example">
            <Link to="/dashboard?tab=dash">
              <Breadcrumb.Item href="" icon={HiHome}>
                Home
              </Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item>Customers</Breadcrumb.Item>
          </Breadcrumb>

          <Modal
            show={showDeleteConfirmetion}
            onClose={() => setShowDeleteConfirmetion(false)}
            popup
            size="md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Modal.Header />
              <Modal.Body>
                <div className="text-center">
                  <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                  <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete this user?
                  </h3>
                  <div className="flex justify-center gap-4">
                    <Button color="failure" onClick={deleteRoomCategoryHandler}>
                      Yes, I'm sure
                    </Button>
                    <Button
                      color="gray"
                      onClick={() => setShowDeleteConfirmetion(false)}
                    >
                      No, cancel
                    </Button>
                  </div>
                </div>
              </Modal.Body>
            </motion.div>
          </Modal>

          <Modal
            show={openModalEdit}
            onClose={() => setOpenModalEdit(false)}
            size="md"
          >
            <Modal.Header>
              <h1 className="text-xl font-semibold">Edit Student Details</h1>
            </Modal.Header>

            <Modal.Body>
              <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
                <div>
                  <div className="mb-2 block">
                    <Label value="Customer Name" />
                  </div>
                  <TextInput
                    id="p_name"
                    type="text"
                    placeholder="Nimali Ireshika"
                    required
                    shadow
                    onChange={handleEditChange}
                    defaultValue={editFormData.p_name}
                  />
                </div>

                <div>
                  <div className="mb-2 block">
                    <Label value="Customer Email" />
                  </div>
                  <TextInput
                    id="p_email"
                    type="email"
                    placeholder="nimalihe@gmail.com"
                    required
                    shadow
                    onChange={handleEditChange}
                    defaultValue={editFormData.p_email}
                  />
                </div>

                <div>
                  <div className="mb-2 block">
                    <Label value="Contact Number" />
                  </div>
                  <TextInput
                    id="p_contact_no"
                    type="number"
                    placeholder="0778214789"
                    required
                    shadow
                    onChange={handleEditChange}
                    defaultValue={editFormData.p_contact_no}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button color="red" onClick={() => setOpenModalEdit(false)}>
                    Close
                  </Button>
                  <Button
                    className="bg-customBlue"
                    type="submit"
                    disabled={updateLoding}
                  >
                    {updateLoding ? (
                      <>
                        <Spinner size="sm" />
                        <span className="pl-3">Updating...</span>
                      </>
                    ) : (
                      "Update Customer"
                    )}
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal>

          <h1 className="mt-3 mb-3 text-left font-semibold text-xl">
            All Students
          </h1>

          <div className="flex p-3 flex-col md:flex-row gap-8 justify-between">
            {/* left side */}
            <div className="flex-[3]">
              <h1 className="mt-3 mb-3 text-left font-semibold text-xl">
                Add Student
              </h1>
              {showAlert && (
                <Alert
                  className="mb-3"
                  color="failure"
                  icon={HiInformationCircle}
                >
                  <span className="font-medium">Info alert!</span>{" "}
                  {alertMessage}
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                 <div>
                  <div className="mb-2 block">
                    <Label value="Select Rank" />
                  </div>
                  <TextInput
                    id="p_name"
                    type="text"
                    placeholder="CPL"
                    required
                    shadow
                    onChange={handleChange}
                    defaultValue={formData.p_name}
                  />
                </div>

                 <div>
                  <div className="mb-2 block">
                    <Label value="Service No" />
                  </div>
                  <TextInput
                    id="p_name"
                    type="text"
                    placeholder="92344"
                    required
                    shadow
                    onChange={handleChange}
                    defaultValue={formData.p_name}
                  />
                </div>


                <div>
                  <div className="mb-2 block">
                    <Label value="Name" />
                  </div>
                  <TextInput
                    id="p_name"
                    type="text"
                    placeholder="Makena"
                    required
                    shadow
                    onChange={handleChange}
                    defaultValue={formData.p_name}
                  />
                </div>

                <div>
                  <div className="mb-2 block">
                    <Label value="Email" />
                  </div>
                  <TextInput
                    id="p_email"
                    type="email"
                    placeholder="makena@gmail.com"
                    required
                    shadow
                    onChange={handleChange}
                    defaultValue={formData.p_email}
                  />
                </div>

                <div>
                  <div className="mb-2 block">
                    <Label value="Contact Number" />
                  </div>
                  <TextInput
                    id="p_contact_no"
                    type="number"
                    placeholder="0778214789"
                    required
                    shadow
                    onChange={handleChange}
                    defaultValue={formData.p_contact_no}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    className="bg-customBlue"
                    type="submit"
                    disabled={createLoding}
                  >
                    {createLoding ? (
                      <>
                        <Spinner size="sm" />
                        <span className="pl-3">Loading...</span>
                      </>
                    ) : (
                      "Add New Student"
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* right side */}
            <div className="flex-[6] ">
              {fetchLoding ? (
                <div className="flex justify-center items-center h-96">
                  <Spinner size="xl" />
                </div>
              ) : (
                <>
                  { currentData.length > 0 ? (
                    <>
                      <Table hoverable className="shadow-md w-full">
                        <TableHead>
                          <TableHeadCell> Name</TableHeadCell>
                          <TableHeadCell> Email</TableHeadCell>
                          <TableHeadCell>Contact Number</TableHeadCell>

                          <TableHeadCell>
                            <span className="sr-only">Edit</span>
                          </TableHeadCell>
                        </TableHead>
                        {currentData.map((customers) => (
                          <Table.Body className="divide-y" key={customers.id}>
                            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                              <TableCell>{customers.name}</TableCell>
                              <TableCell>{customers.email}</TableCell>
                              <TableCell>{customers.contact_no}</TableCell>
                              <TableCell>
                                <div className="flex flex-row gap-3">
                                  <Button
                                    onClick={() => {
                                      setOpenModalEdit(true);
                                      setEditFormData({
                                        id: customers.id,
                                        p_name: customers.name,
                                        p_email: customers.email,
                                        p_contact_no: customers.contact_no,
                                      });
                                    }}
                                    color="gray"
                                  >
                                    <FaUserEdit className="h-4 w-4 " />
                                    Edit
                                  </Button>

                                  <Button
                                    onClick={() => {
                                      setShowDeleteConfirmetion(true); // Open the modal
                                      setUserIdToDelete(customers.id); // Set the ID of the category to delete
                                    }}
                                    color="gray"
                                  >
                                    <MdDeleteForever className=" h-4 w-4" />
                                    Delete
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                            {/* hr line */}
                            <TableRow>
                              <hr className="border-gray-200 dark:border-gray-700" />
                            </TableRow>
                          </Table.Body>
                        ))}
                      </Table>
                      {/* Pagination */}
                      <div className="flex overflow-x-auto sm:justify-center">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={onPageChange}
                          showIcons
                        />
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-center items-center h-96">
                      <p className="text-center text-gray-500 dark:text-gray-400">
                        No Room Category Found
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
