import './AdvHost.css';
import BannerHost from '../assets/host/banner-host.png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'; // thêm useState
import confetti from 'canvas-confetti';

function AdvHost({ show, onClose }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // trạng thái loading

  useEffect(() => {
    if (show) {
      fireConfetti();
    }
  }, [show]);

  const fireConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 120,
      origin: { y: 0.6 }
    });
  };

  const handleBecomeHost = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClose();
      navigate('/payhost');
    }, 500); // loading 0.5 giây
  };

  if (!show) return null;

  return (
    <div className="advhost-overlay">
      <div className="advhost-modal">
        <img src={BannerHost} alt="Become a Host" className="advhost-banner" />
        <button
          className="advhost-contact-button"
          onClick={handleBecomeHost}
          disabled={loading} // không cho click khi đang loading
        >
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            '🚀 Become a Host NOW!'
          )}
        </button>

        <button className="advhost-close" onClick={onClose}>
          ✖
        </button>
      </div>
    </div>
  );
}

export default AdvHost;
