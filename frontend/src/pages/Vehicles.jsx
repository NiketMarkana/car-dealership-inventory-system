import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function Vehicles() {
  const { user } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    setFilteredVehicles(vehicles);
  }, [vehicles]);

  const loadVehicles = async () => {
    try {
      const res = await api.get('/vehicles');
      setVehicles(res.data.data);
      setError('');
    } catch (err) {
      console.error(err.response || err);
      setError(err.response?.data?.message || 'Unauthorized: Please login first');
    }
  };

  const handleSearch = async () => {
    try {
      const res = await api.get('/vehicles/search', {
        params: {
          make: search,
        },
      });
      setFilteredVehicles(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const purchase = async (id) => {
    try {
      await api.post(`/vehicles/${id}/purchase`);
      alert('Vehicle purchased');
      loadVehicles();
    } catch (err) {
      alert(err.response?.data?.message || 'Purchase failed');
    }
  };

  const deleteVehicle = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return;
    try {
      await api.delete(`/vehicles/${id}`);
      alert('Vehicle deleted');
      loadVehicles();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const restock = async (id) => {
    const input = window.prompt('Enter restock quantity:');
    if (!input) return;
    const quantity = Number(input);
    if (isNaN(quantity) || quantity <= 0) {
      alert('Invalid quantity');
      return;
    }
    try {
      await api.post(`/vehicles/${id}/restock`, { quantity });
      alert('Vehicle restocked successfully');
      loadVehicles();
    } catch (err) {
      alert(err.response?.data?.message || 'Restock failed');
    }
  };

  return (
    <div>
      <h2>Vehicle Inventory</h2>

      <div style={{ marginBottom: '20px' }}>
        <input
          placeholder="Search by Make"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {filteredVehicles.length === 0 && !error && <p>No vehicles found.</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {filteredVehicles.map((vehicle) => (
          <div
            key={vehicle._id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '6px',
              padding: '15px',
              maxWidth: '400px',
            }}
          >
            <h3>
              {vehicle.make} {vehicle.model}
            </h3>
            <p>Category: {vehicle.category}</p>
            <p>Price: ₹{vehicle.price}</p>
            <p>Available: {vehicle.quantity}</p>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button onClick={() => purchase(vehicle._id)}>Purchase</button>
              <Link to={`/vehicles/${vehicle._id}`}>
                <button>View Details</button>
              </Link>
              {user?.role === 'ADMIN' && (
                <>
                  <Link to={`/admin/edit/${vehicle._id}`}>
                    <button>Edit</button>
                  </Link>
                  <button onClick={() => restock(vehicle._id)}>Restock</button>
                  <button onClick={() => deleteVehicle(vehicle._id)}>Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
