import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';
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
} from 'chart.js';

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

const StudentCharts = ({ studentId }) => {
  const [student, setStudent] = useState(null);
  const [averages, setAverages] = useState(null);
  const subjects = ['maths', 'science', 'social'];
  const termLabels = ['Term 1', 'Term 2'];

  useEffect(() => {
    console.log('Fetching data for studentId:', studentId);
    const fetchData = async () => {
      try {
        const res = await axios.post(
          'http://localhost:3000/educator/students/visualdata',
          { studentId },
          { withCredentials: true }
        );

        console.log('Student data:', res.data);

        if (res.data.status === 'success') {
          setStudent(res.data.data.student);
          setAverages(res.data.data.averages);
        } else {
          console.error('Failed to fetch student data:', res.data.message);
        }
      } catch (error) {
        console.error('Error fetching student or averages:', error);
      }
    };

    if (studentId) fetchData();
  }, []);

  if (!student || !averages) {
    return <div className="text-center p-4">Loading charts...</div>;
  }

  const lineDatasets = subjects.map((subject) => ({
    label: subject.charAt(0).toUpperCase() + subject.slice(1),
    data: student.marks[subject],
    borderColor: getColor(subject),
    fill: false,
  }));

  const lineData = {
    labels: termLabels,
    datasets: lineDatasets,
  };

  const studentLatestMarks = subjects.map((subject) => student.marks[subject]?.[1] || 0);
  const schoolAverageMarks = subjects.map((subject) => averages.school[subject] || 0);
  const overallAverageMarks = subjects.map((subject) => averages.overall[subject] || 0);

  const barData = {
    labels: subjects.map((s) => s.toUpperCase()),
    datasets: [
      {
        label: 'Student',
        data: studentLatestMarks,
        backgroundColor: 'rgba(59, 130, 246, 0.6)', // blue-500
      },
      {
        label: 'School Avg',
        data: schoolAverageMarks,
        backgroundColor: 'rgba(234, 179, 8, 0.6)', // yellow-500
      },
      {
        label: 'Overall Avg',
        data: overallAverageMarks,
        backgroundColor: 'rgba(34, 197, 94, 0.6)', // green-500
      },
    ],
  };

  return (
    <div className="p-4 space-y-8">
      <h2 className="text-2xl font-bold mb-2">Student Progress</h2>
      <div className="bg-white rounded-xl p-4 shadow">
        <Line data={lineData} />
      </div>

      <h2 className="text-2xl font-bold mt-6 mb-2">Comparison with Averages</h2>
      <div className="bg-white rounded-xl p-4 shadow">
        <Bar data={barData} />
      </div>
    </div>
  );
};

function getColor(subject) {
  switch (subject) {
    case 'maths':
      return 'rgba(59, 130, 246, 1)'; // blue-500
    case 'science':
      return 'rgba(234, 88, 12, 1)'; // orange-600
    case 'social':
      return 'rgba(132, 204, 22, 1)'; // lime-400
    default:
      return 'rgba(0, 0, 0, 1)';
  }
}

export default StudentCharts;
