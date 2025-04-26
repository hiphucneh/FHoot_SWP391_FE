import './Footer.css';
import AppStore from '../assets/footer/AppStore.png';
import GooglePlay from '../assets/footer/GoolgePlay.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Column 1 - About */}
        <div className="footer-column">
          <h3>Kahoot! Fun</h3>
          <p>We bring fun, creative, and accessible learning experiences for all ages.</p>
          <p>Join millions of students, teachers, and parents around the world!</p>
        </div>

        {/* Column 2 - Products */}
        <div className="footer-column">
          <h4>Products</h4>
          <ul>
            <li><a href="#">Kahoot Live!</a></li>
            <li><a href="#">Quiz Builder</a></li>
            <li><a href="#">Flashcards</a></li>
            <li><a href="#">Game Library</a></li>
          </ul>
        </div>

        {/* Column 3 - Support */}
        <div className="footer-column">
          <h4>Support</h4>
          <ul>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Contact Support</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>

        {/* Column 4 - Connect */}
        <div className="footer-column">
          <h4>Connect with Us</h4>
          <div className="footer-socials">
            <a href="#"><i className="ri-facebook-circle-fill"></i></a>
            <a href="#"><i className="ri-instagram-fill"></i></a>
            <a href="#"><i className="ri-twitter-x-fill"></i></a>
            <a href="#"><i className="ri-youtube-fill"></i></a>
          </div>
          <p className="download-text">Download our app:</p>
          <div className="footer-apps">
            <img src={AppStore} alt="App Store" />
            <img src={GooglePlay} alt="Google Play" />
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © 2025 Kahoot! Fun. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
