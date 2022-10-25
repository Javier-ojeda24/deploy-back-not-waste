const mercadopago = require("mercadopago");
const { ACCESS_TOKEN_MP_CRISTIAN } = process.env;

mercadopago.configure({
  access_token: ACCESS_TOKEN_MP_CRISTIAN,
});

const post_create_preference = async (req, res) => {
  let preference = {
    items: [
      {
        title: "Not Waste",
        unit_price: Number(req.body.price),
        quantity: 1,
      },
    ],
    back_urls: {
      //esto es donde redirecciona en cada caso
      success: "http://localhost:3000/customer/orders",
      failure: "http://localhost:3000/home",
      pending: "http://localhost:3000/home",
    },
    auto_return: "approved",
    external_reference: req.body.postId,
  };
  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      res.json({
        id: response.body.id,
        psgina_a_redireccionar: response.body.init_point,
        /* postId: response.body.postId, */
      });
    })
    .catch(function (error) {
      console.log(error);
    });
};

const get_feedback = async (req, res) => {
  //mercadopago me redirecciona aca con los datos por query
  res.json({
    Status: req.query.status,
    id: req.query.preference_id,
    queryCompleto: req.query,
  });
};

module.exports = {
  post_create_preference,
  get_feedback,
};
