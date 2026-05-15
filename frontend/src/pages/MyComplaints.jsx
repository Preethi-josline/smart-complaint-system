import { useEffect, useState } from "react";
import { getMyComplaints } from "../services/api";
import { Link } from "react-router-dom";

const statusColor = {
  "Pending": "bg-yellow-100 text-yellow-700",
  "In Progress": "bg-blue-100 text-blue-700",
  "Resolved": "bg-green-100 text-green-700"
};

const priorityColor = {
  "Low": "bg-gray-100 text-gray-600",
  "Medium": "bg-orange-100 text-orange-600",
  "High": "bg-red-100 text-red-600"
};

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await getMyComplaints();
        setComplaints(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchComplaints();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Smart Complaint System</h1>
        <Link to="/dashboard" className="bg-white text-blue-600 px-4 py-1 rounded-lg font-semibold">
          Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto mt-10 px-4">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">My Complaints</h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : complaints.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <p className="text-gray-500 text-lg">No complaints yet.</p>
            <Link to="/raise-complaint" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">
              Raise a Complaint
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((c) => (
              <div key={c._id} className="bg-white rounded-2xl shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{c.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{c.category} • {c.location}</p>
                    <p className="text-gray-600 mt-2">{c.description}</p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[c.status]}`}>
                      {c.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColor[c.priority]}`}>
                      {c.priority}
                    </span>
                  </div>
                </div>
                <p className="text-gray-400 text-xs mt-3">
                  Submitted on {new Date(c.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyComplaints;