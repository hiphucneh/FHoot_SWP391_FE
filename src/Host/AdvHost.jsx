import './AdvHost.css';
import BannerHost from '../assets/host/banner-host.png';

function AdvHost({ show, onClose, onBecomeHost }) {
  if (!show) return null;

  return (
    <div className="advhost-overlay">
      <div className="advhost-modal">
        <img src={BannerHost} alt="Become a Host" className="advhost-banner" />
        <button className="advhost-contact-button" onClick={() => {
          onClose();
          setTimeout(() => {
            onBecomeHost();
          }, 300);
        }}>
          🚀 Become a Host NOW!
        </button>

        <button className="advhost-close" onClick={onClose}>
          ✖
        </button>
      </div>
    </div>
  );
}

export default AdvHost;
