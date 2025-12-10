// Controller for the web part of product management (pages)

const { getModels } = require('../models');

// Home page - list of products
async function listPage(req, res) {
    const { Product, Category } = getModels();
    const products = await Product.findAll({
        order: [['id', 'ASC']],
        include: Category   // 🆕 добавили
    });
    res.render('index', { title: 'MyShop', products });
}


// Product creation form (admin only)
async function newForm(req, res) {
    res.render('product_form', { title: 'New Produst', product: null });
}

// Creating a product
async function create(req, res) {
    const { Product } = getModels();
    // Receiving the image URL from the form; using a default test image if none provided
    const { name, desc, price, category } = req.body;
    let { pic } = req.body;
    if (!pic || !pic.trim()) pic = '/img/pic.png';
    await Product.create({ name, desc, price, pic, category });
    res.redirect('/');
}

// Edit form
async function editForm(req, res) {
    const { Product } = getModels();
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).send('Not found');
    res.render('product_form', { title: 'Edit Produst', product });
}

// Updating the product
async function update(req, res) {
    const { Product } = getModels();
    const { name, desc, price, category } = req.body;
    let { pic } = req.body;
    if (!pic || !pic.trim()) pic = '/img/pic.png';
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).send('Not found');
    await product.update({ name, desc, price, pic, category});
    res.redirect('/');
}

// Deleting the product
async function remove(req, res) {
    const { Product } = getModels();
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).send('Not found');
    await product.destroy();
    res.redirect('/');
}

module.exports = { listPage, newForm, create, editForm, update, remove };
