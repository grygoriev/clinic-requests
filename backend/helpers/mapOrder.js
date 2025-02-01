module.exports = function (order) {
	return {
		id: order.id,
		patientName: order.patient_name,
		phone: order.phone,
		problem: order.problem,
		publishedAt: order.createdAt,
	};
};
