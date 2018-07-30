// content of index.js
const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const multer = require('multer');
const upload = multer({dest: 'public/images/photos/'});

app.use(express.static(__dirname));

var smtpTransport = nodemailer.createTransport({
    // service: "Gmail",
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    tls: { rejectUnauthorized: false }
    auth: {
      user: '', // User login
      pass: ''  // User password
    },
  });

// Setup mail configuration
var mailOptions = {
    from: '', // Sender address
    to: "", // List of receivers
};

app.post('/', upload.single('Photo'), function(request, response) {
    const body = request.body;
    if (!body) return response.sendStatus(400);    

    var mailHTML = '';
    for (var key in body) {
        mailHTML += '<li>' + key + ': ' + request.body[key] +'</li>';
    }

    // Check format photo. Skip if it is not .png, .jpeg (.jpg) or .gif.
    const photo = request.file,
          mimeType = photo ? photo.mimetype.split('/')[1] : false;

    if (photo && ((mimeType == 'png' || mimeType == 'jpeg' || mimeType == 'gif'))) {
        mailOptions.attachments = [{
            filename: body.name + body.surname +'.png',
            path: photo.path,
            cid: photo.filename
        }];   
        mailHTML += '<li style="list-style-type: none">' + '<img src="cid:' + photo.filename + '" />' + '</li>';
    }

    // It makes html body of a mail message;
    mailOptions.html = '<ul>' + mailHTML + '</ul>';
    mailOptions.subject = `${body.name} ${body.surname}, Form Submit`;
    
    // Nodemailer sendMail
    smtpTransport.sendMail(mailOptions, function(error, info) {
        if (error) return console.log(error);
        smtpTransport.close();
    });

    response.send(request.body);
});

app.listen(3000);