import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import axios from "axios";
import Conversations from "./Conversation";          // ⬅️ add path if different
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const subjects    = ["maths", "science", "social"];
const termLabels  = ["Term 1", "Term 2"];

export default function StudentCharts({ studentId }) {
  const [student,  setStudent]  = useState(null);
  const [averages, setAverages] = useState(null);

  useEffect(() => {
    if (!studentId) return;

    (async () => {
      try {
        const { data } = await axios.post(
          "https://vision-global.onrender.com/educator/students/visualdata",
          { studentId },
          { withCredentials: true }
        );
        if (data.status === "success") {
          setStudent(data.data.student);
          setAverages(data.data.averages);
        } else {
          console.error("fetch failed:", data.message);
        }
      } catch (err) {
        console.error("error fetching visual data:", err);
      }
    })();
  }, [studentId]);

  if (!student || !averages) return <div className="text-center p-4">Loading charts…</div>;

  /* ---------- line chart ---------- */
  const lineDatasets = subjects.map((s) => ({
    label: s[0].toUpperCase() + s.slice(1),
    data: student.marks[s],
    borderColor: getColor(s),
    fill: false,
  }));

  const lineData = { labels: termLabels, datasets: lineDatasets };

  /* ---------- bar chart ---------- */
  const barData = {
    labels: subjects.map((s) => s.toUpperCase()),
    datasets: [
      {
        label: "Student",
        data: subjects.map((s) => student.marks[s]?.[1] || 0),
        backgroundColor: "rgba(59,130,246,0.6)",
      },
      {
        label: "School Avg",
        data: subjects.map((s) => averages.school[s] || 0),
        backgroundColor: "rgba(234,179,8,0.6)",
      },
      {
        label: "Overall Avg",
        data: subjects.map((s) => averages.overall[s] || 0),
        backgroundColor: "rgba(34,197,94,0.6)",
      },
    ],
  };

  return (
    <div className="p-4 space-y-8">
      {/* progress */}
      <section className="bg-white rounded-xl p-4 shadow">
        <h2 className="text-2xl font-bold mb-4">Student Progress</h2>
        <Line data={lineData} />
      </section>

      {/* comparison */}
      <section className="bg-white rounded-xl p-4 shadow">
        <h2 className="text-2xl font-bold mb-4">Comparison with Averages</h2>
        <Bar data={barData} />
      </section>

      {/* conversations */}
      <section className="bg-white rounded-xl p-4 shadow">
        <h2 className="text-2xl font-bold mb-4">Conversations</h2>
        <Conversations studentId={studentId} />
      </section>
    </div>
  );
}

/* helper */
function getColor(subject) {
  switch (subject) {
    case "maths":
      return "rgba(59,130,246,1)";
    case "science":
      return "rgba(234,88,12,1)";
    case "social":
      return "rgba(132,204,22,1)";
    default:
      return "rgba(0,0,0,1)";
  }
}
