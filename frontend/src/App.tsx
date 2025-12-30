import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import CandidateList from './pages/CandidateList';
import CandidateDetail from './pages/CandidateDetail';
import Login from './pages/Login/login';
import AdminDashboard from './pages/Admin/adminDashboard';
import ManageUsers from './pages/Admin/Actions/manageUsers';
import ProtectedRoute from './components/protectedRoute';
import AdminRoute from './components/adminRoute';
import { Toaster } from './components/ui/sonner';
import NotFound from './pages/NotFound/notFound';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <CandidateList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/:id"
            element={
              <ProtectedRoute>
                <CandidateDetail />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/manage-users"
            element={
              <AdminRoute>
                <ManageUsers />
              </AdminRoute>
            }
          />

          <Route path='*' element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
