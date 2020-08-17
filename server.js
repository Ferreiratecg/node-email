const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const { gmail } = require('googleapis/build/src/apis/gmail');
const OAuth2 = google.auth.OAuth2;

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send({
        message: 'Rota Principal'
    })
});

app.listen(PORT, function (req, res) {
    console.log(`Listening on port ${PORT}`);
})

const myOAuth2Client = new OAuth2(
    "756226887896-bhprrgpv8nslj10iksan5kemdafp6nog.apps.googleusercontent.com",
    "7l_HJFI1TltEGLeMI6LmL30E",
    "https://developers.google.com/oauthplayground"
);

myOAuth2Client.setCredentials({
    refresh_token: "1//04WEiXux67B7CCgYIARAAGAQSNwF-L9IrWRi4sQHz9h1gcGp9mgzKQGaSb7I2epamfNETct-6CnjHshSoNTM909OU_h23RglIexA"
});

const myAccessToken = myOAuth2Client.getAccessToken();

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: "samspapelaria@gmail.com", //your gmail account you used to set the project up in google cloud console"
        clientId: "756226887896-bhprrgpv8nslj10iksan5kemdafp6nog.apps.googleusercontent.com",
        clientSecret: "7l_HJFI1TltEGLeMI6LmL30E",
        refreshToken: "1//04WEiXux67B7CCgYIARAAGAQSNwF-L9IrWRi4sQHz9h1gcGp9mgzKQGaSb7I2epamfNETct-6CnjHshSoNTM909OU_h23RglIexA",
        accessToken: myAccessToken //access token variable we defined earlier
    }
});

app.post('/sendemail', function (req, res) {
    const mailOptions = {
        from: 'samspapelaria@email.com', // sender
        to: req.body.email, // receiver
        subject: 'Teste envio de email', // Subject
        html: '<p> Este é um teste de envio de email utilizando auth2)</p>'// html body
       
    };
    
    transport.sendMail(mailOptions, function (err, result) {
        if (err) {
            res.send({
                message: err
            })
        } else {
            transport.close();
            res.send({
                message: 'Email usado com sucesso!'
            })
        }
    })
});