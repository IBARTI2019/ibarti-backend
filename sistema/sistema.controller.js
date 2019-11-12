const express = require('express');
const router = express.Router();
const systemService = require('./sistema.service');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({
    uploadDir: './uploads'
});

router.post('/', sendMail);
router.post('/file', multipartMiddleware, getFile);
module.exports = router;

function getFile(req, res, next) {
    systemService.csvParse(req.files.uploads[0].path, res);
}

function sendMail(req, res, next) {
    systemService.sendOneMail(req.body).then(info => res.json(info)).catch((err) => next(err));
}

