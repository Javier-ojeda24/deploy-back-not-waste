const { Product, Diet } = require("../db");
const { getAllProducts } = require("./utils/getAllProducts")
// Ruta get va a buscar a todos los proveedores de la base de datos. Si llegasen las propiedades
// name o store cateogry por query se retornarán los proveedores que coincidan con lo solicitado

const getProducts = async (req, res) => {
    const { diet, price, description } = req.body;
    let products;
    try {
        products = await getAllProducts();
        if (diet) {
            products = products.filter(s =>
                s.diets.find(d => d.name === diet))
            if (!products.length) {
                throw new Error('No hay productos asociados a esa dieta')
            };
        }
        if (price) {
            products = products = products.filter(s =>
                s.price < price )
            if (!products.length) {
                throw new Error('No hay productos con precio inferior al solicitado')
            }; 
        
        }
        if (description) {
            products = products.filter(s => 
                s => s.description.toLowerCase().includes(description.toLowerCase()))
            if (!products.length) {
                throw new Error('No hay proveedores con esa categoría de establecimiento')
            };
        }

        
        res.status(200).send(products);
    } catch (e) {
        res.status(404).send(e.message);
    }
};

const getProductsById = async (req, res) => {
    let { id } = req.params;
    try {
        let allProducts = await getAllProducts();
        let productId = await allProducts.filter(p => p.id === id)
        res.status(200).send(productId);
    } catch (e) {
        res.status(404).send('No hay productos de ese id');
    }
};
//TODO asignar sellerId
const postProduct = async (req, res) => {
    let {
        name,
        price,
        realValue,
        description,
        image,
        diets,
        sellerId
    } = req.body

    try {
        if (!name) { throw new Error('Debe definirse un nombre') }
        if (!price) { throw new Error('Debe definirse un precio') }
        if (!realValue) { throw new Error('Debe definirse un valor real') }
        if (!description) { throw new Error('Debe definirse una descripción') }
        let newProduct = await Product.create({
            name,
            price,
            realValue,
            description,
            image,
            sellerId
        })
        let dietDb = await Diet.findAll({
            where: {
                name: diets,
            },
        });

        newProduct.addDiets(dietDb);

        res.send(newProduct);

    } catch (e) {
        res.status(500).send(`${e.message}`)
    }
};

const putProduct = async (req, res) => {
    const { id } = req.params;
    let {
        name,
        price,
        realValue,
        description,
        image,
        diets
    } = req.body
    let productToModify = await Product.findByPk(id)
    try {
        if (!name) { throw new Error('Debe definirse un nombre') }
        if (!price) { throw new Error('Debe definirse un precio') }
        if (!realValue) { throw new Error('Debe definirse un valor real') }
        if (!description) { throw new Error('Debe definirse una descripción') }
        let productToModify = await Product.upsert(
            {
                id,
                name,
                price,
                realValue,
                description,
                image
            }
        )
        if (diets) {
            let dietDb = await Diet.findAll({
                where: { name: diets }
            })

            productToModify[0].setDiets(dietDb);
        }

        res.send(productToModify);
    } catch (e) {
        res.status(500).send(`${e.message}`)
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    let productToDelete = await Product.findByPk(id)
    if (!productToDelete) {
        return res
            .status(404)
            .json({
                error: 'There is not products with this ID'
            });
    }
    await Product.destroy({ where: { id: id } })
    res.send({result: "objeto eliminado"});
}

module.exports = {
    getProducts,
    postProduct,
    putProduct,
    deleteProduct,
    getProductsById
};
