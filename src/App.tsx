
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/Dashboard";
import AdminLoginPage from "./pages/AdminLoginPage";
import AuthGuard from "./services/authguard";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserTransactions from "./pages/userTransactions";
import UserTasks from "./pages/userTasks";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected Routes */}
        <Route element={<AuthGuard />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/transactions" element={<UserTransactions />} />
          <Route path="/admin/transactions/:email" element={<UserTransactions />} />
          <Route path="/admin/tasks" element={<UserTasks />} />
          <Route path="/admin/tasks/:email" element={<UserTasks />} />
        </Route>

        {/* Fallback Routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
