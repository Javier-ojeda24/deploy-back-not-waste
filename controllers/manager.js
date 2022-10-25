const { Manager } = require("../db");
const { arrayManager } = require("../public/arrayManager.js");

const getApiInfo = async () => {
  let objRes = arrayManager.map((manager) => {
    return {
      id: manager.id,
      username: manager.username,
      password: manager.password,
    };
  });
  return objRes;
};

const getDbInfo = async () => {
  return await Manager.findAll();
};

const getAllData = async () => {
  const apiInfo = await getApiInfo();
  const dbInfo = await getDbInfo();
  const infoTotal = apiInfo.concat(dbInfo);
  return infoTotal;
};

const validateNewManager = (newManager) => {
  const { username, password } = newManager;

  if (!username || !password) throw Error("Faltan parametros necesarios");
  if (typeof username !== "string")
    throw Error("el usuario debe ser en formato texto");
  return true;
};

const getManagerById = async (req, res) => {
  const { id } = req.params;

  try {
    let managerId;
    if (id.length < 6) {
      managerId = arrayManager.filter((manager) => manager.id === +id);

      res.status(200).json(managerId);
    } else {
      managerId = await Manager.findByPk(id);
      res.status(200).json(managerId);
    }
  } catch (error) {
    console.log(error);
  }
};

const getAllManager = async (req, res) => {
  const { username } = req.query;
  try {
    let managerList = await getAllData();
    if (username) {
      let searchName = managerList.filter((manager) =>
        manager.username.toLowerCase().includes(username.toLocaleLowerCase())
      );
      searchName.length
        ? res.status(200).send(searchName)
        : res
            .status(404)
            .send(`No se encontró ningun manager con el usuario: ${username}`);
    } else {
      res.status(200).send(managerList);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const postManager = async (req, res) => {
  let { username, password } = req.body;
  const newManager = { username, password };
  try {
    if (validateNewManager(newManager)) {
      newManager.username = newManager.username.toLocaleLowerCase();
      await Manager.create({ ...newManager });

      return res.send("Manager creado exitosamente");
    }
  } catch (error) {
    console.log(error);
    res.json({ msj: error.message });
  }
};

const putManager = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  let findManager = await Manager.findByPk(id);
  try {
    if (!findManager) {
      throw new Error(`No hay Manager con el id: ${id}`);
    }
    if (!password) {
      throw new Error("La contraseña no esta definida");
    }
    await Manager.update({ password }, { where: { id: id } });
    return res.send("Manager modificado exitosamente");
  } catch (error) {
    console.log(error.message);
    res.json({ msj: error.message });
  }
};

module.exports = {
  getAllManager,
  getManagerById,
  postManager,
  putManager,
};
