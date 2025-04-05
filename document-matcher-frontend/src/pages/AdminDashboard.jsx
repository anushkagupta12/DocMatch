import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [scanStats, setScanStats] = useState({});
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const creditRes = await axios.get('http://localhost:5000/api/admin/credit-requests');
      const statsRes = await axios.get('http://localhost:5000/api/admin/stats');

      setRequests(creditRes.data);
      setScanStats(statsRes.data.scansPerDay);
      setTopUsers(statsRes.data.topUsers);
    };

    fetchData();
  }, []);

  const handleDecision = async (id, accept) => {
    await axios.post(`http://localhost:5000/api/admin/handle-request/${id}`, { accept });
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>

      <div className="card">
        <h3>Pending Credit Requests</h3>
        <ul>
          {requests.map(req => (
            <li key={req.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span>{req.userName} requests more credits</span>
              <div>
                <button className="btn btn-success" onClick={() => handleDecision(req.id, true)}>Accept</button>
                <button className="btn btn-danger" onClick={() => handleDecision(req.id, false)} style={{ marginLeft: '8px' }}>Reject</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h3>Scans Today</h3>
        <p style={{ color: '#4f46e5', fontSize: '20px' }}>{scanStats.today || 0}</p>
      </div>

      <div className="card">
        <h3>Top Users</h3>
        <ul>
          {topUsers.map(user => (
            <li key={user.id}>{user.name} - {user.scans} scans</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;