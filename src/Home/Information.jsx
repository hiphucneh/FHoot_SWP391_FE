import './Information.css';
import { useNavigate } from 'react-router-dom';

function Information() {
  const navigate = useNavigate();

  return (
    <div className="info-page">
      <div className="info-inner">
        <div className="info-header">
          <h1>About Kahoot! <span className="highlight">Fun</span></h1>
          <p>Learn everything about our platform, mission, and policies.</p>
        </div>

        <div className="info-section">
          <h2>🌟 About Us</h2>
          <p>
            Kahoot! Fun is a vibrant learning platform designed to make education exciting, interactive, and accessible for all ages.
            We aim to inspire curiosity and joy in learning through live quizzes, games, and community engagement.
          </p>
        </div>

        <div className="info-section">
          <h2>🎯 Our Audience</h2>
          <ul>
            <li>👉 Students from Kindergarten to University</li>
            <li>👉 Teachers and Educators</li>
            <li>👉 Parents supporting home learning</li>
            <li>👉 Anyone who loves to learn in a fun way!</li>
          </ul>
        </div>

        <div className="info-section">
          <h2>📜 Terms of Use</h2>
          <p>
            By accessing and using Kahoot! Fun, users agree to comply with our community standards and platform rules. 
            This includes treating others with respect, refraining from offensive or harmful behavior, and maintaining a safe environment for all learners.
          </p>
          <p>
            Users must not upload content that is unlawful, threatening, abusive, defamatory, obscene, or discriminatory. 
            All activities must adhere to applicable local, national, and international laws.
          </p>
          <p>
            Violation of these terms may result in content removal, temporary suspension, or permanent banning of user accounts. 
            Kahoot! Fun reserves the right to update or modify these terms at any time without prior notice.
          </p>
          <p>
            Educators and parents are encouraged to supervise student participation and ensure appropriate usage. 
            We are committed to fostering a creative, inclusive, and respectful learning space for all.
          </p>
        </div>

        <div className="info-section">
          <h2>🤝 Community Guidelines</h2>
          <ul>
            <li>✔ Be kind and respectful in all your interactions.</li>
            <li>✔ Encourage others and celebrate learning successes.</li>
            <li>✔ Do not post answers publicly or spoil the experience for others.</li>
            <li>✔ Report any inappropriate behavior or content immediately.</li>
            <li>✔ Keep personal data safe—don’t share your full name, address, or contact info in games or public chats.</li>
          </ul>
        </div>

        <div className="info-section">
          <h2>🔒 Privacy & Licensing</h2>
          <p>
            We value your privacy. All user data is securely handled in compliance with GDPR and COPPA regulations.
            Kahoot! Fun operates under a Creative Commons BY-NC-SA 4.0 license, ensuring free and fair educational use.
          </p>
        </div>

        <div className="info-section">
          <h2>📧 Contact Information</h2>
          <p>
            Have questions or feedback? Reach out to us at
            <a href="mailto:support@kahootfun.com"> support@kahootfun.com</a>
          </p>
        </div>

        <div className="info-back">
          <button onClick={() => navigate(-1)}>⬅ Back to Home</button>
        </div>
      </div>
    </div>
  );
}

export default Information;
