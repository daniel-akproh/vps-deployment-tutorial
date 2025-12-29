import { useState } from 'react';
import { checkHealth } from '../api';

function HealthCheck() {
  const [healthData, setHealthData] = useState('Click button to check');
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckHealth = async () => {
    setIsChecking(true);
    try {
      const data = await checkHealth();
      setHealthData(JSON.stringify(data, null, 2));
    } catch (error) {
      setHealthData(`Error: ${error.message}`);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="card">
      <h3>🏥 System Health</h3>
      <button onClick={handleCheckHealth} disabled={isChecking}>
        {isChecking ? 'Checking...' : 'Check Status'}
      </button>
      <div className="health-box">{healthData}</div>
    </div>
  );
}

export default HealthCheck;
