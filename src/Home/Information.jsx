import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Information.css";

function Information() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [sections, setSections] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    // Lấy role
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setRole(user.role);
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }

    // Lấy nội dung
    const storedSections = localStorage.getItem("infoSections");
    if (storedSections) {
      setSections(JSON.parse(storedSections));
    } else {
      // Nếu chưa có localStorage -> dùng dữ liệu mặc định
      setSections(defaultSections);
    }
  }, []);

  const defaultSections = [
    {
      title: "🌟 About Us",
      content:
        "Kahoot! Fun is a vibrant learning platform designed to make education exciting, interactive, and accessible for all ages. We aim to inspire curiosity and joy in learning through live quizzes, games, and community engagement."
    },
    {
      title: "🎯 Our Audience",
      content:
        "👉 Students from Kindergarten to University\n👉 Teachers and Educators\n👉 Parents supporting home learning\n👉 Anyone who loves to learn in a fun way!"
    },
    {
      title: "📜 Terms of Use",
      content:
        "By accessing and using Kahoot! Fun, users agree to comply with our community standards and platform rules..."
    },
    {
      title: "🤝 Community Guidelines",
      content:
        "✔ Be kind and respectful in all your interactions.\n✔ Encourage others and celebrate learning successes.\n✔ Do not post answers publicly or spoil the experience for others.\n✔ Report any inappropriate behavior or content immediately.\n✔ Keep personal data safe."
    },
    {
      title: "🔒 Privacy & Licensing",
      content:
        "We value your privacy. All user data is securely handled in compliance with GDPR and COPPA regulations."
    },
    {
      title: "📧 Contact Information",
      content:
        "Have questions or feedback? Reach out to us at support@kahootfun.com."
    }
  ];

  const handleSave = (index) => {
    const updatedSections = [...sections];
    updatedSections[index].content = editedContent;
    setSections(updatedSections);
    localStorage.setItem("infoSections", JSON.stringify(updatedSections));
    setEditIndex(null);
    setEditedContent("");
  };

  return (
    <div className="info-page">
      <div className="info-inner">
        <div className="info-header">
          <h1>About Kahoot! <span className="highlight">Fun</span></h1>
          <p>Learn everything about our platform, mission, and policies.</p>
        </div>

        {sections.map((section, index) => (
          <div className="info-section" key={index}>
            <h2>{section.title}</h2>

            {editIndex === index ? (
              <div>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows="6"
                  className="info-textarea"
                />
                <div style={{ marginTop: "10px" }}>
                  <button onClick={() => handleSave(index)} className="save-button">💾 Save</button>
                  <button onClick={() => setEditIndex(null)} className="cancel-button">✖ Cancel</button>
                </div>
              </div>
            ) : (
              <p style={{ whiteSpace: "pre-line" }}>{section.content}</p>
            )}

            {/* Nếu là Admin thì hiện nút Edit */}
            {role === "Admin" && editIndex !== index && (
              <button
                onClick={() => {
                  setEditIndex(index);
                  setEditedContent(section.content);
                }}
                className="edit-button"
              >
                ✏️ Edit
              </button>
            )}
          </div>
        ))}

        <div className="info-back">
          <button onClick={() => navigate(-1)}>⬅ Back to Home</button>
        </div>
      </div>
    </div>
  );
}

export default Information;
