const Vehicle = require('./vehicle.model');

const create = async (vehicleData) => {
  return Vehicle.create(vehicleData);
};

const findAll = async () => {
  return Vehicle.find({});
};

const findById = async (id) => {
  return Vehicle.findById(id);
};

const findByIdAndUpdate = async (id, data) => {
  return Vehicle.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const deleteById = async (id) => {
  return Vehicle.findByIdAndDelete(id);
};

const search = async (filters = {}) => {
  const query = {};

  if (filters.make) {
    query.make = { $regex: filters.make, $options: 'i' };
  }

  if (filters.model) {
    query.model = { $regex: filters.model, $options: 'i' };
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.price = {};
    if (filters.minPrice !== undefined) {
      query.price.$gte = Number(filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      query.price.$lte = Number(filters.maxPrice);
    }
  }

  return Vehicle.find(query);
};

module.exports = {
  create,
  findAll,
  findById,
  findByIdAndUpdate,
  deleteById,
  search,
};
