import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, message } from "antd";
import axios from "axios";
import { API_URL } from '../../constants/api-url.js';

export const Login = ({ setUser }) => {
	const { Title } = Typography;
	const navigate = useNavigate();

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm();

	const [loading, setLoading] = useState(false);

	const onSubmit = async (data) => {
		try {
			setLoading(true);
			const response = await axios.post(`${API_URL}/api/login`, data, { withCredentials: true });

			if (response.data.error) {
				message.error(response.data.error);
				return;
			}

			sessionStorage.setItem("userData", JSON.stringify(response.data.user));
			setUser(response.data.user);
			message.success("Вы успешно вошли!");
			navigate("/orders");
		} catch (error) {
			message.error("Ошибка авторизации");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
				<Title level={2} className="text-center">Вход для сотрудников</Title>

				<Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
					<Form.Item label="Email" validateStatus={errors.email ? "error" : ""} help={errors.email?.message}>
						<Controller
							name="email"
							control={control}
							rules={{
								required: "Введите email",
								pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Некорректный email" },
							}}
							render={({ field }) => <Input {...field} placeholder="Введите email" />}
						/>
					</Form.Item>

					<Form.Item label="Пароль" validateStatus={errors.password ? "error" : ""} help={errors.password?.message}>
						<Controller
							name="password"
							control={control}
							rules={{ required: "Введите пароль", minLength: { value: 6, message: "Минимум 6 символов" } }}
							render={({ field }) => <Input.Password {...field} placeholder="Введите пароль" />}
						/>
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit" loading={isSubmitting || loading} block>
							{isSubmitting || loading ? "Вход..." : "Войти"}
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
};
