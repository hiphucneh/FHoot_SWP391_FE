import React from "react";
import Login from "./components/Login";
import WaitRoomScreen from "./screens/WaitRoomScreen.jsx";
import QuestionScreen from "./screens/QuestionScreen";
import CreateKahoot from "./screens/CreateKahootScreen";
import CreateQuestion from "./screens/CreateQuestionScreen";
import Header from "./components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



function App() {
  return (
    <div className="App">
      <Header />
      <Router>
        <Routes>
          <Route path="/createK" element={<CreateKahoot />} />
          <Route path="/createQ" element={<CreateQuestion />} />
          <Route path="/waitRoom" element={<WaitRoomScreen />} />
          <Route path="/question" element={<QuestionScreen />} />
          <Route path="/login" element={<Login />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App