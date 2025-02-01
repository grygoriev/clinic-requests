const express = require('express');
const { login, register } = require('../controllers/user');
const mapUser = require('../helpers/mapUser');

const router = express.Router({ mergeParams: true });

router.post('/register', async (req, res) => {
	try {
		const { user, token } = await register(req.body.email, req.body.password);

		res
			.status(200) // Добавил явный статус 200
			.cookie('token', token, { httpOnly: true, sameSite: 'strict' })
			.json({ error: null, user: mapUser(user) }); // Используем json(), а не send()
	} catch (e) {
		res.status(400).json({ error: e.message || 'Unknown error' });
	}
});

router.post('/login', async (req, res) => {
	try {
		const { user, token } = await login(req.body.email, req.body.password);

		res
			.status(200)
			.cookie('token', token, { httpOnly: true, sameSite: 'strict' })
			.json({ error: null, user: mapUser(user) });
	} catch (e) {
		res.status(401).json({ error: e.message || 'Unknown error' }); // 401 вместо 200 для ошибок авторизации
	}
});

router.post('/logout', (req, res) => {
	res
		.status(200)
		.cookie('token', '', { httpOnly: true, expires: new Date(0) }) // Удаление куки
		.json({ message: 'Вы успешно вышли' });
});

module.exports = router;
