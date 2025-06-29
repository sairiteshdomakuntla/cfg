import React, { useState } from 'react';
import axios from 'axios';

const Student = ({ studentId, username }) => {
  console.log("Student component loaded for:", studentId);
  const [form, setForm] = useState({
    school: '',
    parent_phone: '',
    family_no: '',
    family_income: '',
    marks: { maths: '', science: '', social: '' },
    feedbacks: ['']
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMarksChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      marks: {
        ...prev.marks,
        [name]: value
      }
    }));
  };

  const handleFeedbackChange = (idx, e) => {
    const value = e.target.value;
    setForm(prev => {
      const updated = [...prev.feedbacks];
      updated[idx] = value;
      return { ...prev, feedbacks: updated };
    });
  };

  const addFeedback = () => {
    setForm(prev => ({
      ...prev,
      feedbacks: [...prev.feedbacks, '']
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const transformedMarks = {
      maths: Number(form.marks.maths),
      science: Number(form.marks.science),
      social: Number(form.marks.social),
    };

    try {
      const response = await axios.post(
        `https://vision-global.onrender.com/educator/students/edit`,
        {
          studentId,
          school: form.school,
          parent_phone: form.parent_phone,
          family_no: parseInt(form.family_no, 10),
          family_income: parseFloat(form.family_income),
          marks: transformedMarks,
          feedbacks: form.feedbacks
        },
        { withCredentials: true }
      );
      console.log("Response from server:", response);
      if (  response.status === 200) {
        alert('Student details submitted successfully!');
        setForm({
          school: '',
          parent_phone: '',
          family_no: '',
          family_income: '',
          marks: { maths: '', science: '', social: '' },
          feedbacks: ['']
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-teal-600 text-center mb-6">
        Student: {username}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Fields */}
        <div>
          <label className="block text-teal-700 font-medium mb-1">School Name:</label>
          <input
            type="text"
            name="school"
            value={form.school}
            onChange={handleChange}
            
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-teal-700 font-medium mb-1">Parent's Phone Number:</label>
          <input
            type="tel"
            name="parent_phone"
            value={form.parent_phone}
            onChange={handleChange}
            
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-teal-700 font-medium mb-1">No. of People in Family:</label>
            <input
              type="number"
              name="family_no"
              value={form.family_no}
              onChange={handleChange}
              min="1"
              
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-teal-700 font-medium mb-1">Family Income (INR):</label>
            <input
              type="number"
              name="family_income"
              value={form.family_income}
              onChange={handleChange}
              min="0"
              
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Marks Section */}
        <div>
          <label className="block text-teal-700 font-medium mb-2">Marks:</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="number"
              name="maths"
              placeholder="Maths"
              value={form.marks.maths}
              onChange={handleMarksChange}
              
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="number"
              name="science"
              placeholder="Science"
              value={form.marks.science}
              onChange={handleMarksChange}
              
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="number"
              name="social"
              placeholder="Social"
              value={form.marks.social}
              onChange={handleMarksChange}
              
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Feedback Section */}
        <div>
          <label className="block text-teal-700 font-medium mb-2">Feedback:</label>
          <div className="space-y-3">
            {form.feedbacks.map((fb, idx) => (
              <textarea
                key={idx}
                placeholder={`Feedback ${idx + 1}`}
                value={fb}
                onChange={(e) => handleFeedbackChange(idx, e)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            ))}
            <button
              type="button"
              onClick={addFeedback}
              className="text-sm text-teal-700 hover:underline font-medium"
            >
              + Add More Feedback
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Student;
