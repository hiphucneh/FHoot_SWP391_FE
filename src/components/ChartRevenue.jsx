import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { Card, Statistic, Tabs, Spin, Alert } from "antd";
import { DollarOutlined, GiftOutlined } from "@ant-design/icons";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartRevenue = () => {
  const [revenueData, setRevenueData] = useState(null);
  const [selectedView, setSelectedView] = useState("daily");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/dashboard/revenue",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.statusCode !== 200) {
          throw new Error(res.data.message || "Failed to load revenue data");
        }

        setRevenueData(res.data.data.revenue);
      } catch (err) {
        setError(err.message || "Failed to load revenue");
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, [token]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Spin
          size="large"
          tip="Loading revenue data..."
          className="text-blue-500"
        />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className="max-w-md rounded-xl shadow-lg border border-red-200"
        />
      </div>
    );
  }

  // No data state
  if (!revenueData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Alert
          message="No Data"
          description="No revenue data available at this time."
          type="info"
          showIcon
          className="max-w-md rounded-xl shadow-lg border border-blue-200"
        />
      </div>
    );
  }

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { font: { size: 14, family: "Inter" }, color: "#1F2937" },
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.9)",
        titleFont: { size: 14, family: "Inter", weight: "bold" },
        bodyFont: { size: 12, family: "Inter" },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ${context.raw.toLocaleString()} VND`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Revenue (VND)",
          font: { size: 14, family: "Inter", weight: "bold" },
          color: "#1F2937",
        },
        ticks: {
          callback: (value) => value.toLocaleString(),
          font: { size: 12, family: "Inter" },
          color: "#1F2937",
        },
        grid: { color: "rgba(209, 213, 219, 0.3)" },
      },
      x: {
        title: {
          display: true,
          text: "Time",
          font: { size: 14, family: "Inter", weight: "bold" },
          color: "#1F2937",
        },
        ticks: { font: { size: 12, family: "Inter" }, color: "#1F2937" },
        grid: { display: false },
      },
    },
    animation: {
      duration: 1200,
      easing: "easeOutQuart",
    },
  };

  const dailyChart = {
    labels: revenueData.daily.map((d) => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: "Daily Revenue",
        data: revenueData.daily.map((d) => d.totalRevenue),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointBackgroundColor: "#FFFFFF",
        pointBorderColor: "#3B82F6",
        pointBorderWidth: 2,
      },
    ],
  };

  const weeklyChart = {
    labels: revenueData.weekly.map((w) => `W${w.week} ${w.month}/${w.year}`),
    datasets: [
      {
        label: "Weekly Revenue",
        data: revenueData.weekly.map((w) => w.totalRevenue),
        backgroundColor: "rgba(16, 185, 129, 0.7)",
        borderColor: "#10B981",
        borderWidth: 2,
        hoverBackgroundColor: "#10B981",
        borderRadius: 8,
      },
    ],
  };

  const monthlyChart = {
    labels: revenueData.monthly.map((m) => `${m.month}/${m.year}`),
    datasets: [
      {
        label: "Monthly Revenue",
        data: revenueData.monthly.map((m) => m.totalRevenue),
        backgroundColor: "rgba(99, 102, 241, 0.7)",
        borderColor: "#6366F1",
        borderWidth: 2,
        hoverBackgroundColor: "#6366F1",
        borderRadius: 8,
      },
    ],
  };

  const annualChart = {
    labels: revenueData.annual.map((y) => `${y.year}`),
    datasets: [
      {
        label: "Annual Revenue",
        data: revenueData.annual.map((y) => y.totalRevenue),
        backgroundColor: "rgba(245, 158, 11, 0.7)",
        borderColor: "#F59E0B",
        borderWidth: 2,
        hoverBackgroundColor: "#F59E0B",
        borderRadius: 8,
      },
    ],
  };

  const renderChart = () => {
    let chartData;
    switch (selectedView) {
      case "daily":
        chartData = dailyChart;
        return <Line data={chartData} options={chartOptions} />;
      case "weekly":
        chartData = weeklyChart;
        return <Bar data={chartData} options={chartOptions} />;
      case "monthly":
        chartData = monthlyChart;
        return <Bar data={chartData} options={chartOptions} />;
      case "annual":
        chartData = annualChart;
        return <Bar data={chartData} options={chartOptions} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Revenue Dashboard
        </h1>

        <div className="flex flex-wrap md:flex-nowrap gap-4 mb-6 w-full">
          <Card
            bordered={false}
            className="shadow-sm hover:shadow-md transition-all duration-300 flex-1 min-w-0"
            style={{
              borderRadius: 8,
              background: "linear-gradient(135deg, #E0F2FE 0%, #BFDBFE 100%)",
              padding: "8px",
            }}
          >
            <Statistic
              title={
                <span className="text-gray-700 font-medium flex items-center gap-1 text-xs">
                  <DollarOutlined className="text-blue-600" /> Total Revenue
                </span>
              }
              value={revenueData.total.totalRevenue}
              precision={0}
              valueStyle={{
                color: "#1F2937",
                fontSize: "16px",
                fontWeight: 600,
              }}
              suffix="VND"
            />
          </Card>

          <Card
            bordered={false}
            className="shadow-sm hover:shadow-md transition-all duration-300 flex-1 min-w-0"
            style={{
              borderRadius: 8,
              background: "linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 100%)",
              padding: "8px",
            }}
          >
            <Statistic
              title={
                <span className="text-gray-700 font-medium flex items-center gap-1 text-xs">
                  <GiftOutlined className="text-pink-600" /> Packages Sold
                </span>
              }
              value={revenueData.total.packageSold}
              precision={0}
              valueStyle={{
                color: "#1F2937",
                fontSize: "16px",
                fontWeight: 600,
              }}
            />
          </Card>
        </div>

        {/* Tabs for View Toggle */}
        <Tabs
          activeKey={selectedView}
          onChange={setSelectedView}
          centered
          items={[
            { key: "daily", label: "Daily" },
            { key: "weekly", label: "Weekly" },
            { key: "monthly", label: "Monthly" },
            { key: "annual", label: "Annual" },
          ]}
          className="mb-6"
          tabBarStyle={{
            fontWeight: 500,
            color: "#1F2937",
          }}
        />

        <div className="bg-white p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center capitalize">
            {selectedView} Revenue
          </h2>
          <div className="relative h-[600px]">{renderChart()}</div>
        </div>
      </div>
    </div>
  );
};

export default ChartRevenue;
