import React from "react";
import "./Header.css"; // Import CSS cho header
import { RiAccountCircleFill } from "react-icons/ri";

function Header() {
  return (
    <header class="header" id="header">
      <nav class="nav container_head">
        <a href="#" class="nav__logo">
          Logo
        </a>

        <div class="nav__menu" id="nav-menu">
          <ul class="nav__list">
            <li class="nav__item">
              <a href="#" class="nav__link">
                Home
              </a>
            </li>

            <li class="nav__item">
              <a href="#" class="nav__link">
                About Us
              </a>
            </li>

            <li class="nav__item">
              <a href="#" class="nav__link">
                Services
              </a>
            </li>

            <li class="nav__item">
              <a href="#" class="nav__link">
                Featured
              </a>
            </li>

            <li class="nav__item">
              <a href="#" class="nav__link">
                Contact Me
              </a>
            </li>

            <li class="nav__item">
              <a href="#" class="nav__link">
                Log In
              </a>
            </li>

            <li>
              <a href="#" className="link" id="sign-up">
                <i className="fa-regular fa-envelope"></i> Sign Up
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
