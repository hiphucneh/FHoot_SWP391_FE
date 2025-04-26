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
import HomeAdmin from "./Admin/HomeAdmin";
import KahootLists from "./screens/KahootLists"; // 👉 NEW

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/Home"
          element={
            <>
              <Header />
              <HomeMenu />
              <Footer />
            </>
          }
        />

        <Route
          path="/HomeAdmin"
          element={
            <>
              <HomeAdmin />
            </>
          }
        />

        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/Information"
          element={
            <>
              <Header />
              <Information />
              <Footer />
            </>
          }
        />

        <Route path="/UserSetupPage" element={<UserSetupPage />} />

        <Route
          path="/PayHost"
          element={
            <>
              <Header />
              <PayHost />
              <Footer />
            </>
          }
        />

        <Route path="/RegisterSuccess" element={<RegisterSuccess />} />

        <Route path="/enter-pin" element={<EnterPinCodeScreen />} />

        {/* New: Your Kahoot Lists */}
        <Route
          path="/your-kahoots"
          element={
            <>
              <KahootLists />
            </>
          }
        />

        {/* Default redirect to Home */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <HomeMenu />
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
