import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadVehicles();
  }, []);

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

  const purchase = async (id) => {
    try {
      await api.post(`/vehicles/${id}/purchase`);
      alert('Vehicle purchased');
      loadVehicles();
    } catch (err) {
      alert(err.response?.data?.message || 'Purchase failed');
    }
  };

  return (
    <div>
      <h2>Vehicle Inventory</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {vehicles.length === 0 && !error && <p>No vehicles in inventory.</p>}
      {vehicles.map((vehicle) => (
        <div key={vehicle._id}>
          <h3>
            {vehicle.make} {vehicle.model}
          </h3>
          <p>Category: {vehicle.category}</p>
          <p>Price: ₹{vehicle.price}</p>
          <p>Available: {vehicle.quantity}</p>
          <button onClick={() => purchase(vehicle._id)}>Purchase</button>
          <hr />
        </div>
      ))}
    </div>
  );
}
