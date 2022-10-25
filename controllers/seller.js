const { Seller, City, Manager } = require("../db");
const { getAllSellers } = require("./utils/getAllSellers");

// Ruta get va a buscar a todos los proveedores de la base de datos.
// Si llegasen las propiedades name, category y/o city por query

const getSellers = async (req, res) => {
  const { name, category, city, description, price, diet, email } = req.query;
  let sellers;
  try {
    sellers = await getAllSellers();
    if (city) {
      sellers = sellers.filter((s) => s.cities.find((c) => c.name === city));
      if (!sellers.length) {
        throw new Error("No hay proveedores en esta ciudad");
      }
    }
    if (name) {
      sellers = sellers.filter((s) => s.name === name );
      if (!sellers.length) {
        throw new Error("No hay proveedores con ese nombre");
      }
    }
    if (category) {
      sellers = sellers.filter((s) => s.category === category);
      if (!sellers.length) {
        throw new Error(
          "No hay proveedores con esa categoría de establecimiento"
        );
      }
    }
    if (description) {
      sellers = sellers.filter((s) =>
        s.products.find((p) =>
          p.description.toLowerCase().includes(description.toLowerCase())
        )
      );
      if (!sellers.length) {
        throw new Error(
          "No hay proveedores con esa categoría de establecimiento"
        );
      }
    }
    if (price) {
      sellers = sellers.filter((s) => s.products.find((p) => p.price < price));
      if (!sellers.length) {
        throw new Error(
          "No hay proveedores con esa categoría de establecimiento"
        );
      }
    }

    if (diet) {
      sellers = sellers.filter((s) =>
        s.products.find((p) => p.diets.find((d) => d.name === diet))
      );
      if (!sellers.length) {
        throw new Error(
          "No hay proveedores con esa categoría de establecimiento"
        );
      }
    }

    if (email) {
      sellers = sellers.filter((s) => s.email === email );
      if (!sellers.length) {
        throw new Error("No hay proveedores con ese nombre");
      }
    }

    res.status(200).send(sellers);
  } catch (e) {
    res.status(404).send(e.message);
  }
};

const postSeller = async (req, res) => {
  let {
    name,
    phone,
    email,
    password,
    adress,
    cuit,
    image,
    category,
    enabled,
    cities,
  } = req.body;

  try {
    if (!name) {
      throw new Error("El campo del nombre del establecimiento es obligatorio");
    }
    if (!phone) {
      throw new Error("El campo del teléfono es obligatorio");
    }
    if (!email) {
      throw new Error("El campo del e-mail es obligatorio");
    }
    if (!cities) {
      throw new Error("El campo de la ciudad es obligatorio");
    }

    let newSeller = await Seller.create({
      name,
      phone,
      email,
      adress,
      cuit,
      image,
      enabled,
      category,
    });

    if (cities) {
      let cityDb = await City.findAll({
        where: {
          name: cities,
        },
      });
      newSeller.addCity(cityDb);
    }

    res.send(newSeller);
  } catch (e) {
    console.log(e.message);
    res.status(500).send(`${e}`);
  }
};

// TODO actualizar manager cuando el estado pasa a enabled
const putSeller = async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, adress, cuit, image, city, category, enabled } =
    req.body;

  let sellerToModify = await Seller.findByPk(id);
  try {
    if (!sellerToModify) {
      throw new Error("No hay proveedores con ese ID");
    }
    if (!name) {
      throw new Error("El campo del nombre del establecimiento es obligatorio");
    }
    if (!phone) {
      throw new Error("El campo del teléfono es obligatorio");
    }
    if (!email) {
      throw new Error("El campo del e-mail es obligatorio");
    }
    if (!city) {
      throw new Error("El campo de la ciudad es obligatorio");
    }
    let edited = await Seller.upsert({
      id,
      name,
      phone,
      email,
      adress,
      cuit,
      image,
      category,
      enabled,
    });
    let cityDb = await City.findAll({
      where: { name: city },
    });

    edited[0].setCities(cityDb);
    res.send(edited);
  } catch (e) {
    res.status(500).send(`${e}`);
  }
};

module.exports = {
  getSellers,
  postSeller,
  putSeller,
  
};
