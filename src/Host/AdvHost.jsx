import './AdvHost.css';
import BannerHost from '../assets/host/banner-host.png';

function AdvHost({ show, onClose }) {
  if (!show) return null;

  const handleClick = () => {
    window.location.href = "/payhost"; // 👉 chuyển router và reload
  };

  return (
    <div className="advhost-overlay">
      <div className="advhost-modal">
        <img src={BannerHost} alt="Become a Host" className="advhost-banner" />
        <button className="advhost-contact-button" onClick={handleClick}>
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
