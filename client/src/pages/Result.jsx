import { useLocation, useNavigate } from "react-router-dom";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;

  if (!data) {
    return <p>No result available</p>;
  }

  return (
    <div>
      <h2>Prediction Result</h2>

      <p><strong>Disease:</strong> {data.disease}</p>
      <p><strong>Risk:</strong> {data.risk}</p>
      <p><strong>Probability:</strong> {data.probability}</p>

      <button onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default Result;
