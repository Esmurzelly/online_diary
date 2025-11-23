import express from 'express';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import 'dotenv/config';
import cors from 'cors';
import serviceRouter from './routes/index.js'

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'))

app.use('/api', serviceRouter);

if(!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
};

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})

app.get('/api', (req, res) => {
    res.send("Hello world from server /api")
});