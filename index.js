
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import sendEmail from './email.js'

dotenv.config()

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json())
app.use(cors())

app.post('/', (req, res) => {
    sendEmail({
        email: req.body?.email || 'no email received',
        message: req.body?.message || 'no message received',
        name: req.body?.name || 'no name received'
    })
    res.send({ status: "ok" })
})

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});