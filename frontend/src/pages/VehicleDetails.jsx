import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

function VehicleDetails() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchVehicle = async () => {
    try {
      const response = await api.get(`/vehicles/${id}`);
      setVehicle(response.data.data);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to fetch vehicle');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePurchase = async () => {
    try {
      await api.post(`/vehicles/${id}/purchase`);
      alert('Vehicle purchased successfully');
      fetchVehicle();
    } catch (error) {
      alert(error.response?.data?.message || 'Purchase failed');
    }
  };

  if (loading) return <h2>Loading...</h2>;
  if (!vehicle) return <h2>Vehicle not found</h2>;

  return (
    <div style={{ padding: '30px' }}>
      <h1>
        {vehicle.make} {vehicle.model}
      </h1>
      <hr />
      <p>
        <strong>Category:</strong> {vehicle.category}
      </p>
      <p>
        <strong>Price:</strong> ₹{vehicle.price}
      </p>
      <p>
        <strong>Available:</strong> {vehicle.quantity}
      </p>
      <button onClick={handlePurchase} disabled={vehicle.quantity === 0}>
        {vehicle.quantity === 0 ? 'Out of Stock' : 'Purchase Vehicle'}
      </button>
    </div>
  );
}

export default VehicleDetails;
