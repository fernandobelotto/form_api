
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import sendEmail from './email.js'
import recaptchaMiddleware from './recaptchaMiddleware.js'
dotenv.config()

import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise'

const client = new RecaptchaEnterpriseServiceClient({
    credentials: {
        client_email: process.env.GOOGLE_RECAPTCHA_EMAIL,
        // https://github.com/auth0/node-jsonwebtoken/issues/642#issuecomment-585173594
        private_key: process.env.GOOGLE_RECAPTCHA_PRIVATE_KEY.replace(/\\n/gm, '\n')
    },
    projectId: process.env.GOOGLE_RECAPTCHA_PROJECT_ID,
});

await client.initialize();

const app = express();
const PORT = process.env.PORT || 8000;

app.set('captcha', {
    client: client,
    key: process.env.GOOGLE_RECAPTCHA_SITE_KEY,
    projectId: process.env.GOOGLE_RECAPTCHA_PROJECT_ID
});

const corsOptions = {
    origin: process.env.ORIGIN,
    methods: ['POST']
}
app.use(bodyParser.json())
app.use(cors())

app.post('/', recaptchaMiddleware, (req, res) => {

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