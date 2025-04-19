import React from 'react';
import './Header.css'; // Import CSS cho header

function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <a href="#" className="logo">
              <i className="fa-brands fa-pied-piper-alt"></i> {/* Logo */}
            </a>
          </li>
          <li><a href="#" className="link">Home</a></li>
          <li><a href="#" className="link">About</a></li>
          <li><a href="#" className="link">Skills</a></li>
          <li><a href="#" className="link">Projects</a></li>
          <li>
            <a href="#" className="link" id="hire-me">
              <i className="fa-regular fa-envelope"></i> Hire me
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;