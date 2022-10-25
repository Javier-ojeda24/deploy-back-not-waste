const { Diet } = require("../db");
const { diets } = require("../public/diets");

const getDiets = async (req, res) => {
  let json = diets.map((e) => {
    return {
      id: e.id,
      name: e.name,
    };
  });
  json.forEach((e) => {
    Diet.findAll({
      where: {
        name: e.name,
        id: e.id,
      },
    });
  });
  return res.status(200).send(json);
};


module.exports = {
  getDiets,
};
