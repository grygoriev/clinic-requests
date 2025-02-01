import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Form, Input, Button, message, Typography } from "antd";
import InputMask from "react-input-mask";
import axios from "axios";
import { API_URL } from '../../constants/api-url.js';

export const Main = () => {
	const { Title } = Typography;

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm();

	const [successMessage, setSuccessMessage] = useState("");

	const onSubmit = async (data) => {
		try {
			console.log("Отправляемые данные:", data);
			const cleanedPhone = data.phone.replace(/\D/g, '');

			await axios.post(`${API_URL}/api/orders`, {
				patientName: data.patientName,
				phone: `+${cleanedPhone}`,
				problem: data.problem || '',
			});

			message.success("Заявка успешно отправлена!");
			setSuccessMessage("Заявка успешно отправлена!");
			reset();
		} catch (error) {
			message.error("Ошибка отправки заявки, попробуйте снова.");
			console.error("Ошибка отправки заявки:", error);
		}
	};

	// Автоочистка сообщения после 3 сек.
	useEffect(() => {
		if (successMessage) {
			const timer = setTimeout(() => setSuccessMessage(""), 3000);
			return () => clearTimeout(timer);
		}
	}, [successMessage]);

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-lg">
				<Title level={2} className="text-center">Запись к врачу</Title>

				{successMessage && (
					<div className="bg-green-200 text-green-700 p-2 rounded mb-4 text-center">
						{successMessage}
					</div>
				)}

				<Form layout="vertical" onFinish={handleSubmit(onSubmit)}>

					<Form.Item label="ФИО" validateStatus={errors.patientName ? "error" : ""} help={errors.patientName?.message}>
						<Controller
							name="patientName"
							control={control}
							rules={{ required: "ФИО обязательно" }}
							defaultValue=""
							render={({ field }) => <Input {...field} placeholder="Введите ФИО" />}
						/>
					</Form.Item>

					<Form.Item label="Номер телефона" validateStatus={errors.phone ? "error" : ""} help={errors.phone?.message}>
						<Controller
							name="phone"
							control={control}
							rules={{ required: "Номер телефона обязателен" }}
							defaultValue=""
							render={({ field: { onChange, value } }) => (
								<InputMask
									mask="+380 (99) 999-99-99"
									value={value}
									onChange={(e) => onChange(e.target.value)}
								>
									{(inputProps) => <Input {...inputProps} placeholder="Введите номер" />}
								</InputMask>
							)}
						/>
					</Form.Item>

					<Form.Item label="Опишите вашу проблему">
						<Controller
							name="problem"
							control={control}
							render={({ field }) => <Input.TextArea {...field} placeholder="Опишите вашу проблему (необязательно)" rows={3} />}
						/>
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit" loading={isSubmitting} block>
							{isSubmitting ? "Отправка..." : "Отправить"}
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
};
