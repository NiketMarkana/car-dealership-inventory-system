import { useState } from 'react';
import api from '../api/axios';

export default function AddVehicle() {
  const [vehicle, setVehicle] = useState({
    make: '',
    model: '',
    category: 'SEDAN',
    price: '',
    quantity: '',
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/vehicles', vehicle);
      alert('Vehicle added');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div>
      <h2>Add Vehicle</h2>
      <form onSubmit={submit}>
        <input placeholder="Make" onChange={(e) => setVehicle({ ...vehicle, make: e.target.value })} />
        <input
          placeholder="Model"
          onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
        />
        <select onChange={(e) => setVehicle({ ...vehicle, category: e.target.value })}>
          <option>SEDAN</option>
          <option>SUV</option>
          <option>HATCHBACK</option>
          <option>ELECTRIC</option>
        </select>
        <input
          placeholder="Price"
          type="number"
          onChange={(e) => setVehicle({ ...vehicle, price: e.target.value })}
        />
        <input
          placeholder="Quantity"
          type="number"
          onChange={(e) => setVehicle({ ...vehicle, quantity: e.target.value })}
        />
        <button>Add Vehicle</button>
      </form>
    </div>
  );
}
