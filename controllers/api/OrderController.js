const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

async function index(req, res, next) {
    try {
        const orders = await prisma.order.findMany({
            include: {
                orderitems: {
                    include: {
                        menuitem: true,
                    }
                }
            }
        })

        res.status(200).json(orders);
    } catch (e) {
        console.error(e);
    }
}

async function store(req, res, next) {
    try {
        const {tableId} = req.body;
        if (!tableId) {
            res.status(400).send('Bad Request');
            return;
        }
        const table = await prisma.table.findFirst({
            where: {
                id: tableId,
            }
        });
        if (!table) {
            res.status(404).send("Table not found");
            return;
        }
        const tableOrders = await prisma.order.findMany({
            where: {
                tableId: table.id,
            }
        });


        if (tableOrders.find((t) => !t.closedAt)) {
            res.status(400).send("Table already has an open order");
            return;
        }
        const newOrder = await prisma.order.create({
            data: {
                tableId: tableId,
                updatedAt: new Date(),
            }
        });

        res.status(201).json(newOrder);

    } catch (e) {
        console.error(e);
    }
}

async function getOpenOrder(req, res, next) {
    try {
        const tableId = parseInt(req.params.id);

        const table = await prisma.table.findFirst({
            where: {
                id: tableId,
            }
        });
        if (!table) {
            res.status(404).send("Table not found");
            return;
        }
        const openOrder = await prisma.order.findFirst({
            where: {
                tableId: tableId,
                closedAt: null,
            },
            include: {
                orderitems: {
                    include: {
                        menuitem: true,
                    }
                }
            }
        });

        if (!openOrder) {
            res.status(401).send("Order not found");
            return;
        }
        res.status(200).json(openOrder);

    } catch (e) {
        console.error(e);
    }
}

async function closeOrder(req, res, next) {
    try {
        const tableId = parseInt(req.params.id);

        const table = await prisma.table.findFirst({
            where: {
                id: tableId,
            }
        });
        if (!table) {
            res.status(404).send("Table not found");
            return;
        }
        const openOrder = await prisma.order.findFirst({
            where: {
                closedAt: null,
                tableId: tableId,
            }
        });
        if (!openOrder) {
            res.status(404).send("Order Not Found");
            return;
        }
        await prisma.order.update({
            data: {
                closedAt: new Date(),
            },
            where: {
                id: openOrder.id
            }
        });

        res.status(200).send("Order closed successfully");
    } catch (e) {
        console.error(e);
    }
}


module.exports = {
    index,
    store,
    getOpenOrder,
    closeOrder,
}