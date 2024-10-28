const mongoose = require("mongoose");
const Car = require("../models/Car");
const carController = {};

carController.createCar = async (req, res, next) => {
  try {
    const info = req.body;
    if (!info) {
      const exception = new Error("Missing info");
      exception.status = 402;
      throw exception.message;
    }

    const newCar = await Car.create(info);
    res.status(200).send({ message: "Create car successfully!", car: newCar });
  } catch (err) {
    next(err);
  }
};

carController.getCars = async (req, res, next) => {
  try {
    const LIMIT = 10;
    const { page = 1 } = req.query; // Default to page 1 if not provided

    const numberOfCars = await Car.countDocuments(); // Use countDocuments instead of aggregation

    const totalPages = Math.ceil(numberOfCars / LIMIT);

    const listOfCars = await Car.find({})
      .skip((page - 1) * LIMIT)
      .limit(LIMIT);

    res.status(200).send({
      message: "Get car list successfully!",
      data: {
        cars: listOfCars,
        page: parseInt(page, 10),
        total: totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
};

carController.editCar = async (req, res, next) => {
  try {
    let { id } = req.params;
    let info = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const exception = new Error("Wrong ID types!");
      exception.status = 402;
      throw exception.message;
    }
    if (!info) {
      const exception = new Error("Missing info");
      exception.status = 402;
      throw exception.message;
    }
    const updated = await Car.findByIdAndUpdate(id, info, { new: true });
    res.status(200).send({ message: "Update Car Successfully!", car: updated });
  } catch (err) {
    next(err);
  }
};

carController.deleteCar = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const exception = new Error("Wrong ID types!");
      exception.status = 402;
      throw exception.message;
    }
    const deleted = await Car.findByIdAndDelete(id, { new: true });
    res.status(200).send({ message: "Delete Car Successfully!", car: deleted });
  } catch (err) {
    next(err);
  }
};

module.exports = carController;
