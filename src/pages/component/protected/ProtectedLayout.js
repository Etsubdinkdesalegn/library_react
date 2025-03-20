import { Navigate } from 'react-router-dom';
import AdminRoutes from './admin/AdminRoutes';
import UserRoutes from './user/UserRoutes';

const ProtectedLayout = ({ auth }) => {
  if (!auth.isAuthenticated) {
    // Redirect unauthenticated users to the login page
    return <Navigate to="/" replace />;
  }

  // Render admin or user routes based on role
  return auth.role === 'Admin' ? <AdminRoutes /> : <UserRoutes />;
};

export default ProtectedLayout;
