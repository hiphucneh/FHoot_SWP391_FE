import React from 'react';
import './BlockJoinGame.css';
import WarningGif from '../assets/warning.gif';

function BlockJoinGame({ show, onClose, title, message, buttonText }) {
  if (!show) return null;

  return (
    <div className="block-join-overlay">
      <div className="block-join-modal animate-popup">
        <img src={WarningGif} alt="Warning" className="warning-gif" />
        <h2>{title || "Access Restricted"}</h2>  {/* <-- dùng title nếu có */}
        <p>{message}</p>
        <div className="center">
          <button className="btn" onClick={onClose}>
            <svg width="180px" height="60px" viewBox="0 0 180 60" className="border">
              <polyline points="179,1 179,59 1,59 1,1 179,1" />
              <polyline points="179,1 179,59 1,59 1,1 179,1" />
            </svg>
            <span>{buttonText || "Got it!"}</span> {/* <-- dùng buttonText nếu có */}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlockJoinGame;
