import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PayHost.css';
import PayPopup from './PayPopup';

function PayHost() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(true); // ✅ Quản lý trạng thái hiển thị popup

  const handleChoosePlan = (plan) => {
    navigate('/payment', { state: { selectedPlan: plan } });
  };

  return (
    <div className="payhost-page">
      {/* ✅ Hiển thị popup khi showPopup = true */}
      {showPopup && <PayPopup onClose={() => setShowPopup(false)} />}

      <div className="payhost-header">
        <h1>🚀 Upgrade to Kahoot! Host</h1>
        <p>Unlock premium features and start hosting today!</p>
      </div>

      <div className="payhost-options">
        <div className="payhost-card">
          <h2>🌟 1 Month</h2>
          <p className="price">$5.99</p>
          <ul>
            <li>Manage games anytime</li>
            <li>AI-powered Quiz Builder</li>
            <li>1-month full access</li>
          </ul>
          <button onClick={() => handleChoosePlan('1 Month')}>Choose Plan</button>
        </div>

        <div className="payhost-card popular">
          <div className="popular-badge">Most Popular 🔥</div>
          <h2>🚀 3 Months</h2>
          <p className="price">$15.99</p>
          <ul>
            <li>Priority Hosting Support</li>
            <li>AI Quiz Builder + Image Generator</li>
            <li>Save 10%</li>
          </ul>
          <button onClick={() => handleChoosePlan('3 Months')}>Choose Plan</button>
        </div>

        <div className="payhost-card">
          <h2>🏆 9 Months</h2>
          <p className="price">$39.99</p>
          <ul>
            <li>Best Value: Save 25%</li>
            <li>All Premium Features Included</li>
            <li>Long-Term Hosting Access</li>
          </ul>
          <button onClick={() => handleChoosePlan('9 Months')}>Choose Plan</button>
        </div>
      </div>

      <div className="payhost-back">
        <button onClick={() => navigate('/')}>⬅ Back to Home</button>
      </div>
    </div>
  );
}

export default PayHost;
