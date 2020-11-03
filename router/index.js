const httpResponseFormatter = require('../formatters/httpResponse');
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');

module.exports = app => {
    app.get('/', (req, res) => {
        httpResponseFormatter.formatOkResponse(res, { message: 'Set up server successfully' });
    });

    app.get('/user/all', userController.getAll);

    app.get('/user/:userID', userController.getById);

    app.post('/user/new', userController.create);

    app.post('/admin/new', adminController.create);

    app.post('/admin/login', adminController.loginSubmit);
}