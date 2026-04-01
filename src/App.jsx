import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import SubmitWaste from "./pages/SubmitWaste";
import Rewards from "./pages/Rewards";
import Leaderboard from "./pages/Leaderboard";
import AdminPanel from "./pages/AdminPanel";
import Schedule from "./pages/Schedule";
import Profile from "./pages/Profile";
import RewardHistory from "./pages/RewardHistory";
import Tips from "./pages/Tips";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import AgentDashboard from "./pages/AgentDashboard";
import AdminOverview from "./pages/AdminOverview";
import AdminPickups from "./pages/AdminPickups";
import AgentHistory from "./pages/AgentHistory";
import AgentEarnings from "./pages/AgentEarnings";
import Notifications from "./pages/Notifications";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";
import RoleRedirect from "./routes/RoleRedirect";

import {
  requestNotificationPermission,
  saveFcmToken,
} from "./firebase/firebase";
import { useAuth } from "./context/AuthContext";

function App() {
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

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
      {/* 🔓 PUBLIC */}
      <Route path="/auth" element={<Auth />} />

      {/* 🔒 PROTECTED */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* 🔥 ROLE BASED ENTRY */}
        <Route index element={<RoleRedirect />} />

        {/* 👤 USER */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="submit" element={<SubmitWaste />} />
        <Route path="rewards" element={<Rewards />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="history" element={<History />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="reward-history" element={<RewardHistory />} />
        <Route path="tips" element={<Tips />} />
        <Route path="notifications" element={<Notifications />} />

        {/* 🚚 AGENT */}
        <Route
          path="agent"
          element={
            <RoleProtectedRoute allowedRole="agent">
              <AgentDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="agent/history"
          element={
            <RoleProtectedRoute allowedRole="agent">
              <AgentHistory />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="agent/earnings"
          element={
            <RoleProtectedRoute allowedRole="agent">
              <AgentEarnings />
            </RoleProtectedRoute>
          }
        />

        {/* 🧠 ADMIN */}
        <Route
          path="admin"
          element={
            <RoleProtectedRoute allowedRole="admin">
              <AdminPanel />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="admin/overview"
          element={
            <RoleProtectedRoute allowedRole="admin">
              <AdminOverview />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="admin/pickups"
          element={
            <RoleProtectedRoute allowedRole="admin">
              <AdminPickups />
            </RoleProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;