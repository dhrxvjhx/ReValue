import { useEffect } from "react"; // ✅ IMPORTANT
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import SubmitWaste from "./pages/SubmitWaste";
import Rewards from "./pages/Rewards";
import Leaderboard from "./pages/Leaderboard";
import AdminPanel from "./pages/AdminPanel";
import Schedule from "./pages/Schedule";
import Profile from "./pages/Profile";
import RewardHistory from "./pages/RewardHistory";
import Tips from "./pages/Tips";
import Auth from "./pages/Auth";
import ProtectedRoute from "./routes/ProtectedRoute";
import Settings from "./pages/Settings";
import AgentDashboard from "./pages/AgentDashboard";
import AdminOverview from "./pages/AdminOverview";
import AdminPickups from "./pages/AdminPickups";
import AgentHistory from "./pages/AgentHistory";
import AgentEarnings from "./pages/AgentEarnings";
import Notifications from "./pages/Notifications";

import { requestNotificationPermission, saveFcmToken } from "./firebase/firebase";
import { useAuth } from "./context/AuthContext";

function App() {
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return; // ✅ IMPORTANT FIX

    const setupNotifications = async () => {
      const token = await requestNotificationPermission();

      if (token) {
        await saveFcmToken(currentUser.uid, token);
      }
    };

    setupNotifications();
  }, [currentUser]);

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="submit" element={<SubmitWaste />} />
        <Route path="rewards" element={<Rewards />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="admin" element={<AdminPanel />} />
        <Route path="admin/overview" element={<AdminOverview />} />
        <Route path="admin/pickups" element={<AdminPickups />} />
        <Route path="agent" element={<AgentDashboard />} />
        <Route path="agent/history" element={<AgentHistory />} />
        <Route path="agent/earnings" element={<AgentEarnings />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="reward-history" element={<RewardHistory />} />
        <Route path="tips" element={<Tips />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
    </Routes>
  );
}

export default App;