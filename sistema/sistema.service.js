const mailer = require('nodemailer');
const csv = require("csv-parse");
const fs = require('fs');
const user = require('../seguridad/usuario.service');
module.exports = {
    sendOneMail,
    csvParse
};
async function sendOneMail(config) {
    let transporter = mailer.createTransport({
        host: 'www.oesvica.com.ve',
        // secureConnection: false,
        port: 465,
        secure: true,
        requireAuth: true,

        auth: {
            user: 'info@oesvica.com.ve',
            pass: 'xx20182018'
        },
    });

    let options = {
        from: 'info@oesvica.com.ve', // sender address
        to: config.to, // list of receivers
        subject: config.subject, // Subject line
        text: config.text, // plain text body
        html: config.html // html body
    };

    return Promise.resolve(transporter.sendMail(options));
}

async function csvParse(config, res) {
    const results = [];
    const formateo = [];
    let parcer = csv(
        {
            headers: true,
            delimiter: ',',

        }
    )
    fs.createReadStream(config)
        .pipe(parcer)
        .on('data', (data) => {
            results.push(data);
        })
        .on('end', () => {
            let indices = [];
            results.forEach((current, index, arr) => {
                if (index == 0) {
                    indices = current.map((current) => {
                        let cur = "";
                        if (current == "login") {
                            cur = "username";
                        } else if (current == "pass") {
                            cur = "password";
                        } else {
                            cur = current;
                        }
                        return cur;
                    })
                } else {
                    current.forEach((currentV, indexV) => {
                        formateo[index - 1][indices[indexV]] = currentV.toLowerCase();
                    });
                    inde++;
                }

            });
            user.createMany(formateo).then((val) => {
                fs.unlink(config, (err) => {
                    if (err) throw err;
                    //console.log(config + " eliminado");
                });
                res.json({
                    informacion: formateo,
                    indices: indices,
                    respuesta: val
                })
            }).catch((error) => {
                res.json(error);
            })

        });
}