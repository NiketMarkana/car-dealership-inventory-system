import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav
      style={{
        padding: '15px',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        gap: '20px',
      }}
    >
      <Link to="/vehicles">Vehicles</Link>
      {user?.role === 'ADMIN' && (
        <>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/add">Add Vehicle</Link>
        </>
      )}
      {!user ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      ) : (
        <>
          <span>{user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </nav>
  );
}
