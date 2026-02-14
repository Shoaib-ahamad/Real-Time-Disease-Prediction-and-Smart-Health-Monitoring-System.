import { useEffect, useState } from "react";
import API from "../services/api";

const History = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/predict/history");
        setRecords(res.data);
      } catch (err) {
        console.error("History Error:", err.response?.data || err.message);
        setError("Failed to fetch history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h2>Prediction History</h2>

      {loading && <p>Loading history...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && records.length === 0 && (
        <p>No prediction records found.</p>
      )}

      {!loading &&
        records.map((record) => (
          <div
            key={record._id}
            style={{
              border: "1px solid #ccc",
              marginBottom: "15px",
              padding: "15px",
              borderRadius: "6px",
            }}
          >
            <p>
              <strong>Disease:</strong> {record.prediction}
            </p>

            <p>
              <strong>Risk:</strong> {record.risk || "N/A"}
            </p>

            {record.symptoms && (
              <p>
                <strong>Symptoms:</strong>{" "}
                {Array.isArray(record.symptoms)
                  ? record.symptoms.join(", ")
                  : record.symptoms}
              </p>
            )}

            <p>
              <strong>Date:</strong>{" "}
              {new Date(record.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
    </div>
  );
};

export default History;
