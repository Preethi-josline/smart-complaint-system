import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
  if (user?.role === "admin") navigate("/admin");
  if (user?.role === "staff") navigate("/staff");
}, [user, navigate]);

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Smart Complaint System</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Hello, {user?.name}</span>
          <button onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-1 rounded-lg font-semibold hover:bg-gray-100">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto mt-10 px-4">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/raise-complaint" className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="text-xl font-bold text-blue-600">Raise Complaint</h3>
            <p className="text-gray-500 mt-1">Submit a new complaint</p>
          </Link>
          <Link to="/my-complaints" className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-xl font-bold text-blue-600">My Complaints</h3>
            <p className="text-gray-500 mt-1">Track your submitted complaints</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;