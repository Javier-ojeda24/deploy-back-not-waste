const { City } = require("../db");
const { arraycity } = require("../public/arrayCity.js");

const getCityInfo = (req, res) => {
  let json = arraycity.map((e) => {
    return {
      id: e.id,
      name: e.name,
    };
  });
  json.forEach((e) => {
    City.findAll({
      where: {
        name: e.name,
        id: e.id,
      },
    });
  });
  return res.status(200).send(json);
};
module.exports = {
  getCityInfo,
};
