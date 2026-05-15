import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createComplaint } from "../services/api";

const RaiseComplaint = () => {
  const [form, setForm] = useState({
    title: "", description: "", category: "General", location: ""
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const navigate = useNavigate();

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const address = data.display_name || `${latitude}, ${longitude}`;
          setForm({ ...form, location: address });
        } catch {
          setForm({ ...form, location: `${latitude}, ${longitude}` });
        }
        setLocationLoading(false);
      },
      () => {
        setError("Unable to get location. Please enter manually.");
        setLocationLoading(false);
      }
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = (e) => {
    e.preventDefault();
    setImage(null);
    setImagePreview(null);
    document.getElementById("fileUpload").value = "";
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  try {
    await createComplaint({
      title: form.title,
      description: form.description,
      category: form.category,
      location: form.location
    });
    setSuccess("Complaint submitted successfully!");
    setTimeout(() => navigate("/my-complaints"), 1500);
  } catch (err) {
    setError(err.response?.data?.message || "Failed to submit complaint");
  }
  setLoading(false);
};
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Smart Complaint System</h1>
        <Link to="/dashboard" className="bg-white text-blue-600 px-4 py-1 rounded-lg font-semibold">
          Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto mt-10 px-4">
        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">Raise a Complaint</h2>

          {error && <p className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">{error}</p>}
          {success && <p className="bg-green-100 text-green-600 p-3 rounded-lg mb-4">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                placeholder="Brief title of your complaint"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option>General</option>
                <option>Road Maintenance</option>
                <option>Water Supply</option>
                <option>Electricity</option>
                <option>Sanitation</option>
                <option>Other</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter location or use current location"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={locationLoading}
                  className="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg font-semibold hover:bg-blue-200 whitespace-nowrap text-sm"
                >
                  {locationLoading ? "Getting..." : "📍 My Location"}
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                placeholder="Describe the issue in detail"
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            {/* Image/Video Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Image/Video (optional, max 5MB)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition relative">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="fileUpload"
                />

                {imagePreview ? (
                  <div className="relative">
                    {/* X remove button */}
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 font-bold text-xs z-10"
                    >
                      ✕
                    </button>

                    {/* Preview */}
                    {image?.type.startsWith("video") ? (
                      <video
                        src={imagePreview}
                        className="max-h-40 mx-auto rounded-lg"
                        controls
                      />
                    ) : (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-40 mx-auto rounded-lg object-cover"
                      />
                    )}
                    <p className="text-sm text-gray-500 mt-2">Click to change file</p>
                    <label htmlFor="fileUpload" className="cursor-pointer absolute inset-0" />
                  </div>
                ) : (
                  <label htmlFor="fileUpload" className="cursor-pointer block">
                    <p className="text-4xl mb-2">📎</p>
                    <p className="text-gray-500 text-sm">Click to upload image or video</p>
                    <p className="text-gray-400 text-xs mt-1">JPG, PNG, MP4 up to 5MB</p>
                  </label>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default RaiseComplaint;