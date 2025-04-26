import "./components/styles.css";
import "remixicon/fonts/remixicon.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import RegisterPage from "./components/RegisterPage";
import RegisterSuccess from "./components/RegisterSuccess";
import HomeMenu from "./Home/HomeMenu";
import Information from "./Home/Information";
import PayHost from "./Host/payHost";
import UserSetupPage from "./components/UserSetupPage";
import EnterPinCodeScreen from "./screens/EnterPinCodeScreen";
import HomeAdmin from "./Admin/HomeAdmin"; // 👉 Import thêm HomeAdmin

function App() {
  return (
    <>
      <Header />
    </>
  )
}

export default App;
