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
import Settings from "./pages/Settings";
import AgentDashboard from "./pages/AgentDashboard";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import AgentRoute from "./routes/AgentRoute";

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/auth" element={<Auth />} />

      {/* Protected Layout */}
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
        <Route path="schedule" element={<Schedule />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="reward-history" element={<RewardHistory />} />
        <Route path="tips" element={<Tips />} />

        {/* Role Protected Routes */}
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />

        <Route
          path="agent"
          element={
            <AgentRoute>
              <AgentDashboard />
            </AgentRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;