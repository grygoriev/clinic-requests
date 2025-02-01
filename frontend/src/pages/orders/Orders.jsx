import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Input, Button, Typography, Space, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { API_URL } from '../../constants/api-url.js';

export const Orders = () => {
	const { Title } = Typography;
	const navigate = useNavigate();

	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState("");
	const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
	const [sortField, setSortField] = useState("publishedAt");
	const [sortOrder, setSortOrder] = useState("desc");

	useEffect(() => {
		const currentUserDataJSON = sessionStorage.getItem("userData");
		if (!currentUserDataJSON) {
			message.error("Доступ запрещен! Войдите в систему.");
			navigate("/login");
		}
	}, [navigate]);

	const fetchOrders = async (page = 1, searchQuery = "", sortField, sortOrder) => {
		try {
			setLoading(true);
			const response = await axios.get(`${API_URL}/api/orders`, {
				withCredentials: true,
				headers: { "Content-Type": "application/json" },
				params: {
					search: searchQuery,
					limit: pagination.pageSize,
					page,
					sortBy: sortField === "publishedAt" ? "createdAt" : "patientName" ? "patient_name" : sortField,
					sortOrder: sortOrder === "ascend" ? "asc" : "desc",
				},
			});

			const { orders, lastPage } = response.data.data;
			setOrders(orders);
			setPagination({ ...pagination, total: lastPage * pagination.pageSize, current: page });
		} catch (error) {
			message.error("Ошибка загрузки заявок");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOrders(pagination.current, search, sortField, sortOrder);
	}, [pagination.current, search, sortField, sortOrder]);

	const handleTableChange = (pagination, filters, sorter) => {
		setSortField(sorter.field || "publishedAt");
		setSortOrder(sorter.order || "descend");
		setPagination((prev) => ({ ...prev, current: pagination.current }));
	};

	const columns = [
		{
			title: "Дата отправки",
			dataIndex: "publishedAt",
			key: "publishedAt",
			sorter: true,
			render: (date) => new Date(date).toLocaleString("ru-RU"),
		},
		{
			title: "ФИО",
			dataIndex: "patientName",
			key: "patientName",
			sorter: true,
		},
		{
			title: "Телефон",
			dataIndex: "phone",
			key: "phone",
			sorter: true,
		},
		{
			title: "Проблема",
			dataIndex: "problem",
			key: "problem",
			sorter: true,
		},
	];

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
			<div className="w-full max-w-4xl bg-white p-6 shadow-lg rounded-lg">
				<Title level={2} className="text-center">Заявки</Title>

				<Space style={{ marginBottom: 16 }}>
					<Input
						placeholder="Поиск по проблеме..."
						allowClear
						prefix={<SearchOutlined />}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<Button type="primary" onClick={() => fetchOrders(1, search, sortField, sortOrder)}>Искать</Button>
				</Space>

				<Table
					columns={columns}
					dataSource={orders}
					loading={loading}
					rowKey="id"
					pagination={{
						current: pagination.current,
						pageSize: pagination.pageSize,
						total: pagination.total,
						onChange: (page) => setPagination((prev) => ({ ...prev, current: page })),
					}}
					onChange={handleTableChange}
				/>
			</div>
		</div>
	);
};
