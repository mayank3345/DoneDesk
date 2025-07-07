import React, { useEffect, useState, useContext } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import moment from "moment";
import { addThousandsSeparator } from "../../utils/helper";
import InfoCard from "../../components/Cards/InfoCard";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/TaskListTable";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import CustomBarChart from "../../components/Charts/CustomBarChart";
import Loader from "../../components/Loader"; // 👈 Loader component

const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"];

const Dashboard = () => {
  useUserAuth();

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || {};
    const taskPrioritiesLevels = data?.taskPrioritiesLevels || {};

    setPieChartData([
      { status: "Pending", count: taskDistribution.Pending || 0 },
      { status: "In Progress", count: taskDistribution.InProgress || 0 },
      { status: "Completed", count: taskDistribution.Completed || 0 },
    ]);

    setBarChartData([
      { priority: "Low", count: taskPrioritiesLevels.Low || 0 },
      { priority: "Medium", count: taskPrioritiesLevels.Medium || 0 },
      { priority: "High", count: taskPrioritiesLevels.High || 0 },
    ]);
  };

  const getDashboardData = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);
      if (res.data) {
        setDashboardData(res.data);
        prepareChartData(res.data.charts || {});
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSeeMore = () => navigate("/admin/tasks");

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="relative">
        {/* Local Component Loader */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-xl">
            <Loader />
          </div>
        )}

        <div className={`${isLoading ? "opacity-40 pointer-events-none" : ""}`}>
          <div className="card my-5">
            <h2 className="text-xl md:text-2xl">Good Morning! {user?.name}</h2>
            <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
              {moment().format("dddd Do MMM YYYY")}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
              <InfoCard
                label="Total Tasks"
                value={addThousandsSeparator(
                  dashboardData?.charts?.taskDistribution?.All || 0
                )}
                color="bg-primary"
              />
              <InfoCard
                label="Pending Tasks"
                value={addThousandsSeparator(
                  dashboardData?.charts?.taskDistribution?.Pending || 0
                )}
                color="bg-violet-500"
              />
              <InfoCard
                label="In Progress Tasks"
                value={addThousandsSeparator(
                  dashboardData?.charts?.taskDistribution?.InProgress || 0
                )}
                color="bg-cyan-500"
              />
              <InfoCard
                label="Completed Tasks"
                value={addThousandsSeparator(
                  dashboardData?.charts?.taskDistribution?.Completed || 0
                )}
                color="bg-lime-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
            <div className="card shadow-xl/30">
              <h5 className="font-medium mb-2">Task Distribution</h5>
              <CustomPieChart data={pieChartData} colors={COLORS} />
            </div>

            <div className="card shadow-xl/30">
              <h5 className="font-medium mb-2">Task Priority Levels</h5>
              <CustomBarChart data={barChartData} />
            </div>

            <div className="md:col-span-2 card shadow-xl/30">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-lg">Recent Tasks</h5>
                <button className="card-btn" onClick={onSeeMore}>
                  See All <LuArrowRight className="text-base" />
                </button>
              </div>
              <TaskListTable tableData={dashboardData?.recentTasks || []} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
