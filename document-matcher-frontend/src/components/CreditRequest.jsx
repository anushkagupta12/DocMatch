import { useState } from 'react';

const CreditRequestForm = () => {
  const [requested, setRequested] = useState(false);

  const requestCredits = () => {
    setRequested(true);
  };

  return (
    <div className="card">
      <h4>Out of credits?</h4>
      <button className="btn btn-primary" onClick={requestCredits}>Request More</button>
      {requested && <p style={{ color: 'green', marginTop: '8px' }}>Request submitted!</p>}
    </div>
  );
};

export default CreditRequestForm;