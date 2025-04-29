import "./components/styles.css";
import "remixicon/fonts/remixicon.css";

import CreateQuestion from "./screens/CreateQuestionScreen";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Header from "./components/Header";
import Footer from "./components/Footer";
import RegisterPage from "./components/RegisterPage";
import RegisterSuccess from "./components/RegisterSuccess";
import HomeMenu from "./Home/HomeMenu";
import Information from "./Home/Information";
import PayHost from "./Host/payHost";
import PaymentPage from "./Host/PaymentPage";
import UserSetupPage from "./components/UserSetupPage";
import EnterPinCodeScreen from "./screens/EnterPinCodeScreen";

import CreateKahoot from "./screens/CreateKahootScreen"; // 👉 Import thêm CreateKahoot
import HomeAdmin from "./Admin/HomeAdmin";
import KahootLists from "./screens/KahootLists";
import UpdateKahoot from "./screens/UpdateKahootScreen";
import UpdateQuestion from "./screens/UpdateQuestionScreen";

function App() {
  return (
    <GoogleOAuthProvider clientId="771006964772-t3q4laaqefmkpgl1d6olk9cgiofdcr4u.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/createq" element={<CreateQuestion />} />
          <Route path="/createk" element={<CreateKahoot />} />
          <Route path="/updateK" element={<UpdateKahoot />} />
          <Route path="/updateq" element={<UpdateQuestion />} />
          {/* Home */}
          <Route path="/Home" element={<><Header /><HomeMenu /><Footer /></>} />
          <Route path="/HomeAdmin" element={<HomeAdmin />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/RegisterSuccess" element={<RegisterSuccess />} />
          <Route path="/UserSetupPage" element={<UserSetupPage />} />
          <Route path="/Information" element={<><Header /><Information /><Footer /></>} />
          <Route path="/PayHost" element={<><Header /><PayHost /><Footer /></>} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/enter-pin" element={<EnterPinCodeScreen />} />
          <Route path="/your-kahoots" element={<KahootLists />} />


          {/* Default */}
          <Route path="/" element={<Navigate to="/Home" />} />

        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;