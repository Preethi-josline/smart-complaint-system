import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

const roles = [
  { label: "User", value: "user", icon: "👤", color: "bg-blue-500" },
  { label: "Admin", value: "admin", icon: "🛡️", color: "bg-purple-500" },
  { label: "Staff", value: "staff", icon: "👷", color: "bg-green-500" },
];

const savedEmails = {
  user: "",
  admin: "admin@gmail.com",
  staff: "",
};

const Login = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setForm({ email: savedEmails[role] || "", password: "" });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🏛️</div>
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 mt-1">Smart Complaint System</p>
        </div>

        {/* Role Selection */}
        {!selectedRole ? (
          <div>
            <p className="text-center text-gray-600 font-medium mb-4">
              Who are you? Select your role to continue
            </p>
            <div className="space-y-3">
              {roles.map((role) => (
                <button
                  key={role.value}
                  onClick={() => handleRoleSelect(role.value)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl text-white font-semibold text-lg transition hover:opacity-90 hover:scale-105 ${role.color}`}
                >
                  <span className="text-3xl">{role.icon}</span>
                  <span>Login as {role.label}</span>
                  <span className="ml-auto">→</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {/* Back button */}
            <button
              onClick={() => setSelectedRole(null)}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 text-sm"
            >
              ← Back to role selection
            </button>

            {/* Selected role badge */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold mb-6 w-fit
              ${roles.find(r => r.value === selectedRole)?.color}`}>
              <span>{roles.find(r => r.value === selectedRole)?.icon}</span>
              <span>Logging in as {roles.find(r => r.value === selectedRole)?.label}</span>
            </div>

            {error && (
              <p className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-white text-lg transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
              >
                {loading ? "Logging in..." : "Login →"}
              </button>
            </form>

            <p className="text-center text-gray-500 mt-4 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-purple-600 font-semibold hover:underline">
                Register
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;