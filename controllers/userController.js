const models = require('../models');
const httpResponseFormatter = require('../formatters/httpResponse');
const { getIdParam, hashPassword } = require('./helper');

async function create(req, res) {
	if (req.body.id) {
		httpResponseFormatter.formatOkResponse(res, { message: 'ID should not be provided, since it is determined automatically by the database.' });
	} else {
		try {
			req.body.password = hashPassword(req.body.password);
            await models.users.create(req.body);
            console.log(req.body);
			httpResponseFormatter.formatOkResponse(res, { message: 'A new user is created.' });
		} catch (err) {
            console.log(err);
			httpResponseFormatter.formatOkResponse(res, { err: 'This email is used already. Please choose another one.' });
		}

	}
}

async function getById(req, res) {
    const id = req.params.userID;
    console.log(id);
	
		try {
			const user = await models.users.findByPk(id);
			httpResponseFormatter.formatOkResponse(res, user);
		} catch (err) {
			httpResponseFormatter.formatOkResponse(res, { message: err.message });
		}

}

async function getAll(req, res) {
	
		const users = await models.users.findAll();
		httpResponseFormatter.formatOkResponse(res, users);
	
}

module.exports = {
    create,
    getAll,
    getById
};