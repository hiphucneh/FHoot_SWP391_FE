import "./components/styles.css";
import "remixicon/fonts/remixicon.css";
import PackageManagement from "./Admin/PackageManagement";
import CreateQuestion from "./screens/CreateQuestionScreen";
import ChooseGroupScreen from "./screens/ChooseGroupScreen";
import WaitingRoomScreen from "./screens/WaitingRoomScreen";
import Dashboard from "./screens/admin/Dashboard";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import MyHistorySession from "./screens/MyHistorySession";
import PlayerResultScreen from "./screens/PlayerResultScreen";

import Header from "./components/Header";
import Footer from "./components/Footer";
import RegisterPage from "./components/RegisterPage";
import RegisterSuccess from "./components/RegisterSuccess";
import HomeMenu from "./Home/HomeMenu";
import Information from "./Home/Information";
import PayHost from "./Host/payHost";
import PaymentPage from "./Host/PaymentPage";
import PaymentSuccess from "./Host/PaymentSuccess";
import PaymentCancel from "./Host/PaymentCancel";
import UserSetupPage from "./components/UserSetupPage";
import EnterPinCodeScreen from "./screens/EnterPinCodeScreen";
import AdminHeader from "./Admin/AdminHeader";
import CreateKahoot from "./screens/CreateKahootScreen";
import HomeAdmin from "./Admin/HomeAdmin";
import SystemConfiguration from "./Admin/SystemConfiguration/SystemConfiguration";
import KahootLists from "./screens/KahootLists";
import UpdateKahoot from "./screens/UpdateKahootScreen";
import UpdateQuestion from "./screens/UpdateQuestionScreen";
import HomeForAdmin from "./Home/HomeForAdmin";
import CreateSession from "./screens/CreateSession";
import ListOfGroups from "./screens/ListOfGroups";
import UserManagement from "./screens/admin/UserManagement";
import SessionManagement from "./screens/admin/SessionManagement";
import LeaderBoard from "./screens/LeaderBoardScreen";
import QnAPlayerScreen from "./screens/QnAPlayerScreen";
import QnAHostScreen from "./screens/QnAHostScreen";
import HeaderK from "./screens/HeaderK";
import LoadCode from "./screens/loadcode";
import LoadGame from "./screens/LoadGame";
import MyGame from "./screens/MyGame";

function App() {
  return (
    <GoogleOAuthProvider clientId="872792915542-tdot930v32243olj0gbkidj4lpscc2cc.apps.googleusercontent.com">
      <Router>
        <Routes>
          {/*Host*/}
          <Route path="/leaderboard" element={<LeaderBoard />} />

          <Route path="/createQ" element={<CreateQuestion />} />
          <Route path="/createK" element={<><HeaderK /> <CreateKahoot /> </>} />
          <Route path="/updateK" element={<><HeaderK /> <UpdateKahoot /> </>} />
          <Route path="/updateQ" element={<UpdateQuestion />} />
          <Route path="/group-list" element={<ListOfGroups />} />
          <Route path="/create-session" element={<><HeaderK /><CreateSession /> </>} />
          <Route path="/answer-screen" element={<QnAHostScreen />} />
          <Route path="/loadcode" element={<LoadCode />} />
          <Route path="/load" element={<LoadGame />} />

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
          <Route
            path="/admin/session-list"
            element={
              <>
<<<<<<< HEAD
                <AdminHeader></AdminHeader><SessionManagement />
              </>
            }
          />

=======
                <AdminHeader />
                <SessionManagement />
              </>
            }
          />
          <Route
            path="/system-configuration"
            element={<><AdminHeader /><SystemConfiguration /></>}
          />
>>>>>>> 1a8e8a0be7b57855b0ee874ecf4c83b71545f1b3
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
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />

          <Route path="/enter-pin" element={<EnterPinCodeScreen />} />
          <Route path="/your-kahoots" element={<KahootLists />} />
          <Route path="/my-game" element={<MyGame />} />
          {/* Admin */}
          <Route path="/admin/user-list" element={<><AdminHeader /> <UserManagement /></>} />
          <Route path="/admin/session-list" element={<><AdminHeader /><SessionManagement /></>} />
          <Route path="/admin/setting" element={<HomeForAdmin />} />
          <Route path="/admin/system-configuration" element={<><AdminHeader /><SystemConfiguration /></>} />
          <Route path="/choose-group" element={<ChooseGroupScreen />} />
          <Route path="/waiting-room" element={<WaitingRoomScreen />} />
          <Route path="/admin/package-management" element={<><AdminHeader /><PackageManagement /></>} />
          <Route path="/answer" element={<QnAPlayerScreen />} />
          <Route path="/admin/dashboard" element={<><AdminHeader /><Dashboard /></>} />
          <Route path="/bingo" element={<PlayerResultScreen />} />
          <Route path="/result" element={<MyHistorySession />} />

          {/* Default */}
          <Route path="/" element={<Navigate to="/Home" />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
