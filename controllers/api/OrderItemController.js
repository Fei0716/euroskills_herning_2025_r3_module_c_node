const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function store(req, res, next) {
    try {
        const {orderId, menuItemId, quantity} = req.body;
        if (!orderId || !menuItemId || !quantity) {
            res.status(400).send("Bad Request");
            return;
        }
        const order = await prisma.order.findFirst({
            where: {
                id: orderId
            }
        });
        if (order.closedAt) {
            res.status(400).send("Bad Request");
            return;
        }
        if (!order) {
            res.status(404).send("Order Not Found");
            return;
        }

        const orderItem = await prisma.orderitem.create({
            data: {
                orderId: orderId,
                menuItemId: menuItemId,
                quantity: quantity,
                updatedAt: new Date(),
            }
        });

        res.status(200).json(orderItem);
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    store,
};