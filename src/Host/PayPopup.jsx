import { useState } from 'react';
import './PayPopup.css';
import Banner1 from '../assets/advHost/banner1.png';
import Banner2 from '../assets/advHost/banner2.png';
import Banner3 from '../assets/advHost/banner3.png';

const banners = [Banner1, Banner2, Banner3];

export default function PayPopup({ onClose }) {
  const [index, setIndex] = useState(0);
  const [fadeClass, setFadeClass] = useState('fade-in');

  const triggerFade = (direction) => {
    setFadeClass('fade-out');
    setTimeout(() => {
      setIndex((prev) =>
        direction === 'next' ? prev + 1 : prev - 1
      );
      setFadeClass('fade-in');
    }, 200);
  };

  const handleNext = () => {
    if (index < banners.length - 1) {
      triggerFade('next');
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      triggerFade('prev');
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <img
          src={banners[index]}
          alt={`Banner ${index + 1}`}
          className={`popup-image ${fadeClass}`}
        />

        {index > 0 && (
          <button className="arrow left" onClick={handlePrev}>
            ◀
          </button>
        )}
        {index < banners.length - 1 && (
          <button className="arrow right" onClick={handleNext}>
            ▶
          </button>
        )}

        {/* Got it button */}
        <div className="button-container">
          <div className="button">
          <a href="#" onClick={onClose}>Got it</a>
          </div>
        </div>
      </div>
    </div>
  );
}
