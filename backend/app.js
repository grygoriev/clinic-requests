require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const routes = require('./routes');

const port = 3001;
const app = express();

app.use(express.static(path.resolve('..', 'frontend', 'build')));

const allowedOrigins = ["http://localhost:5173", "http://159.69.186.247", 'https://159.69.186.247'];
app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
		optionsSuccessStatus: 200,
	})
);

app.use(cookieParser());
app.use(express.json());

app.use('/api', routes);

app.get('*', (req, res) => {
	res.sendFile(path.resolve('..', 'frontend', 'build', 'index.html'));
});

mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => {
	app.listen(port, () => {
		console.log(`Server started on port ${port}`);
	});
});
