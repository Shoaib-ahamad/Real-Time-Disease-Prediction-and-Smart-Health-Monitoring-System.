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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/predict/symptoms", {
        ...formData,
        symptoms: formData.symptoms.split(","),
      });

      navigate("/result", { state: response.data });
    } catch (err) {
      setError("Prediction failed");
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Health Form</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="temperature"
          placeholder="Temperature"
          value={formData.temperature}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="bp"
          placeholder="Blood Pressure (e.g. 120/80)"
          value={formData.bp}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="symptoms"
          placeholder="Symptoms (comma separated)"
          value={formData.symptoms}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Submit"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default HealthForm;
