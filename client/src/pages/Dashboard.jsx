import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      <h2>Dashboard</h2>

      <div>
        <Link to="/health-form">
          <button>Start New Prediction</button>
        </Link>
      </div>

      <div>
        <Link to="/history">
          <button>View History</button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
