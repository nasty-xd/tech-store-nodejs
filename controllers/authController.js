// Authorization controller: user login/logout

const bcrypt = require('bcryptjs');
const { getModels } = require('../models');

// Get /login - login form
async function getLogin(req, res) {
    // If already logged in, redirect to the main page
    if (req.session.user) return res.redirect('/');
    const showError = Boolean(req.query.error);
    res.render('login', { title: 'Enter', showError });
}

// POST /login - login processing
async function postLogin(req, res) {
    const { email, password } = req.body;
    const { User } = getModels();

    //searching for a user by email
    const user = await User.findOne({ where: { email }});
    if (!user) {
        return res.redirect('/login?error=1');
    }

    // checking the password
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.redirect('/login?error=1');
    }

    // successful login - saving the required fields in the session
    req.session.user = { id: user.id, name: user.name, email: user.email, rule: user.rule };
    res.redirect('/');
}

// POST /logout 
async function postLogout(req, res) {
    req.session.destroy(() => {
        res.redirect('/');
    });
}

module.exports = { getLogin, postLogin, postLogout};
