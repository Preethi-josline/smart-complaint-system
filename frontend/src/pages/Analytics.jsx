import { useEffect, useState } from "react";
import { getAllComplaints } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444"];

const Analytics = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAllComplaints();
        setComplaints(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleLogout = () => { logout(); navigate("/login"); };

  // Data for charts
  const statusData = [
    { name: "Pending", value: complaints.filter(c => c.status === "Pending").length },
    { name: "In Progress", value: complaints.filter(c => c.status === "In Progress").length },
    { name: "Resolved", value: complaints.filter(c => c.status === "Resolved").length },
  ];

  const priorityData = [
    { name: "Low", value: complaints.filter(c => c.priority === "Low").length },
    { name: "Medium", value: complaints.filter(c => c.priority === "Medium").length },
    { name: "High", value: complaints.filter(c => c.priority === "High").length },
  ];

  const categoryData = complaints.reduce((acc, c) => {
    const existing = acc.find(item => item.name === c.category);
    if (existing) existing.value++;
    else acc.push({ name: c.category, value: 1 });
    return acc;
  }, []);

  const monthlyData = complaints.reduce((acc, c) => {
    const month = new Date(c.createdAt).toLocaleString("default", { month: "short" });
    const existing = acc.find(item => item.month === month);
    if (existing) existing.complaints++;
    else acc.push({ month, complaints: 1 });
    return acc;
  }, []);

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Analytics Dashboard</h1>
        <div className="flex items-center gap-4">
          <Link to="/admin" className="bg-white text-blue-600 px-4 py-1 rounded-lg font-semibold">
            Back to Admin
          </Link>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-1 rounded-lg font-semibold">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto mt-10 px-4 space-y-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{complaints.length}</p>
            <p className="text-gray-500 mt-1">Total</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-3xl font-bold text-yellow-500">
              {complaints.filter(c => c.status === "Pending").length}
            </p>
            <p className="text-gray-500 mt-1">Pending</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-3xl font-bold text-blue-400">
              {complaints.filter(c => c.status === "In Progress").length}
            </p>
            <p className="text-gray-500 mt-1">In Progress</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-3xl font-bold text-green-500">
              {complaints.filter(c => c.status === "Resolved").length}
            </p>
            <p className="text-gray-500 mt-1">Resolved</p>
          </div>
        </div>

        {/* Bar Chart — Monthly */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Monthly Complaints</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="complaints" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart — Status */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Status Breakdown</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart — Priority */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Priority Breakdown</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {priorityData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Category Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Analytics;