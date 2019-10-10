const express = require('express');
const router = express.Router();
const systemService = require('./sistema.service');

router.post('/', sendMail);
module.exports = router;
function sendMail(req, res, next) {
    systemService.sendOneMail(req.body).then(info => res.json(info)).catch((err) => next(err));
}