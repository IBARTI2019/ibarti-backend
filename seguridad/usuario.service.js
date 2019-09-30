/*jslint(out_of_scope_a)*/
/*jshint esversion: 9 */
var config = require('config.json');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var db = require('_helpers/db');
var User = db.Usuario;
var randT = require('rand-token');


var refreshTokens = {};

module.exports = {
    isLoggedIn,
    gNewTokenAcces,
    authenticate,
    getAll,
    getById,
    create,
    update,
    logout,
    delete: _delete,
};

async function isLoggedIn({
    nro_personal
}) {
    const user = await User.findOne({
        nro_personal
    });
    if (user !== null) {
        if (user.accesToken !== null) {
            try {
                jwt.verify(user.accesToken, config.secret);
            } catch (error) {
                // console.log(error.name, ' ', error.message);
                if (error.name === 'TokenExpiredError' && user.loggedIn) {
                    return (false);
                }
            }
        }
        return (user.loggedIn);
    }
    return null;
}

async function gNewTokenAcces(nro_personalparam, tokenRefresh) {
    // console.log('Data in refreshTokens: ', refreshTokens);
    // await db.dropCollection('Colection');
    // await db.dropCollection('Subcategoria');
    refreshTokens[tokenRefresh] = nro_personalparam;
    if (tokenRefresh in refreshTokens && refreshTokens[tokenRefresh] === nro_personalparam) {
        var user = await User.findOne({
            nro_personal: nro_personalparam
        });
        // console.log(user);
        if (user) {
            user.accesToken = jwt.sign({
                    name: user.nro_personal,
                    sub: user.id,
                    rol: user.rol
                },
                config.secret, {
                    expiresIn: 60
                });
            // console.log(user.accesToken);
            await user.save();
            return (user.accesToken);
        } else {
            return ('User Not Found');
        }
    } else {
        return ('User Not Authorized');
    }
}

async function authenticate({
    nro_personal,
    password
}) {
    const user = await User.findOne({
        nro_personal
    });
    if (user && password === user.password) {
        user.loggedIn = true;
        const {
            hash,
            ...userWithoutHash
        } = user.toObject();
        const token = jwt.sign({
                name: nro_personal,
                sub: user.id,
                rol: ''
            },
            config.secret, {
                expiresIn: 60
            });

        user.accesToken = token;
        const tokenRefresh = randT.generate(16);
        refreshTokens[tokenRefresh] = nro_personal;
        await user.save();
        return {
            ...userWithoutHash,
            token,
            tokenRefresh
        };
    }
}

async function getAll() {
    return await User.find().select('-hash');
}

async function getById(id) {
    return await User.findOne({
        _id: id
    }).select('-hash');
}

async function create(userParam) {
    if (await User.findOne({
            nro_personal: userParam.nro_personal
        })) {
        throw 'Nro Personal "' + userParam.nro_personal + '" is already taken';
    }
    const user = new User(userParam);
    await user.save((error) => {
        if (error) {
            console.log(error);
            throw (error);
        }
    });
    return user;
}

async function update(id, userParam) {
    const user = await User.findById(id);

    if (!user) throw 'User not found';

    if (user.nro_personal !== userParam.nro_personal && await User.findOne({
            nro_personal: userParam.nro_personal
        })) {
        throw 'nro_personal "' + userParam.nro_personal + '" is already taken';
    }

    if (userParam.password) {
        userParam.password = bcrypt.hashSync(userParam.password, 10);
    }

    Object.assign(user, userParam);
    await user.save();
}

async function logout(id, userParam) {

    var user = await User.findById(id);
    if (!user) {
        console.log('User not found');
        throw 'User not found';
    }
    user.loggedIn = false;
    user.accesToken = 'null';
    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}