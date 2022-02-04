let recaptchaMiddleware = async (req, res, next) => {

    let captcha = req.app.get('captcha');

    const expectedAction = req.body.action;

    const request = {
        assessment: {
            event: {
                token: req.body.token,
                siteKey: captcha.key,
                userAgent: req.headers['user-agent'],
                userIpAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                expectedAction: expectedAction
            }
        },
        parent: captcha.client.projectPath(captcha.projectId)
    };

    captcha.client.createAssessment(request,
        (error, response) => {
            if (error) {
                return res.status(400)
            }

            if (response?.riskAnalysis?.score > 0.5) {
                return next()
            }

            return res.status(400)
        }
    )

};

export default recaptchaMiddleware