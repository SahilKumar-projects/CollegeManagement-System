import React, { useEffect, useState, useCallback } from "react";
import { FiDownload } from "react-icons/fi";
import Heading from "../../components/Heading";
import { useSelector } from "react-redux";
import axiosWrapper from "../../utils/AxiosWrapper";
import { toast } from "react-hot-toast";
import Loading from "../../components/Loading";

const Timetable = () => {
  const userData = useSelector((state) => state.userData);

  const [timetable, setTimetable] = useState("");
  const [dataLoading, setDataLoading] = useState(false);

  /* ================= FETCH TIMETABLE ================= */
  const getTimetable = useCallback(async () => {
    if (!userData?.semester || !userData?.branchId?._id) return;

    try {
      setDataLoading(true);
      const response = await axiosWrapper.get(
        `/timetable?semester=${userData.semester}&branch=${userData.branchId._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      if (response.data.success && response.data.data.length > 0) {
        setTimetable(response.data.data[0].link);
      } else {
        setTimetable("");
      }
    } catch (error) {
      if (error?.response?.status === 404) {
        setTimetable("");
        return;
      }
      toast.error(
        error.response?.data?.message || "Error fetching timetable"
      );
      console.error(error);
    } finally {
      setDataLoading(false);
    }
  }, [userData?.semester, userData?.branchId?._id]);

  /* ================= EFFECT ================= */
  useEffect(() => {
    getTimetable();
  }, [getTimetable]);

  /* ================= UI ================= */
  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <div className="flex justify-between items-center w-full">
        <Heading title={`Timetable of Semester ${userData?.semester}`} />

        {!dataLoading && timetable && (
          <p
            className="flex justify-center items-center text-lg font-medium cursor-pointer hover:text-red-500 hover:scale-110 transition-all duration-200"
            onClick={() =>
              window.open(
                `${process.env.REACT_APP_MEDIA_LINK}/${timetable}`
              )
            }
          >
            Download
            <span className="ml-2">
              <FiDownload />
            </span>
          </p>
        )}
      </div>

      {dataLoading && <Loading />}

      {!dataLoading && timetable && (
        <img
          className="mt-8 rounded-lg shadow-md w-[70%] mx-auto"
          src={`${process.env.REACT_APP_MEDIA_LINK}/${timetable}`}
          alt="timetable"
        />
      )}

      {!dataLoading && !timetable && (
        <p className="mt-10">No Timetable Available At The Moment!</p>
      )}
    </div>
  );
};

export default Timetable;
