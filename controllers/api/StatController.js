const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient().$extends({
    result: {
        //table name
        order: {
            //computed field
            totalRevenue: {
                needs: {
                    // price: true,
                    // quantity: true,
                    orderitems: true,
                    // menuitem: true,
                },
                compute(order) {
                    let total = 0;
                    for (let oi of order.orderitems) {
                        total += oi.quantity * oi.menuitem.price;
                    }
                    return total;
                }
            }

        },
        menuitem: {
            count: {
                needs: {
                    orderitems: true,
                },
                compute(menuitem) {
                    let count = 0;
                    for (let i of menuitem.orderitems) {
                        count += i.quantity;
                    }
                    return count;
                }
            }
        }
    }
});


async function index(req, res, next) {
    try {
        let orders = await prisma.order.findMany({
            include: {
                orderitems: {
                    include: {
                        menuitem: true,
                    }
                },
            },
            omit: {
                orderitems: true,
            },

        })
        let total = 0;
        orders.forEach((el, i) => {
            total += el.totalRevenue;
        });


        //to get count of order items
        const orderItems = await prisma.menuitem.findMany({
            include: {
                orderitems: true,
            }
        });
        let countOfOrderItem = [];
        let tempQuantity = 0;
        for (const [index, mi] of orderItems.entries()) {
            tempQuantity = 0
            for (let oi of mi.orderitems) {
                tempQuantity += oi.quantity;
            }
            countOfOrderItem.push({
                "menuItemId": mi.id,
                "menuItemName": mi.name,
                "count": tempQuantity,
            })
        }
        res.status(200).json({
            "totalRevenue": total,
            "countOfOrderItem": countOfOrderItem,
        });
    } catch (e) {
        console.error(e);
    }
}


module.exports = {
    index,
};