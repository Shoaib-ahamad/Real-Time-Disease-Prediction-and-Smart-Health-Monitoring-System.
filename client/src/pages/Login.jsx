import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";
import Captcha from "../components/Captcha";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // captcha states
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (captchaInput !== captchaCode) {
      setError("Invalid captcha. Please try again.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", formData);

      localStorage.setItem("token", response.data.token);

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);

    } catch (err) {
      console.error("Login Error:", err);

      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else if (err.response?.status === 404) {
        setError("User not found. Please check your email or register");
      } else if (err.response?.status === 429) {
        setError("Too many login attempts. Please try again later");
      } else if (!err.response) {
        setError("Network error. Please check your connection");
      } else {
        setError(err.response?.data?.message || "Login failed");
      }

    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px"
    },
    card: {
      maxWidth: "450px",
      width: "100%",
      backgroundColor: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(10px)",
      borderRadius: "20px",
      padding: "40px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
    },
    header: { textAlign: "center", marginBottom: "30px" },
    title: { fontSize: "32px", fontWeight: "700", color: "#333" },
    subtitle: { color: "#666", fontSize: "14px" },
    form: { display: "flex", flexDirection: "column", gap: "20px" },
    inputGroup: { position: "relative" },
    label: { marginBottom: "8px", fontSize: "14px", color: "#555" },
    input: {
      width: "100%",
      padding: "12px 16px",
      border: "2px solid #e0e0e0",
      borderRadius: "10px",
      outline: "none"
    },
    button: {
      padding: "14px",
      color: "white",
      border: "none",
      borderRadius: "10px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      cursor: "pointer"
    },
    error: {
      padding: "12px",
      backgroundColor: "#fee",
      border: "1px solid #fcc",
      borderRadius: "8px",
      color: "#c00",
      fontSize: "14px"
    },
    footer: { textAlign: "center", marginTop: "25px", color: "#666" },
    link: { color: "#667eea", textDecoration: "none", fontWeight: "600" }
  };

  return (
    <div style={styles.container}>
      <motion.div
        style={styles.card}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        <div style={styles.header}>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>

          <motion.div variants={itemVariants}>
            <label style={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label style={styles.label}>Password</label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
            />
          </motion.div>

          {/* CAPTCHA */}
          <motion.div variants={itemVariants}>
            <label style={styles.label}>Captcha</label>

            <Captcha onCodeChange={setCaptchaCode} />

            <input
              type="text"
              placeholder="Enter captcha"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              style={{ ...styles.input, marginTop: "10px" }}
            />
          </motion.div>

          <button style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Sign In"}
          </button>

          {error && <div style={styles.error}>{error}</div>}
        </form>

        <div style={styles.footer}>
          Don't have an account?
          <Link to="/register" style={styles.link}> Sign up</Link>
        </div>

      </motion.div>
    </div>
  );
};

export default Login;