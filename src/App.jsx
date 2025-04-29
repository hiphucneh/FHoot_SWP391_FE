import "./components/styles.css";
import "remixicon/fonts/remixicon.css";

import CreateQuestion from "./screens/CreateQuestionScreen";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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

import CreateKahoot from "./screens/CreateKahootScreen";
import HomeAdmin from "./Admin/HomeAdmin";
import SystemConfiguration from "./Admin/SystemConfiguration/SystemConfiguration";
import KahootLists from "./screens/KahootLists";
import UpdateKahoot from "./screens/UpdateKahootScreen";
import UpdateQuestion from "./screens/UpdateQuestionScreen";
import HomeForAdmin from "./Home/HomeForAdmin";
import CreateSession from "../src/screens/CreateSession";
import ListOfGroups from "./screens/ListOfGroups";
import AnswerScreen from "./screens/AnswerScreen";
import ChooseGroupScreen from "./screens/ChooseGroupScreen";
import WaitingRoomScreen from "./screens/WaitingRoomScreen";
import UserManagement from "./Admin/UserManagement";
import SessionManagement from "./screens/admin/SessionManagement";

function App() {
  return (
    <GoogleOAuthProvider clientId="771006964772-t3q4laaqefmkpgl1d6olk9cgiofdcr4u.apps.googleusercontent.com">
      <Router>
        <Routes>
          {/*Host*/}
          <Route path="/create-question" element={<CreateQuestion />} />
          <Route path="/create-kahoot" element={<CreateKahoot />} />
          <Route path="/update-kahoot" element={<UpdateKahoot />} />
          <Route path="/update-question" element={<UpdateQuestion />} />
          <Route path="/group-list" element={<ListOfGroups />} />
          <Route path="/create-session" element={<CreateSession />} />

          {/* Home */}
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
          <Route path="/HomeAdmin" element={<HomeAdmin />} />
          <Route
            path="/system-configuration"
            element={<SystemConfiguration />}
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/RegisterSuccess" element={<RegisterSuccess />} />
          <Route path="/UserSetupPage" element={<UserSetupPage />} />
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
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/enter-pin" element={<EnterPinCodeScreen />} />
          <Route path="/your-kahoots" element={<KahootLists />} />

          {/* Player */}
          <Route path="/answer" element={<AnswerScreen />} />
          <Route path="/choose-group" element={<ChooseGroupScreen />} />
          <Route path="/waiting-room" element={<WaitingRoomScreen />} />

          {/* Admin */}
          <Route path="/admin/user-list" element={<UserManagement />} />
          <Route path="/admin/session-list" element={<SessionManagement />} />
          <Route path="/admin/setting" element={<HomeForAdmin />} />

          {/* Default */}
          <Route path="/" element={<Navigate to="/Home" />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
