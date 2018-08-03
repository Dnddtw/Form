// content of index.js
const express = require('express');
const nodemailer = require('nodemailer');
const pdfkit = require('pdfkit');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const PDFPath = 'public/pdf/';
const token = 'BOT_TOKEN';
const telegram = new TelegramBot(token, { polling: true });

const multer = require('multer');
const upload = multer({dest: 'public/images/photos/'});

app.use(express.static(__dirname));

var smtpTransport = nodemailer.createTransport({
    // service: "Gmail",
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    secure: false,
    auth: {
      user: '',
      pass: ''
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

    const FullName = `${body.Name} ${body.Surname}`;
    const validName = FullName.replace(/\s/g, '');

    var mailHTML = '<ul>',
        PDFData = '';

    for (var key in body) {
        mailHTML += '<li>' + key + ': ' + body[key] +'</li>';
        PDFData += `${key}: ${body[key]}\n`;
    }

    const photo = request.file,
          mimeType = photo ? photo.mimetype.split('/')[1] : false;

    var PDFPhoto = false;

    if (photo && ((mimeType == 'png' || mimeType == 'jpeg' || mimeType == 'gif'))) {
        mailOptions.attachments = [{
            filename: validName +'.png',
            path: photo.path,
            cid: photo.filename
        }];
        PDFPhoto = true;
        mailHTML += '<li style="list-style-type: none">' + '<img src="cid:' + photo.filename + '" />' + '</li>';
    }
    mailHTML += '</ul>';
    mailOptions.html = mailHTML;
    mailOptions.subject = `${body.Name} ${body.Surname}, `;

    var pdf = new pdfkit;
    var PDFFile = PDFPath + validName + '.pdf';

    var writeStream = fs.createWriteStream(PDFFile);
    pdf.pipe(writeStream);
    pdf.fontSize(32);
    pdf.text(FullName);
    pdf.fontSize(14);
    pdf.moveDown();
    pdf.text(PDFData);
    if (PDFPhoto) {
      pdf.image(photo.path);
    }
    pdf.end();
    writeStream.on('finish', () => {
      const fileOptions = {
        filename: FullName,
        contentType: 'application/pdf',
      };
      telegram.sendDocument('chat_id', PDFFile);
    });

    smtpTransport.sendMail(mailOptions, function(error, info) {
        if (error) { return console.log(error) }
        console.log('Message %s sent: %s', info.messageId, info.response);
        smtpTransport.close();
    });

    response.send(body);
});

app.listen(3000);
