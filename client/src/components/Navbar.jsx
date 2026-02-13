import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav style={{ padding: "10px", background: "#eee" }}>
      {token && (
        <>
          <Link to="/dashboard">Dashboard</Link> |{" "}
          <Link to="/health-form">Health Form</Link> |{" "}
          <Link to="/history">History</Link> |{" "}
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
};

export default Navbar;
