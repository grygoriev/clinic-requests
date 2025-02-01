const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generate } = require('../helpers/token');

// register
async function register(email, password) {
	if (!password) {
		throw new Error('Password is required');
	}

	const passwordHash = await bcrypt.hash(password, 10);

	const user = await User.create({
		email,
		password: passwordHash,
	});
	const token = generate({ id: user.id });

	return { user, token };
}


// login
async function login(email, password) {
	const user = await User.findOne({ email });

	if (!user) throw new Error('Пользователь не найден');

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) throw new Error('Неверный пароль');

	const token = generate({ id: user.id });

	return { token, user };
}

module.exports = {
	login,
	register,
};