import { useNavigate } from "react-router-dom";
import './AdvForTeacher.css';
import BannerUp from '../assets/host/bannerup.png';
import BannerCre from '../assets/host/bannercre.png';

function AdvForTeacher({ show, onClose }) {
  const navigate = useNavigate();

  if (!show) return null;

  return (
    <div className="advteacher-overlay">
      <div className="advteacher-modal">
        <div className="advteacher-content">
          <div className="advteacher-left">
            <img src={BannerUp} alt="Extend Host" className="advteacher-image" />
          </div>
          <div className="advteacher-right">
            <img src={BannerCre} alt="Create Kahoot" className="advteacher-image" />
          </div>
        </div>

        <div className="advteacher-buttons">
          <button
            className="extend-button"
            onClick={() => {
              onClose();
              navigate("/payhost");
            }}
          >
            ✨ Up to 9 months!
          </button>

          <button
            className="create-button"
            onClick={() => {
              onClose();
              navigate("/createK");
            }}
          >
            🚀 Create Kahoot!
          </button>
        </div>

        <button className="advteacher-close" onClick={onClose}>
          ✖
        </button>
      </div>
    </div>
  );
}

export default AdvForTeacher;
