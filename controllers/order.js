const { Order, Post } = require("../db");
const { arrayOrder } = require("../public/arrayOrder.js");

const getApiInfo = async () => {
  let objRes = arrayOrder.map((order) => {
    return {
      id: order.id,
      date: order.date,
      state: order.state,
      review: order.review,
    };
  });
  return objRes;
};

const getDbInfo = async () => {
  return await Order.findAll();
};

const getAllData = async () => {
  const apiInfo = await getApiInfo();
  const dbInfo = await getDbInfo();
  const infoTotal = apiInfo.concat(dbInfo);
  return infoTotal;
};

const validateNewOrder = (newOrder) => {
  const { state, review } = newOrder;

  if (!state || !review) throw Error("Faltan parametros necesarios");
  if (typeof state !== "string")
    throw Error("el estado debe ser en formato texto");
  if (review < 1 || review > 5)
    throw Error("rating debe ser un número entre 1 y 5");
  return true;
};

const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    let orderId;
    if (id.length < 6) {
      orderId = arrayOrder.filter((order) => order.id === +id);

      res.status(200).json(orderId);
    } else {
      orderId = await Order.findByPk(id);
      res.status(200).json(orderId);
    }
  } catch (error) {
    console.log(error);
  }
};
const getAllOrder = async (req, res) => {
  const { state, customerId } = req.query;
  let orders;
  try {
      orders = await getAllData();
      if (customerId) {
          orders = orders.filter(o => {
            return o.customerId === customerId
          })
          if (!orders.length) {
              throw new Error('No hay ordenes asociadas a ese consumidor')
          };
      }
      if (state) {
          orders = orders.filter(o =>
              o.state === state )
          if (!orders.length) {
              throw new Error('No hay ordenes con ese estado')
          }; 
      
      }
           
      res.status(200).send(orders);
  } catch (e) {
      res.status(404).send(e.message);
  }
};

// const getAllOrder = async (req, res) => {
//   const { state, customerId } = req.query;
//   try {
//     let orderList = await getAllData();
//     if (state) {
//       let orderList = orderList.filter((order) =>
//         order.state.toLowerCase().includes(state.toLocaleLowerCase())
//       );
//       orderList.length
//         ? res.status(200).send(orderList)
//         : res
//             .status(404)
//             .send(`No se encontró ninguna orden con el estado: ${state}`);
//     } if (customerId) {
//       let orderList = orderList.filter((order) =>
//         order.customerId = customerId
//       );
//       res.status(200).send(orderList);
//     }
//     res.status(200).send(orderList);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send(error);
//   }
// };

const postOrder = async (req, res) => {
  let { date, amount, state, review, postId, customerId, payId } = req.body;
  try {
    if (!amount) {
      throw new Error("Debe definirse una cantidad");
    }
    if (!postId) {
      throw new Error("Debe definirse los productos");
    }
    let newOrder = await Order.create({
      date,
      amount,
      state,
      review,
      postId,
      customerId,
      payId,
    });
    newOrder.setPost(postId);
    res.send(newOrder);
  } catch (e) {
    res.status(500).send(`${e}`);
  }
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;
  let orderToDelete = await Order.findByPk(id);
  if (!orderToDelete) {
    return res.status(404).json({
      error: "No hay orders con ese ID",
    });
  }
  await Order.destroy({ where: { id: id } });
  res.send(`La order con el id ${id} fue eliminado`);
};

const putOrder = async (req, res) => {
  const { id } = req.params;
  let { state } = req.body;
  try {
    if (!state) {
      throw new Error("No se recibio parametro state");
    }
    let orderMod = await Order.update(
      {state},
        {where: {id}  });
    let orderModificated = await Order.findByPk(id)
    res.send(orderModificated);
  } catch (e) {
    res.status(500).send(`${e}`);
  }
};

module.exports = {
  getOrderById,
  getAllOrder,
  postOrder,
  deleteOrder,
  putOrder,
};
