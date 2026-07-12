import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function EditVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState({
    make: '',
    model: '',
    category: 'SEDAN',
    price: '',
    quantity: '',
  });

  useEffect(() => {
    const loadVehicle = async () => {
      try {
        const res = await api.get(`/vehicles/${id}`);
        const data = res.data.data;
        setVehicle({
          make: data.make || '',
          model: data.model || '',
          category: data.category || 'SEDAN',
          price: data.price || '',
          quantity: data.quantity || '',
        });
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to load vehicle details');
        navigate('/vehicles');
      }
    };

    loadVehicle();
  }, [id, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/vehicles/${id}`, vehicle);
      alert('Vehicle updated successfully');
      navigate('/vehicles');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update vehicle');
    }
  };

  return (
    <div>
      <h2>Edit Vehicle</h2>
      <form onSubmit={submit}>
        <div>
          <label>Make:</label>
          <input
            placeholder="Make"
            value={vehicle.make}
            onChange={(e) => setVehicle({ ...vehicle, make: e.target.value })}
          />
        </div>
        <div>
          <label>Model:</label>
          <input
            placeholder="Model"
            value={vehicle.model}
            onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
          />
        </div>
        <div>
          <label>Category:</label>
          <select
            value={vehicle.category}
            onChange={(e) => setVehicle({ ...vehicle, category: e.target.value })}
          >
            <option>SEDAN</option>
            <option>SUV</option>
            <option>HATCHBACK</option>
            <option>ELECTRIC</option>
          </select>
        </div>
        <div>
          <label>Price:</label>
          <input
            placeholder="Price"
            type="number"
            value={vehicle.price}
            onChange={(e) => setVehicle({ ...vehicle, price: e.target.value })}
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input
            placeholder="Quantity"
            type="number"
            value={vehicle.quantity}
            onChange={(e) => setVehicle({ ...vehicle, quantity: e.target.value })}
          />
        </div>
        <button>Save Changes</button>
      </form>
    </div>
  );
}
