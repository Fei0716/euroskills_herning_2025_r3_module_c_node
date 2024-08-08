const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function checkToken(req, res, next) {
    try {
        if (!req.headers.authorization) {
            res.status(401).send("Unauthorized");
            return; //return is important to stop the execution of the function
        }
        const user = await prisma.user.findFirst({
            where: {
                token: req.headers.authorization.split(" ")[1]
            }
        });
        if (!user) {
            res.status(401).send("Unauthorized");
        }
        next();
    } catch (e) {
        console.error(e);
    }
}

module.exports = checkToken;