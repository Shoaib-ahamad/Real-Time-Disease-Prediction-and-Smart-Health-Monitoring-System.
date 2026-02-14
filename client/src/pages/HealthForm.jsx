import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const HealthForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: "",
    temperature: "",
    bp: "",
    symptoms: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Clean and process symptoms properly
      const symptomsArray = formData.symptoms
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "");

      const response = await API.post("/predict/symptoms", {
        age: Number(formData.age),
        temperature: Number(formData.temperature),
        bp: formData.bp,
        symptoms: symptomsArray,
      });

      // Navigate to result page with backend response
      navigate("/result", { state: response.data });

    } catch (err) {
      console.error("Prediction Error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "Prediction failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto" }}>
      <h2>Health Prediction Form</h2>

      <form onSubmit={handleSubmit}>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="number"
            name="temperature"
            placeholder="Temperature (°F)"
            value={formData.temperature}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="bp"
            placeholder="Blood Pressure (e.g. 120/80)"
            value={formData.bp}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="symptoms"
            placeholder="Symptoms (comma separated)"
            value={formData.symptoms}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Submit"}
        </button>

      </form>

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default HealthForm;
