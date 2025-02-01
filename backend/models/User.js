const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: [true, 'Email обязателен'],
			unique: true,
			lowercase: true,
			trim: true,
			validate: {
				validator: validator.isEmail,
				message: 'Некорректный формат email',
			},
		},
		password: {
			type: String,
			required: [true, 'Пароль обязателен'],
			minlength: [6, 'Пароль должен быть минимум 6 символов'],
		},
	},
	{ timestamps: true }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
