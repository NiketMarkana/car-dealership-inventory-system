import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Vehicles from './pages/Vehicles';
import VehicleDetails from './pages/VehicleDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import AddVehicle from './pages/AddVehicle';
import EditVehicle from './pages/EditVehicle';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/vehicles" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute>
              <Vehicles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles/:id"
          element={
            <ProtectedRoute>
              <VehicleDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add"
          element={
            <ProtectedRoute adminOnly>
              <AddVehicle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit/:id"
          element={
            <ProtectedRoute adminOnly>
              <EditVehicle />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
