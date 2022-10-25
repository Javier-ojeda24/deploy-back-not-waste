const { Customer, City, Order } = require("../db");

const getCallCustomer = async (req, res) => {
  const { email } = req.query
  try {
    let customers = await Customer.findAll({
      include: [{
        model: City,
        attributes: ["name"],
        through: {
          attributes: [],
        },
      },
      {
        model: Order
      }]
    });
    if (email) {
      customers = customers.filter((s) => s.email === email);
      if (!customers.length) {
        throw new Error("No hay consumidores con ese email");
      }
    }
    res.status(200).send(customers)
  } catch (e) {
    res.status(404).send(e.message);
  }
};

const postCustomer = async (req, res) => {
  try {
    let { name, email, city } = req.body;

    if (!name) { throw new Error('El nombre de usuario debe estar definido') }
    if (!email) { throw new Error('El enail de usuario debe estar definido') }

    let newCustomer = await Customer.create({
      name,
      email,
    });
    if (city) {
      let cityDb = await City.findAll({
        where: {
          name: city,
        },
      });
      newCustomer.addCity(cityDb);
    }

    res.status(200).send(newCustomer);
  } catch (e) {
    res.status(500).send(`${e}`)
  };
}
module.exports = {
  postCustomer,
  getCallCustomer,
}
