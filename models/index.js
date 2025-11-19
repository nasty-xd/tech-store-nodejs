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

    // Начальные товары: добавим 6, если их меньше 6
    const productsCount = await Product.count();
    if (productsCount < 6) {
        const needed = 6 - productsCount;
        const baseDesc = 'Sample product description for demo purposes.';
        const pic = '/img/pic.png';
        const category = 'technology';
        const existing = await Product.findAll({ attributes: ['name'] });
        const existingNames = new Set(existing.map((p) => p.name));

        const items = [];
        for (let i = 1; i <= 6; i++) {
            const name = `Demo Produst ${i}`;
            if (!existingNames.has(name)) {
                items.push({ name, desc: baseDesc, price: (i * 10). toFixed(2), pic, category });
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
