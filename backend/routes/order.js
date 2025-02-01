const express = require('express');
const {
	getOrders,
	addOrder,
} = require('../controllers/order');
const authenticated = require('../middlewares/authenticated');
const mapOrder = require('../helpers/mapOrder');

const router = express.Router({ mergeParams: true });

router.get('/', authenticated, async (req, res) => {
	const { orders, lastPage, total } = await getOrders(
		req.query.search,
		req.query.limit,
		req.query.page,
		req.query.sortBy,
		req.query.sortOrder
	);

	res.send({ data: { lastPage, orders: orders.map(mapOrder), total } });
});


router.post('/', async (req, res) => {
	const newOrder = await addOrder({
		patient_name: req.body.patientName,
		phone: req.body.phone,
		problem: req.body.problem,
	});

	res.send({ data: mapOrder(newOrder) });
});

module.exports = router;
