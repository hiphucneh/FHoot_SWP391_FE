import { useNavigate } from "react-router-dom";
import "./HomeForTeacher.css";

function HomeForTeacher() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/your-kahoots");
  };

  return (
    <div className="home-for-teacher">
      <button 
        className="hover-button" 
        style={{ "--content": "'View Your Kahoot! Games'" }} 
        onClick={handleClick}
      >
        <div className="left"></div>
        View Your Kahoot! Games
        <div className="right"></div>
      </button>
    </div>
  );
}

export default HomeForTeacher;
