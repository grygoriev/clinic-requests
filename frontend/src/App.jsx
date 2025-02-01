import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, Menu, Button, message } from 'antd';
import { useEffect, useState } from 'react';
import { Login, Main, Orders } from './pages/index.js';
import axios from 'axios';
const { Header, Content } = Layout;

export const App = () => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const storedUser = sessionStorage.getItem('userData');
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
	}, []);

	const handleLogout = async () => {
		try {
			await axios.post(
				'http://localhost:3001/api/logout',
				{},
				{ withCredentials: true },
			);
			sessionStorage.removeItem('userData');
			setUser(null);
			message.success('Вы успешно вышли');
		} catch (error) {
			message.error('Ошибка выхода');
		}
	};

	return (
		<Router>
			<Layout style={{ minHeight: '100vh' }}>
				{/* Верхнее меню */}
				<Header>
					<Menu theme="dark" mode="horizontal" selectedKeys={[]}>
						<Menu.Item key="home">
							<a href="/">Главная</a>
						</Menu.Item>
						{user ? (
							<>
								<Menu.Item key="orders">
									<a href="/orders">Заявки</a>
								</Menu.Item>
								<Menu.Item key="logout" style={{ marginLeft: 'auto' }}>
									<Button type="primary" danger onClick={handleLogout}>
										Выйти ({user.email})
									</Button>
								</Menu.Item>
							</>
						) : (
							<Menu.Item key="login" style={{ marginLeft: 'auto' }}>
								<a href="/login">Войти</a>
							</Menu.Item>
						)}
					</Menu>
				</Header>

				<Content style={{ padding: '24px', maxWidth: '1200px', margin: 'auto' }}>
					<Routes>
						<Route path="/" element={<Main />} />
						<Route
							path="/login"
							element={
								user ? (
									<Navigate to="/orders" />
								) : (
									<Login setUser={setUser} />
								)
							}
						/>
						<Route
							path="/orders"
							element={user ? <Orders /> : <Navigate to="/login" />}
						/>
					</Routes>
				</Content>
			</Layout>
		</Router>
	);
};
