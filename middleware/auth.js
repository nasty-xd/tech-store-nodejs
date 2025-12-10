// Middleware handlers for checking authorization and role

function requireAuth(req, res, next) {
    // If the user is not in the session, redirect to the login page
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

function requireAdmin(req, res, next) {
    // Access restricted to admin role only
    if (!req.session.user || req.session.user.rule !== 'admin') {
        return res.status(403).send('Forbidden');
    }
    next();
}

module.exports = { requireAuth, requireAdmin };
