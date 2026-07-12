import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadVehicle = async () => {
      try {
        const res = await api.get(`/vehicles/${id}`);
        setVehicle(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load vehicle details');
      }
    };
    loadVehicle();
  }, [id]);

  const purchase = async () => {
    try {
      await api.post(`/vehicles/${id}/purchase`);
      alert('Vehicle purchased successfully');
      const res = await api.get(`/vehicles/${id}`);
      setVehicle(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Purchase failed');
    }
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!vehicle) return <p>Loading...</p>;

  return (
    <div
      style={{
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        maxWidth: '500px',
        marginTop: '20px',
      }}
    >
      <h2>Vehicle Details</h2>
      <h3>
        {vehicle.make} {vehicle.model}
      </h3>
      <p>
        <strong>Category:</strong> {vehicle.category}
      </p>
      <p>
        <strong>Price:</strong> ₹{vehicle.price}
      </p>
      <p>
        <strong>Available Stock:</strong> {vehicle.quantity}
      </p>
      <p>
        <strong>Created At:</strong> {new Date(vehicle.createdAt).toLocaleString()}
      </p>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button onClick={purchase}>Purchase</button>
        <button onClick={() => navigate('/vehicles')}>Back to Inventory</button>
      </div>
    </div>
  );
}
