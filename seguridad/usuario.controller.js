const express = require('express');
const router = express.Router();
const userService = require('./usuario.service');

router.post('/authenticate', authenticate);
router.post('/register', register);
router.post('/token', gNewTokenAcces);
router.get('/', getAll);
router.get('/actual', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.put('/logout/:id', logout);
router.delete('/:id', _delete);

module.exports = router;

function authenticate(req, res, next) {
    userService.isLoggedIn(req.body)
        .then((loggedIn) => {
            if (loggedIn) {
                res.status(400).json({
                    message: 'Este Usuario ya posee sesion activa'
                });
            } else {
                userService.authenticate(req.body)
                    .then((user) => user ? res.json(user) : res.status(400).json({
                        message: 'Username or password is incorrect'
                    }))
                    .catch((err) => next(err));
            }
        })
        .catch((err) => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then((data) => {
            return res.json(data);
        })
        .catch((err) => next(err));
}

function gNewTokenAcces(req, res, next) {
    userService.gNewTokenAcces(req.body.username, req.body.tokenRefresh)
        .then((newTokenAcces) => {
            if (newTokenAcces !== 'User Not Found' && newTokenAcces !== 'User Not Authorized') {
                res.json(newTokenAcces);
            } else if (newTokenAcces === 'User Not Found') {
                res.status(400).json({
                    message: newTokenAcces
                });
            } else {
                res.status(401).json({
                    message: newTokenAcces
                });
            }
        })
        .catch((err) => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then((users) => res.json(users))
        .catch((err) => {
            console.log('Mensaje de Error: ', err);
            next(err);
        });
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then((user) => user ? res.json(user) : res.sendStatus(404))
        .catch((err) => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then((user) => user ? res.json(user) : res.sendStatus(404))
        .catch((err) => next(err));
}

function logout(req, res, next) {
    userService.logout(req.params.id)
        .then(() => res.json({}))
        .catch((err) => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch((err) => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch((err) => next(err));
}