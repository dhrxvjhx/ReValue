import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import SubmitWaste from "./pages/SubmitWaste"
import Rewards from "./pages/Rewards"
import Leaderboard from "./pages/Leaderboard"
import AdminPanel from "./pages/AdminPanel"
import History from "./pages/History"
import Tips from "./pages/Tips"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="submit" element={<SubmitWaste />} />
        <Route path="rewards" element={<Rewards />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="admin" element={<AdminPanel />} />
        <Route path="history" element={<History />} />
        <Route path="tips" element={<Tips />} />
      </Route>
    </Routes>
  )
}

export default App