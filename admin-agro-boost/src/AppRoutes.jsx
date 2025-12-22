// src/AppRoutes.jsx

import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute'; 
import AdminLayout from './components/AdminLayout'; 
import UsersPage from './pages/UsersPage'; 
import UserFormPage from './pages/UserFormPage'; 
import ServicesPage from './pages/ServicesPage'; 
import ServiceFormPage from './pages/ServiceFormPage'; 
import ReservationsPage from './pages/ReservationsPage'; 
import ReservationDetailPage from './pages/ReservationDetailPage'; 
import MachineMaintenancePage from './pages/MachineMaintenancePage';
import MaintenanceDetailPage from './pages/MaintenanceDetailPage';
import RecordMaintenancePage from './pages/RecordMaintenancePage';
import MaintenanceReportsPage from './pages/MaintenanceReportsPage';
import NotFoundPage from './pages/NotFoundPage';


function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}> 
            <Route index element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} /> 
            <Route path="users/add" element={<UserFormPage />} /> 
            <Route path="users/edit/:userId" element={<UserFormPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="services/add" element={<ServiceFormPage />} />
            <Route path="services/edit/:serviceId" element={<ServiceFormPage />} />
            <Route path="reservations" element={<ReservationsPage />} />
            <Route path="reservations/:id" element={<ReservationDetailPage />} />

            {/*  SECTION MAINTENANCE */}
            {/* On utilise des chemins relatifs ici */}
            <Route path="maintenance" element={<MachineMaintenancePage />} />
            <Route path="maintenance/:id" element={<MaintenanceDetailPage />} />
            <Route path="maintenance/record/:id" element={<RecordMaintenancePage />} />
            <Route path="maintenance/reports" element={<MaintenanceReportsPage />} />
            
            {/* Alias pour equipments si nécessaire, mais relatif aussi */}
            <Route path="equipments" element={<MachineMaintenancePage />} />
          </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;