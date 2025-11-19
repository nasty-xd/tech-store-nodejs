// Контроллер REST API для товаров

const { getModels } = require('../models');

// GET /api/products
async function list(req, res) {
    const { Product } = getModels();
    const products = await Product.findAll({ order: [['id', 'ASC']] });
    res.json(products);
}

// GET /api/products/:id
async function getOne(req, res) {
    const { Product } = getModels();
    const item = await Product.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
}

//POST /api/products
async function create(req, res) {
    const { Product } = getModels();
    const { name, desc, price, category } = req.body;
    let { pic } = req.body;
    if (!pic || !pic.trim()) pic = '/img/pic.png';
    const created = await Product.create({ name, desc, price, pic, category });
    res.status(201).json(created);
}

// PUT /api/products/:id
async function update(req, res) {
    const { Product } = getModels();
    const item = await Product.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found'});
    const { name, desc, price, category } = req.body;
    let { pic } = req.body;
    if (!pic || !pic.trim()) pic = '/img/pic.png';
    await item.update({ name, desc, price, pic, category });
    res.json(item);
}

// DELETE /api/products/:id
async function remove(req, res) {
    const { Product } = getModels();
    const item = await Product.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.destroy();
    res.status(204).send();
}

module.exports = { list, getOne, create, update, remove};

