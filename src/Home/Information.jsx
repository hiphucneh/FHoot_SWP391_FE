import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Information.css";

function Information() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [sections, setSections] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const sectionRefs = useRef([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setRole(user.role);
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }

    const storedSections = localStorage.getItem("infoSections");
    if (storedSections) {
      setSections(JSON.parse(storedSections));
    } else {
      setSections(defaultSections);
    }
  }, []);

  const defaultSections = [
    {
      title: "🌟 About Us",
      content:
        "Fhoot! Fun is a vibrant learning platform designed to make education exciting, interactive, and accessible for all ages. We aim to inspire curiosity and joy in learning through live quizzes, games, and community engagement."
    },
    {
      title: "🎯 Our Audience",
      content:
        "👉 Students from Kindergarten to University\n👉 Teachers and Educators\n👉 Parents supporting home learning\n👉 Anyone who loves to learn in a fun way!"
    },
    {
      title: "📜 Terms of Use",
      content:
        "By accessing and using Fhoot! Fun, users agree to comply with our community standards and platform rules..."
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
        "Have questions or feedback? Reach out to us at support@fhootfun.com."
    }
  ];

  useEffect(() => {
    if (sections.length === 0) return; // Đợi có sections rồi mới làm tiếp

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      if (sectionRefs.current) {
        sectionRefs.current.forEach((ref) => {
          if (ref) observer.unobserve(ref);
        });
      }
    };
  }, [sections]); // ➔ thêm sections vào dependency

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

        {sections.map((section, index) => (
          <div
            className="info-section fade-in-section"
            key={index}
            ref={(el) => (sectionRefs.current[index] = el)}
          >
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

        <div className="info-back fade-in-section" ref={(el) => (sectionRefs.current[sections.length] = el)}>
          <button onClick={() => navigate("/")}>⬅ Back to Home</button>
        </div>
      </div>
    </div>
  );
}

export default Information;
