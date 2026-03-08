import { useLocation, useNavigate } from "react-router-dom";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { predictions, symptoms, reportData, predictionType, userData } = location.state || {};

  if (!predictions) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>No prediction data found.</h2>
        <button onClick={() => navigate("/health-form")}>Go Back</button>
      </div>
    );
  }

  const styles = {
    container: { maxWidth: "800px", margin: "30px auto", padding: "20px", fontFamily: "Arial, sans-serif", color: "#333" },
    card: { backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", padding: "25px", marginBottom: "20px" },
    title: { fontSize: "24px", color: "#2c3e50", marginBottom: "20px", borderBottom: "2px solid #eee", pb: "10px" },
    predictionBox: { padding: "15px", borderRadius: "8px", backgroundColor: "#f8f9fa", marginBottom: "15px", borderLeft: "5px solid #007bff" },
    diseaseName: { fontSize: "20px", fontWeight: "bold", color: "#007bff" },
    confidence: { fontSize: "16px", color: "#666", marginTop: "5px" },
    table: { width: "100%", borderCollapse: "collapse", marginTop: "15px" },
    th: { textAlign: "left", padding: "12px", backgroundColor: "#f1f3f5", borderBottom: "2px solid #dee2e6", fontSize: "14px" },
    td: { padding: "12px", borderBottom: "1px solid #eee", fontSize: "14px", color: "#444" },
    badge: { display: "inline-block", padding: "4px 12px", borderRadius: "20px", backgroundColor: "#e7f3ff", color: "#0066cc", fontSize: "12px", marginRight: "5px", marginBottom: "5px" },
    button: { padding: "12px 25px", backgroundColor: "#6c757d", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "16px" }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Analysis Results</h1>

      {/* 1. TOP PREDICTION */}
      <div style={styles.card}>
        <h2 style={styles.title}>Top Prediction</h2>
        <div style={styles.predictionBox}>
          <div style={styles.diseaseName}>{predictions[0]?.disease}</div>
          <div style={styles.confidence}>Confidence Level: {predictions[0]?.confidence}</div>
        </div>
        <p style={{ fontSize: "14px", color: "#666", fontStyle: "italic" }}>
          *Note: This is an AI-generated assessment. Please consult a doctor for official diagnosis.
        </p>
      </div>

      {/* 2. PATIENT INFO & SYMPTOMS */}
      <div style={styles.card}>
        <h2 style={styles.title}>Input Summary</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
          <div><strong>Age:</strong> {userData?.age}</div>
          <div><strong>BP:</strong> {userData?.bp}</div>
          {userData?.temperature && <div><strong>Temp:</strong> {userData?.temperature}°F</div>}
        </div>

        {predictionType === "symptoms" && symptoms?.length > 0 && (
          <div>
            <strong>Reported Symptoms:</strong>
            <div style={{ marginTop: "10px" }}>
              {symptoms.map((s, i) => (
                <span key={i} style={styles.badge}>{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. BLOOD REPORT DATA (Only shows if type is report) */}
      {predictionType === "report" && reportData && (
        <div style={styles.card}>
          <h2 style={styles.title}>Blood Parameter Details</h2>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <style>{`tr:hover { background-color: #f8f9fa; }`}</style>
                  <th style={styles.th}>Parameter</th>
                  <th style={styles.th}>Your Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(reportData).map(([key, value]) => (
                  <tr key={key}>
                    <td style={styles.td}>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</td>
                    <td style={{ ...styles.td, fontWeight: "bold" }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. OTHER POTENTIAL CONDITIONS */}
      {predictions.length > 1 && (
        <div style={styles.card}>
          <h2 style={styles.title}>Other Possibilities</h2>
          {predictions.slice(1).map((p, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee" }}>
              <span>{p.disease}</span>
              <span style={{ color: "#666" }}>{p.confidence}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "30px", marginBottom: "50px" }}>
        <button style={styles.button} onClick={() => navigate("/health-form")}>
          Perform New Analysis
        </button>
      </div>
    </div>
  );
};

export default Result;