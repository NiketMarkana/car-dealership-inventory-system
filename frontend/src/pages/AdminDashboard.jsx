import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <Link to="/admin/add">Add Vehicle</Link>
      <br />
      <br />
      <Link to="/vehicles">Manage Inventory</Link>
    </div>
  );
}
