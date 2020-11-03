const models = require('../models');
const httpResponseFormatter = require('../formatters/httpResponse');
const bcrypt = require('bcrypt');
const { getIdParam, hashPassword } = require('./helper');

async function create(req, res) {
	if (req.body.id) {
		httpResponseFormatter.formatOkResponse(res, { message: 'ID should not be provided, since it is determined automatically by the database.' });
	} else {
		try {
			req.body.password = hashPassword(req.body.password);
            await models.adminsTable.create(req.body);
            console.log(req.body);
			httpResponseFormatter.formatOkResponse(res, { message: 'A new admin is created.' });
		} catch (err) {
            console.log(err);
			httpResponseFormatter.formatOkResponse(res, { err: 'This email is used already. Please choose another one.' });
		}

	}
}

async function loginSubmit (req, res) {
    try {
        const admin = await models.adminsTable.findOne({ where: { email: req.body.email } });

        if (!admin) {
            httpResponseFormatter.formatOkResponse(res, {
                err: 'This admin doesn\'t exist'
            });
        } else {
            if (bcrypt.compareSync(req.body.password, admin.password)) {
                req.session.adminID = admin.id;
                console.log(typeof(admin.id));
                console.log(req.session);
                httpResponseFormatter.formatOkResponse(res, admin);
            } else {
                httpResponseFormatter.formatOkResponse(res, {
                    err: 'password is wrong'
                });
            }
        }

    } catch (err) {
        console.log(err);
        httpResponseFormatter.formatOkResponse(res, {
            err: err.message
        });
    }
}

function logout (req, res) {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        httpResponseFormatter.formatOkResponse(res, {
            message: 'log out'
        });
    });
};

async function checkAuthentication (req, res) {
    console.log(req.session);
    if (req.session.userId) {
        const user = await models.adminsTable.findByPk(req.session.userId);
        httpResponseFormatter.formatOkResponse(res, user);
    } else {
        httpResponseFormatter.formatOkResponse(res, {
            message: 'You need to log in to able to access your database.'
        });
    }
}

module.exports = {
    create,
    loginSubmit,
    logout,
    checkAuthentication
};