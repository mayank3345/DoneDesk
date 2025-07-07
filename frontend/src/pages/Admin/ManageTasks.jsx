import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";
import Loader from "../../components/Loader"; // ✅ Make sure this exists

const ManageTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });

      setAllTasks(response.data?.tasks || []);
      const summary = response.data?.statusSummary || {};

      setTabs([
        { label: "All", count: summary.all || 0 },
        { label: "Pending", count: summary.pendingTasks || 0 },
        { label: "In Progress", count: summary.inProgressTasks || 0 },
        { label: "Completed", count: summary.completedTasks || 0 },
      ]);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (taskData) => {
    navigate(`/admin/create-task`, { state: { taskId: taskData._id } });
  };

  const handleDownloadReport = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "task_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading report:", err);
    }
  };

  useEffect(() => {
    getAllTasks();
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="relative min-h-full">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white bg-opacity-70">
            <Loader />
          </div>
        )}

        <div className={`${loading ? "opacity-40 pointer-events-none" : ""}`}>
          <div className="my-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-medium">My Tasks</h2>
                <button
                  className="flex lg:hidden download-btn"
                  onClick={handleDownloadReport}
                >
                  <LuFileSpreadsheet className="text-lg" />
                  Download Report
                </button>
              </div>

              {tabs?.[0]?.count > 0 && (
                <div className="flex items-center gap-3 mt-4 lg:mt-0">
                  <TaskStatusTabs
                    tabs={tabs}
                    activeTab={filterStatus}
                    setActiveTab={setFilterStatus}
                  />
                  <button
                    className="hidden lg:flex download-btn"
                    onClick={handleDownloadReport}
                  >
                    <LuFileSpreadsheet className="text-lg" />
                    Download Report
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {allTasks?.map((item) => (
                <TaskCard
                  key={item._id}
                  title={item.title}
                  description={item.description}
                  priority={item.priority}
                  status={item.status}
                  progress={item.progress}
                  createdAt={item.createdAt}
                  dueDate={item.dueDate}
                  assignedTo={item.assignedTo?.map((i) => i.profileImageUrl)}
                  attachmentCount={item.attachments?.length || 0}
                  completedTodoCount={item.completedTodoCount || 0}
                  todoChecklist={item.todoChecklist || []}
                  onClick={() => handleClick(item)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageTasks;
