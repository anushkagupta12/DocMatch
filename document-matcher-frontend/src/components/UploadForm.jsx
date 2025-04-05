import { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [matchResult, setMatchResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file1', file1);
    formData.append('file2', file2);

    try {
      const res = await axios.post('http://localhost:5000/api/match', formData);
      setMatchResult(res.data);
    } catch (err) {
      alert('Error matching documents');
    }
  };

  return (
    <div className="card">
      <h3>Upload Documents</h3>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".txt" onChange={e => setFile1(e.target.files[0])} required />
        <input type="file" accept=".txt" onChange={e => setFile2(e.target.files[0])} required />
        <button type="submit" className="btn btn-primary">Match</button>
      </form>

      {matchResult && (
        <div className="mt-4">
          <p style={{ color: 'green', fontWeight: '500' }}>Similarity Score: {matchResult.similarity}%</p>
        </div>
      )}
    </div>
  );
};

export default UploadForm;