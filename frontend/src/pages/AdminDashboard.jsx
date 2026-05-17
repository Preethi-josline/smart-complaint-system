import { useEffect, useState } from "react";
import { getAllComplaints, assignComplaint, changePriority } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import NotificationBell from "../components/NotificationBell";
import axios from "axios";

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [complaintsRes, staffRes] = await Promise.all([
        getAllComplaints(),
        axios.get("https://smart-complaint-system-backend-vyet.onrender.com/api/auth/staff", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
      ]);
      setComplaints(complaintsRes.data);
      setStaffList(staffRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handlePriority = async (id, priority) => {
    await changePriority(id, { priority });
    fetchData();
  };

  const handleAssign = async (id, staffId) => {
    if (!staffId) return;
    await assignComplaint(id, { staffId });
    fetchData();
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  const statusColor = {
    "Pending": "bg-yellow-100 text-yellow-700",
    "In Progress": "bg-blue-100 text-blue-700",
    "Resolved": "bg-green-100 text-green-700"
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <div className="flex items-center gap-4">
            <span className="text-sm">Hello, {user?.name}</span>
            <NotificationBell />
            <Link to="/analytics" className="bg-yellow-400 text-white px-4 py-1 rounded-lg font-semibold">
              📊 Analytics
            </Link>
            <button onClick={handleLogout} className="bg-white text-blue-600 px-4 py-1 rounded-lg font-semibold">Logout</button>
          </div>
        </nav>

      <div className="max-w-6xl mx-auto mt-10 px-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{complaints.length}</p>
            <p className="text-gray-500 mt-1">Total Complaints</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-3xl font-bold text-yellow-500">
              {complaints.filter(c => c.status === "Pending").length}
            </p>
            <p className="text-gray-500 mt-1">Pending</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-3xl font-bold text-green-500">
              {complaints.filter(c => c.status === "Resolved").length}
            </p>
            <p className="text-gray-500 mt-1">Resolved</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-700 mb-4">All Complaints</h2>

        {loading ? <p>Loading...</p> : (
          <div className="space-y-4">
            {complaints.map((c) => (
              <div key={c._id} className="bg-white rounded-2xl shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{c.title}</h3>
                    <p className="text-gray-500 text-sm">{c.category} • {c.location}</p>
                    <p className="text-gray-600 mt-1">{c.description}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      By: {c.userId?.name} ({c.userId?.email})
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[c.status]}`}>
                    {c.status}
                  </span>
                </div>

                <div className="flex gap-4 mt-4 flex-wrap">
                  {/* Change Priority */}
                  <div className="min-w-[180px]">
                    <label className="text-xs text-gray-500 block mb-1">Change Priority</label>
                    <select
                      className="border rounded-lg px-3 py-2 text-sm w-full bg-white"
                      value={c.priority}
                      onChange={(e) => handlePriority(c._id, e.target.value)}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>

                  {/* Assign Staff */}
                  <div className="min-w-[220px]">
                    <label className="text-xs text-gray-500 block mb-1">Assign Staff</label>
                    <select
                      className="border rounded-lg px-3 py-2 text-sm w-full bg-white"
                      value={c.assignedTo?._id || ""}
                      onChange={(e) => handleAssign(c._id, e.target.value)}
                    >
                      <option value="">-- Select Staff --</option>
                      {staffList.map((s) => (
                        <option key={s._id} value={s._id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                

                  {/* Assigned to */}
                  {c.assignedTo && (
                    <div className="flex items-end">
                      <p className="text-xs text-green-600 font-semibold">
                        ✅ Assigned to: {c.assignedTo?.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;