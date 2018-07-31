// content of index.js
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();

const multer = require('multer');
const upload = multer({dest: 'public/images/photos/'});

app.use(express.static(__dirname));

var smtpTransport = nodemailer.createTransport({
    // service: "Gmail",
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    secure: false,
    auth: {
      user: '', // User login
      pass: '' // User password
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Setup mail configuration
var mailOptions = {
    from: '',
    to: ""
};

app.post('/', upload.single('Photo'), function(request, response) {
    const body = request.body;
    if (!body) return response.sendStatus(400);    

    var letstry = '<ul>';
    for (var key in body) {
        letstry += '<li>' + key + ': ' + body[key] +'</li>';
    }

    const photo = request.file,
          mimeType = photo ? photo.mimetype.split('/')[1] : false;

    if (photo && ((mimeType == 'png' || mimeType == 'jpeg' || mimeType == 'gif'))) {
        mailOptions.attachments = [{
            filename: body.Name + body.Surname +'.png',
            path: photo.path,
            cid: photo.filename
        }];   

        letstry += '<li style="list-style-type: none">' + '<img src="cid:' + photo.filename + '" />' + '</li>';
    }
    letstry += '</ul>';
    mailOptions.html = letstry;
    mailOptions.subject = `${body.Name} ${body.Surname}, Form Submit`;

    // console.log(letstry);
    
    smtpTransport.sendMail(mailOptions, function(error, info) {
        if (error) return console.log(error);

        console.log('Message %s sent: %s', info.messageId, info.response);
        smtpTransport.close();
    });

    response.send(body);
});

app.listen(80);