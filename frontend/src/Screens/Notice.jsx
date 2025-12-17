import React, { useEffect, useState, useCallback } from "react";
import { IoMdLink, IoMdAdd, IoMdClose } from "react-icons/io";
import { HiOutlineCalendar } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import { MdDeleteOutline, MdEditNote } from "react-icons/md";
import toast from "react-hot-toast";
import Heading from "../components/Heading";
import axiosWrapper from "../utils/AxiosWrapper";
import CustomButton from "../components/CustomButton";
import DeleteConfirm from "../components/DeleteConfirm";
import Loading from "../components/Loading";

const Notice = () => {
  const router = useLocation();
  const navigate = useNavigate();

  const [notices, setNotices] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);

  const token = localStorage.getItem("userToken");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "student",
    link: "",
  });

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    if (!token) {
      toast.error("Please login to continue");
      navigate("/login");
    }
  }, [token, navigate]);

  /* ================= FETCH NOTICES ================= */
  const getNotices = useCallback(async () => {
    try {
      setDataLoading(true);
      const response = await axiosWrapper.get("/notice", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setNotices(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setNotices([]);
      } else {
        toast.error(error.response?.data?.message || "Failed to load notices");
      }
    } finally {
      setDataLoading(false);
    }
  }, [token]);

  /* ================= RELOAD ON ROUTE CHANGE ================= */
  useEffect(() => {
    getNotices();
  }, [getNotices, router.pathname]);

  /* ================= HANDLERS ================= */
  const openAddModal = () => {
    setEditingNotice(null);
    setFormData({
      title: "",
      description: "",
      type: "student",
      link: "",
    });
    setShowAddModal(true);
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title || "",
      description: notice.description || "",
      type: notice.type || "student",
      link: notice.link || "",
    });
    setShowAddModal(true);
  };

  const handleSubmitNotice = async (e) => {
    e.preventDefault();
    const { title, description, type } = formData;

    if (!title || !description || !type) {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      toast.loading(editingNotice ? "Updating Notice" : "Adding Notice");

      const response = await axiosWrapper[editingNotice ? "put" : "post"](
        `/notice${editingNotice ? `/${editingNotice._id}` : ""}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.dismiss();
      if (response.data.success) {
        toast.success(response.data.message);
        getNotices();
        setShowAddModal(false);
        setEditingNotice(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async () => {
    try {
      toast.loading("Deleting Notice");
      const response = await axiosWrapper.delete(
        `/notice/${selectedNoticeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.dismiss();
      if (response.data.success) {
        toast.success("Notice deleted successfully");
        setIsDeleteConfirmOpen(false);
        getNotices();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed to delete notice");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="w-full mx-auto flex justify-center items-start flex-col my-10">
      <div className="relative flex justify-between items-center w-full">
        <Heading title="Notices" />
        {!dataLoading &&
          (router.pathname === "/faculty" || router.pathname === "/admin") && (
            <CustomButton onClick={openAddModal}>
              <IoMdAdd className="text-2xl" />
            </CustomButton>
          )}
      </div>

      {dataLoading && <Loading />}

      {!dataLoading && (
        <div className="mt-8">
          {notices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No notices found
            </div>
          ) : (
            <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notices.map((notice) => (
                <div
                  key={notice._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 w-[350px]"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3
                        className={`text-lg font-semibold line-clamp-2 ${
                          notice.link
                            ? "cursor-pointer hover:text-blue-600"
                            : ""
                        }`}
                        onClick={() => notice.link && window.open(notice.link)}
                      >
                        {notice.title}
                        {notice.link && (
                          <IoMdLink className="inline ml-2 text-xl opacity-70 hover:text-blue-500" />
                        )}
                      </h3>

                      {(router.pathname === "/faculty" ||
                        router.pathname === "/admin") && (
                        <div className="flex gap-2">
                          <CustomButton
                            variant="danger"
                            onClick={() => {
                              setSelectedNoticeId(notice._id);
                              setIsDeleteConfirmOpen(true);
                            }}
                          >
                            <MdDeleteOutline />
                          </CustomButton>
                          <CustomButton
                            variant="secondary"
                            onClick={() => handleEdit(notice)}
                          >
                            <MdEditNote />
                          </CustomButton>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm mb-4">
                      {notice.description}
                    </p>

                    <div className="flex justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <HiOutlineCalendar className="mr-1" />
                        {new Date(notice.createdAt).toLocaleDateString("en-GB")}
                      </div>
                      {notice.type !== "both" && (
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
                          {notice.type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this notice?"
      />
    </div>
  );
};

export default Notice;
