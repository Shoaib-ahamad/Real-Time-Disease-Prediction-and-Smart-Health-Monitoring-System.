import { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";


//import "../styles/dashboard.css"

const Dashboard = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/predict/history");
        setRecords(res.data);
      } catch (err) {
        console.error("Dashboard Error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // ====== Stats Calculation ======
  const totalPredictions = records.length;

  const lastPrediction =
    records.length > 0 ? records[0].prediction : "N/A";

  const diseaseCount = {};
  records.forEach((rec) => {
    diseaseCount[rec.prediction] =
      (diseaseCount[rec.prediction] || 0) + 1;
  });

  const mostFrequentDisease =
    Object.keys(diseaseCount).length > 0
      ? Object.keys(diseaseCount).reduce((a, b) =>
          diseaseCount[a] > diseaseCount[b] ? a : b
        )
      : "N/A";
      const chartData = Object.keys(diseaseCount).map((disease) => ({
  name: disease,
  count: diseaseCount[disease],
}));


  if (loading) return <p>Loading dashboard...</p>;
return (
  <motion.div
    className="max-w-7xl mx-auto space-y-14"
    initial="hidden"
    animate="visible"
    variants={{
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.15,
        },
      },
    }}
  >

    {/* Header Section */}
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <h1 className="text-4xl font-bold tracking-tight">
        Dashboard
      </h1>
      <p className="text-gray-400 mt-2">
        Overview of your health predictions and activity.
      </p>
    </motion.div>


    {/* Overview Section */}
    <motion.section
      className="space-y-6"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <h2 className="text-lg text-gray-400 uppercase tracking-wider">
        Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-lg"
        >
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary opacity-10 rounded-full blur-3xl"></div>
          <p className="text-gray-400 text-sm">Total Predictions</p>
          <h2 className="text-5xl font-bold mt-4">
            {totalPredictions}
          </h2>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-lg"
        >
          <p className="text-gray-400 text-sm">Last Prediction</p>
          <h2 className="text-2xl font-semibold mt-4">
            {lastPrediction}
          </h2>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-lg"
        >
          <p className="text-gray-400 text-sm">Most Frequent</p>
          <h2 className="text-2xl font-semibold mt-4">
            {mostFrequentDisease}
          </h2>
        </motion.div>

      </div>
    </motion.section>


    {/* Divider */}
    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>


    {/* Analytics Section */}
    <motion.section
      className="space-y-6"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <h2 className="text-lg text-gray-400 uppercase tracking-wider">
        Analytics
      </h2>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-lg">

        {chartData.length === 0 ? (
          <p className="text-gray-500">
            No prediction data available yet.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="name" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111",
                  border: "1px solid #333",
                  borderRadius: "10px",
                }}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.7}/>
                </linearGradient>
              </defs>
              <Bar
                dataKey="count"
                fill="url(#colorGradient)"
                radius={[12, 12, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}

      </div>
    </motion.section>


    {/* Recent Activity Section */}
    <motion.section
      className="space-y-6"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <h2 className="text-lg text-gray-400 uppercase tracking-wider">
        Recent Activity
      </h2>

      <div className="space-y-4">
        {records.slice(0, 3).map((rec) => (
          <div
            key={rec._id}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-xl hover:bg-white/10 transition"
          >
            <p className="font-medium">{rec.prediction}</p>
            <p className="text-gray-400 text-sm mt-1">
              {new Date(rec.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </motion.section>

  </motion.div>
);


};
export default Dashboard;
