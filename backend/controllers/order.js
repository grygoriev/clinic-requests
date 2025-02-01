const Order = require('../models/Order');

// add
async function addOrder(order) {
	const newOrder = await Order.create(order);

	return newOrder;
}

// get list with search and pagination
async function getOrders(
	search = '',
	limit = 10,
	page = 1,
	sortBy = 'publishedAt',
	sortOrder = 'desc',
) {
	const sortOptions = {};
	sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1; // 1 - по возрастанию, -1 - по убыванию

	const filter = search ? { problem: { $regex: search, $options: 'i' } } : {};

	const [orders, count] = await Promise.all([
		Order.find({ problem: { $regex: search, $options: 'i' } })
			.sort(sortOptions)
			.limit(limit)
			.skip((page - 1) * Number(limit)),
		Order.countDocuments(filter),
	]);

	return {
		orders,
		lastPage: Math.ceil(count / limit),
		total: count,
	};
}

module.exports = {
	addOrder,
	getOrders,
};
