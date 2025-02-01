const mongoose = require('mongoose');
const validator = require('validator');

const OrderSchema = new mongoose.Schema(
	{
		patient_name: { type: String, required: true },
		phone: {
			type: String,
			required: true,
			validate: {
				validator: (value) => validator.isMobilePhone(value, ['uk-UA', 'ru-RU']),
				message: 'Номер телефона должен быть корректным',
			},
		},
		problem: { type: String, required: true },
	},
	{ timestamps: true },
);

module.exports = mongoose.model('Order', OrderSchema);
