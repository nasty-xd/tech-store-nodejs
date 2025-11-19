// Контроллер для веб-части работы с товарами (страницы)

const { getModels } = require('../models');

// Главная страница - список товаров
async function listPage(req, res) {
    const { Product, Category } = getModels();
    const products = await Product.findAll({
        order: [['id', 'ASC']],
        include: Category   // 🆕 добавили
    });
    res.render('index', { title: 'MyShop', products });
}


// Форма сощдания товара (только админ)
async function newForm(req, res) {
    res.render('product_form', { title: 'New Produst', product: null });
}

// Создание товара
async function create(req, res) {
    const { Product } = getModels();
    // Принимаем адрес картинки из формы; по умолчанию используем тестовую
    const { name, desc, price, category } = req.body;
    let { pic } = req.body;
    if (!pic || !pic.trim()) pic = '/img/pic.png';
    await Product.create({ name, desc, price, pic, category });
    res.redirect('/');
}

// Форма редактирования
async function editForm(req, res) {
    const { Product } = getModels();
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).send('Not found');
    res.render('product_form', { title: 'Edit Produst', product });
}

// Обновления товара
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

//Удаление товара
async function remove(req, res) {
    const { Product } = getModels();
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).send('Not found');
    await product.destroy();
    res.redirect('/');
}

module.exports = { listPage, newForm, create, editForm, update, remove };
