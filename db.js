require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DATABASE_URL } = process.env;

const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DATABASE_URL}/not_waste`,
  {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

const basename = path.basename(__filename);
const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });
modelDefiners.forEach((model) => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const { Seller, Product, Customer, Manager, Order, Post, City, Diet } =
  sequelize.models;

//Relaciones de Seller
Seller.hasMany(Product);
Product.belongsTo(Seller);
Seller.belongsToMany(City, { through: "seller_city" });
City.belongsToMany(Seller, { through: "seller_city" });
Manager.hasMany(Seller);
Seller.belongsTo(Manager);

//Relaciones de Product
Diet.belongsToMany(Product, { through: "product_diet" });
Product.belongsToMany(Diet, { through: "product_diet" });
Product.hasMany(Post);
Post.belongsTo(Product);

//Relaciones de Post
Post.hasMany(Order);
Order.belongsTo(Post);

//Relaciones Customer
Customer.hasMany(Order);
Order.belongsTo(Customer);
Customer.belongsToMany(City, { through: "customer_city" });
City.belongsToMany(Customer, { through: "customer_city" });
Manager.hasMany(Customer);
Customer.belongsTo(Manager);

// Aca van las Relaciones

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};
