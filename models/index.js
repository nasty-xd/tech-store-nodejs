// Инициализация Sequelize, определение моделей и начальное наполнение БД

const bcrypt = require('bcryptjs');
const { createSequelize } = require('../config/database');

const defineUser = require('./User');
const defineProduct = require('./Product');

let sequelize;
let User;
let Product;

async function initDb() {
    // Создаем инстанм Sequelize и модели 
    sequelize = await createSequelize();

    User = defineUser(sequelize);
    Product = defineProduct(sequelize);

    // Синхронизируемые модели (создаем таблицы при отстствии)
    await sequelize.sync();

    // Начальные данные: два пользователя при отсутствии
    const userCount = await User.count();
    if (userCount === 0) {
        // Шифруем пароли
        const adminPass = await bcrypt.hash('123', 10);
        const userPass = await bcrypt.hash('321', 10);

        await User.bulkCreate([
            { name: 'Administrator', email: 'admin@myshop.local', password: adminPass, rule: 'admin'},
            { name: 'Customer', email: 'user@myshop.local', password: userPass, rule: 'user'}
        ]);
    }

   


const productsCount = await Product.count();
if (productsCount < 6) {
    const needed = 6 - productsCount;
    const baseDesc = [
        'A fast and reliable computer for work and entertainment.',
        'Immersive audio for everyday use.',
        'Portable power for work and play.',
        'Precision control at your fingertips.',
        'Smart, fast, and connected.',
        'Lightweight device for work and fun.'
    ];
    const pics = [
        '/img/computer.jpg',
        '/img/headphones.jpg',
        '/img/laptop.jpg',
        '/img/mouse.jpg',
        '/img/phone.jpg',
        '/img/tablet.jpg'
    ];
    const categories = ['technology', 'gadgets', 'home', 'office', 'sports', 'outdoors'];

    const existing = await Product.findAll({ attributes: ['name'] });
    const existingNames = new Set(existing.map((p) => p.name));

    const items = [];
    for (let i = 1; i <= 6; i++) {
        const name = `Demo Product ${i}`;
        if (!existingNames.has(name)) {
            items.push({
                name,
                desc: baseDesc[i - 1],                  // разное описание
                price: (Math.random() * 100 + 10).toFixed(2),  // случайная цена
                pic: pics[i - 1],                       // разные картинки
                category: categories[i - 1]             // разные категории
            });
        }
    }

    if (items.length) {
        await Product.bulkCreate(items);
    }
}

return sequelize;
}

function getModels() {
    if (!sequelize) throw new Error('DB not instalized yet');
    return { sequelize, User, Product };
}



module.exports = { initDb, getModels };
