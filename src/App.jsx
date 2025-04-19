import React from "react";
import Login from "./Login";
import Header from "./components/Header"; // Import Header component
import WaitRoomScreen from "./screens/WaitRoomScreen";
import QuestionScreen from "./screens/QuestionScreen";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<WaitRoomScreen />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div >
  );
}

export default App