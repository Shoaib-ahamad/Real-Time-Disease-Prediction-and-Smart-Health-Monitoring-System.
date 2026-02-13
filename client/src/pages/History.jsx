import { useEffect, useState } from "react";
import API from "../services/api";

const History = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/history");
        setRecords(res.data);
      } catch (err) {
        console.error("Failed to fetch history");
      }
    };

    fetchHistory();
  }, []);

  return (
    <div>
      <h2>Prediction History</h2>

      {records.length === 0 ? (
        <p>No records found</p>
      ) : (
        records.map((record, index) => (
          <div key={index} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <p><strong>Disease:</strong> {record.prediction}</p>
            <p><strong>Risk:</strong> {record.risk}</p>
            <p><strong>Date:</strong> {new Date(record.createdAt).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default History;
