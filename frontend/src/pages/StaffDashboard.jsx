import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { updateStatus } from "../services/api";
import axios from "axios";

const StaffDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchAssigned = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://smart-complaint-system-backend-vyet.onrender.com/api/complaints", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchAssigned(); }, []);

  const handleStatus = async (id, status) => {
    await updateStatus(id, { status });
    fetchAssigned();
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
        <h1 className="text-xl font-bold">Staff Panel</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Hello, {user?.name}</span>
          <button onClick={handleLogout} className="bg-white text-blue-600 px-4 py-1 rounded-lg font-semibold">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto mt-10 px-4">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Assigned Complaints</h2>

        {loading ? <p>Loading...</p> : complaints.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <p className="text-gray-500 text-lg">No complaints assigned yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((c) => (
              <div key={c._id} className="bg-white rounded-2xl shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{c.title}</h3>
                    <p className="text-gray-500 text-sm">{c.category} • {c.location}</p>
                    <p className="text-gray-600 mt-1">{c.description}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Submitted by: {c.userId?.name}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[c.status]}`}>
                    {c.status}
                  </span>
                </div>

                <div className="mt-4">
                  <label className="text-xs text-gray-500 block mb-1">Update Status</label>
                  <div className="flex gap-2">
                    {["Pending", "In Progress", "Resolved"].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatus(c._id, s)}
                        className={`px-3 py-1 rounded-lg text-sm font-semibold border transition
                          ${c.status === s
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                          }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;