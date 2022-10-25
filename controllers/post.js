const { Post, Order, Diet } = require("../db");
const { getAllPosts } = require("./utils/getAllPosts")


const getPosts = async (req, res) => {
    let posts;
    const id = req.query.id
    let respuesta = {respuesta: "no existe el post"};
    try {
        posts = await getAllPosts();
        if (id) {for (let i = 0; i < posts.length; i++) {
            if(posts[i].id === id) {
                respuesta = posts[i]
            }
        }} else respuesta = posts
        res.status(200).send(respuesta);
    } catch (e) {
        res.status(404).send(e.message);
    }
};


const postPost = async (req, res) => {
    let {
        date,
        amount,
        productId,
    } = req.body

    try {
        if (!date) { throw new Error('Debe definirse una fecha') }
        if (!amount) { throw new Error('Debe definirse una cantidad') }
        if (!productId) { throw new Error('Debe definirse los productos') }
        let newPost = await Post.create({
            date,
            amount
        })
        newPost.setProduct(productId)
        res.send(newPost);
    } catch (e) {
        res.status(500).send(`${e}`)
    }
};

const putPost = async (req, res) => {
    const { id } = req.params;
    let {
        date,
        amount,
        productId,
    } = req.body
    try {
        if (!date) { throw new Error('Debe definirse una fecha') }
        if (!amount) { throw new Error('Debe definirse una cantidad') }
        if (!productId) { throw new Error('Debe definirse los productos') }
        let postToModify = await Post.upsert({
            id,
            date,
            amount,
            productId
        })
        res.send(postToModify);
    } catch (e) {
        res.status(500).send(`${e}`)
    }
};

const deletePost = async (req, res) => {
    const { id } = req.params;
    let postToDelete = await Post.findByPk(id)
    if (!postToDelete) {
        return res
            .status(404)
            .json({
                error: 'There is not posts with this ID'
            });
    }
    await Post.destroy({ where: { id: id } })
    res.send(`El producto con el id ${id} fue eliminado`);
}
const getPostById = async (req, res) => {
    let { id } = req.params;
    try {
        let postId = await Post.findByPk(id);
    
        res.status(200).send(postId);
    } catch (e) {
        res.status(404).send('No hay posts de ese id');
    }
};

module.exports = {
    getPostById,
    getPosts,
    postPost,
    putPost,
    deletePost
};
