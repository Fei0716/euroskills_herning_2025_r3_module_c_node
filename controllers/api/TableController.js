const {PrismaClient} = require('@prisma/client');

//to extend the client and to add a computed field
const prisma = new PrismaClient().$extends({
    result: {
        table: {
            hasOpenOrder: {
                needs: {orders: true},
                compute(table) {
                    return table.orders.some(order => order.closedAt === null);
                },
            },
            //for adding more computed properties
            // test: {
            //     needs: {orders: true},
            //     compute(table) {
            //         return table.orders.some(order => order.closedAt === null);
            //     },
            // },
            // lol: {
            //     needs: {orders: true},
            //     compute(table) {
            //         return table.orders.length > 0 ? table.orders[0].createdAt : null;
            //     }
            // }

        }
    }
});

async function index(req, res, next) {
    try {
        const tables = await prisma.table.findMany({
            omit: {
                orders: true,
            },
            include: {
                orders: true, // Include related orders to use in the computation
            },
        });
        res.status(200).json(tables);
    } catch (e) {
        console.error(e);
    }
}


module.exports = {
    index,
}