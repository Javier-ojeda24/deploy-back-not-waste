const product = require("../../public/newProduct-model.json");
const { Product, Diet, Post, Order } = require("../../db");


const getDbInfo = async () => {
  return await Product.findAll({
    include: [
      {
        model: Diet,
        attributes: ["name"],
        through: {
          attributes: [],
        },
      },
      {
        model: Post,
        include: { model: Order },
      },
    ],
  });
};

const getAllProducts = async () => {
 
  const dbInfo = await getDbInfo();

  return dbInfo;
};

module.exports = { getAllProducts };
