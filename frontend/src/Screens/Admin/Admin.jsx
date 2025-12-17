import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { MdOutlineDelete, MdEdit } from "react-icons/md";
import { IoMdAdd, IoMdClose } from "react-icons/io";

import axiosWrapper from "../../utils/AxiosWrapper";
import Heading from "../../components/Heading";
import DeleteConfirm from "../../components/DeleteConfirm";
import CustomButton from "../../components/CustomButton";
import Loading from "../../components/Loading";

const Admin = () => {
  const userToken = localStorage.getItem("userToken");

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    gender: "",
    dob: "",
    designation: "",
    joiningDate: "",
    salary: "",
    status: "active",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    bloodGroup: "",
  });

  const [admins, setAdmins] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);

  /* ================= FETCH ADMINS ================= */
  const getAdminsHandler = useCallback(async () => {
    try {
      setDataLoading(true);
      const response = await axiosWrapper.get("/auth/admin", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.data.success) {
        setAdmins(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setAdmins([]);
        return;
      }
      console.error(error);
      toast.error(error.response?.data?.message || "Error fetching admins");
    } finally {
      setDataLoading(false);
    }
  }, [userToken]);

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    getAdminsHandler();
  }, [getAdminsHandler]);

  /* ================= ADD / UPDATE ================= */
  const addAdminHandler = async () => {
    try {
      toast.loading(isEditing ? "Updating Admin" : "Adding Admin");

      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userToken}`,
      };

      const formData = new FormData();

      for (const key in data) {
        if (key === "emergencyContact") {
          for (const subKey in data.emergencyContact) {
            formData.append(
              `emergencyContact[${subKey}]`,
              data.emergencyContact[subKey]
            );
          }
        } else {
          formData.append(key, data[key]);
        }
      }

      if (file) {
        formData.append("file", file);
      }

      const response = isEditing
        ? await axiosWrapper.patch(`/admin/${selectedAdminId}`, formData, {
            headers,
          })
        : await axiosWrapper.post(`/auth/admin/register`, formData, {
            headers,
          });

      toast.dismiss();

      if (response.data.success) {
        toast.success(
          isEditing
            ? response.data.message
            : "Admin created successfully! Default password: admin123"
        );
        resetForm();
        getAdminsHandler();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error");
    }
  };

  /* ================= DELETE ================= */
  const deleteAdminHandler = (id) => {
    setIsDeleteConfirmOpen(true);
    setSelectedAdminId(id);
  };

  const confirmDelete = async () => {
    try {
      toast.loading("Deleting Admin");

      const response = await axiosWrapper.delete(
        `/auth/admin/${selectedAdminId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      toast.dismiss();

      if (response.data.success) {
        toast.success("Admin deleted successfully");
        setIsDeleteConfirmOpen(false);
        getAdminsHandler();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error");
    }
  };

  /* ================= EDIT ================= */
  const editAdminHandler = (admin) => {
    setData({
      ...admin,
      dob: admin.dob?.split("T")[0] || "",
      joiningDate: admin.joiningDate?.split("T")[0] || "",
      emergencyContact: admin.emergencyContact || {
        name: "",
        relationship: "",
        phone: "",
      },
    });

    setSelectedAdminId(admin._id);
    setIsEditing(true);
    setShowAddForm(true);
  };

  /* ================= HELPERS ================= */
  const resetForm = () => {
    setData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      profile: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      gender: "",
      dob: "",
      designation: "",
      joiningDate: "",
      salary: "",
      status: "active",
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
      bloodGroup: "",
    });
    setShowAddForm(false);
    setIsEditing(false);
    setSelectedAdminId(null);
    setFile(null);
  };

  const handleInputChange = (field, value) => {
    setData({ ...data, [field]: value });
  };

  const handleEmergencyContactChange = (field, value) => {
    setData({
      ...data,
      emergencyContact: { ...data.emergencyContact, [field]: value },
    });
  };

  /* ================= UI ================= */
  return (
    <div className="w-full mx-auto mt-10 flex flex-col mb-10 relative">
      <div className="flex justify-between items-center w-full">
        <Heading title="Admin Management" />
        <CustomButton onClick={() => (showAddForm ? resetForm() : setShowAddForm(true))}>
          <IoMdAdd className="text-2xl" />
        </CustomButton>
      </div>

      {dataLoading && <Loading />}

      {/* Rest of your JSX (table, modal, DeleteConfirm) stays SAME */}
    </div>
  );
};

export default Admin;
