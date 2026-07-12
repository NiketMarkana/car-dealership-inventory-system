import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
        <Link to="/admin/add">
          <button style={{ padding: '8px 16px', cursor: 'pointer' }}>+ Add Vehicle</button>
        </Link>
        <Link to="/vehicles">
          <button style={{ padding: '8px 16px', cursor: 'pointer' }}>Manage Inventory</button>
        </Link>
        <Link to="/vehicles">
          <button style={{ padding: '8px 16px', cursor: 'pointer' }}>Search Vehicles</button>
        </Link>
      </div>
    </div>
  );
}
