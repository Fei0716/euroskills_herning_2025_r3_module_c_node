const {PrismaClient} = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function loginWithPassword(req, res, next) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                username: req.body.username,
                password: req.body.password,
            }
        });
        if (!user || user.role !== 'ADMIN') {
            res.status(401).send("Unauthorized");
            return; //return is important to stop the execution of the function
        }
        //create a md5 token
        const token = crypto.createHash('md5').update(user.username).digest('hex');
        // store in the database
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                token: token
            }
        });
        res.status(200).json({
            token: token
        });
    } catch (e) {
        console.error(e);
    }
}

async function loginWithPin(req, res, next) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                pin: req.body.pin,
            }
        });

        if (!user || user.role !== 'WAITER') {
            res.status(401).send("Unauthorized");
            return; //return is important to stop the execution of the function
        }
        //create a md5 token
        const token = crypto.createHash('md5').update(user.username).digest('hex');
        // store in the database
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                token: token
            }
        });
        res.status(200).json({
            token: token
        });
    } catch (e) {
        console.error(e);
    }
}

async function logout(req, res, next) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                token: req.headers.authorization.split(" ")[1],
            }
        });
        if (!user) {
            res.status(401).send("Unauthorized");
            return; //return is important to stop the execution of the function

        }
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                token: null
            }
        });

        res.status(200).send('Logged out');
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    loginWithPassword,
    loginWithPin,
    logout,
}