import React, { useState } from 'react';
import Upload from '../assets/upload.png';
import { FaCheck } from 'react-icons/fa';
import axios from 'axios';

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (e) => {
    setUploadedFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setUploadedFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('xlsx', uploadedFile);

      const response = await axios.post('http://localhost:3001/candidates/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSubmissionStatus('success');
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error submitting file:', error);
      setSubmissionStatus('error');
      setIsSubmitting(false);
    }
  };

  return (
    <main className='mt-12 ml-14 p-9'>
      <p className='text-lg'>Add Candidates to Database</p>
      <div
        className='flex flex-col items-center mt-36'
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {submissionStatus === 'success' ? (
          <div className='border-4 border-solid border-gray-300 p-6 flex flex-col items-center gap-4 min-w-[1200px]'>
            <div className='text-lg font-semibold text-green-500'>Thank you!</div>
            <div className='flex flex-row gap-3 items-center'>
              <FaCheck size={20} className='text-green-500' />
              <div className='text-lg'>File Succesfully Uploaded.</div>
            </div>
            <div className='text-lg'>Your records will be processed shortly.</div>
          </div>
        ) : (
          <label htmlFor='file-upload' className='cursor-pointer'>
            <div className='border-4 border-solid border-gray-300 p-6 flex flex-col items-center gap-4 min-w-[1200px]'>
              <input
                onChange={handleFileUpload}
                type='file'
                id='file-upload'
                accept='.xlsx, .xls'
                className='hidden'
              />
              <div className='flex justify-center items-center'>
                <img src={Upload} alt='Upload icon' />
              </div>
              {uploadedFile.name ? (
                <div className='text-lg text-gray-600'>{uploadedFile.name}</div>
              ) : (
                <div className='text-lg text-gray-600'>
                  Upload a .xlsx or .xls file here
                </div>
              )}
              {uploadedFile.name && (
                <button
                  onClick={handleSubmit}
                  className='bg-green-700 hover:bg-green-900 text-white py-2 px-4 rounded-xl'
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              )}
            </div>
          </label>
        )}
      </div>
    </main>
  );
}
