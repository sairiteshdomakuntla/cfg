import React, { useState } from 'react';
import axios from 'axios';

const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
    } else {
      alert('Please select a valid .csv file');
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('csv_file', selectedFile);

    try {
      const response = await axios.post(
        'https://api.4rc.in/upload_csv_data_to_db/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
        /**
         * 
         * 
         */
      );
      alert(`File "${selectedFile.name}" submitted successfully!`);
      console.log(response.data);
      setSelectedFile(null); // Reset file input
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center min-h-[200px] bg-[#008080] rounded-lg p-6 space-y-4"
    >
      <label
        htmlFor="csv-upload"
        className="cursor-pointer bg-white text-[#008080] font-semibold py-2 px-4 rounded shadow hover:bg-gray-100 transition-colors"
      >
        Select CSV File
        <input
          id="csv-upload"
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      <p className="text-white text-sm">
        {selectedFile ? `Selected: ${selectedFile.name}` : 'Only .csv files are supported.'}
      </p>

      {selectedFile && (
        <button
          type="submit"
          className="bg-white text-[#008080] font-semibold py-2 px-6 rounded shadow hover:bg-gray-100 transition-colors"
        >
          Submit
        </button>
      )}
    </form>
  );
};

export default UploadFile;
