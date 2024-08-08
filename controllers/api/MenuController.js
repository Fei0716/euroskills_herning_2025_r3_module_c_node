const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

async function index(req, res, next) {
    try {
        const menuItems = await prisma.menuitem.findMany();
        res.status(200).json(menuItems);
    } catch (e) {
        console.error(e);
    }
}

async function store(req, res, next) {
    try {
        const {name, type, menuCategoryId, price} = req.body;
        //check for empty fields
        if (!name || !type || !menuCategoryId || !price) {
            res.status(400).send("One of the mandatory fields is missing");
            return;
        }
        //check if the menu category exists
        const menuCategory = await prisma.menucategory.findFirst({
            where: {
                id: menuCategoryId,
            }
        });
        if (!menuCategory) {
            res.status(400).send("Menucard category with the given ID does not exist");
            return;
        }
        //check for valid type
        if (!['FOOD', 'DRINK', 'OTHER'].includes(type)) {
            res.status(400).send("Value of the type field is invalid");
            return;
        }
        const menuItem = await prisma.menuitem.create({
            data: {
                name: name,
                type: type,
                price: price,
                menuCategoryId: menuCategoryId,
                updatedAt: new Date(),
            }
        });

        res.status(200).json(menuItem);
    } catch (e) {
        console.error(e);
    }
}

async function update(req, res, next) {
    try {
        const {name, type, menuCategoryId, price} = req.body;
        //check for empty fields
        if (!name || !type || !menuCategoryId || !price) {
            res.status(400).send("One of the mandatory fields is missing");
            return;
        }
        //check if the menu category exists
        const menuCategory = await prisma.menucategory.findFirst({
            where: {
                id: menuCategoryId,
            }
        });
        if (!menuCategory) {
            res.status(400).send("Menucard category with the given ID does not exist");
            return;
        }
        //check for valid type
        if (!['FOOD', 'DRINK', 'OTHER'].includes(type)) {
            res.status(400).send("Value of the type field is invalid");
            return;
        }
        //check if the menu item exists
        const menuItem = await prisma.menuitem.findFirst({
            where: {
                id: parseInt(req.params.id),
            }
        });
        if (!menuItem) {
            res.status(404).send("Menu item not found");
            return;
        }
        const newMenuItem = await prisma.menuitem.update({
            where: {
                id: menuItem.id,
            },
            data: {
                name: name,
                type: type,
                price: price,
                menuCategoryId: menuCategoryId,
                updatedAt: new Date(),
            }
        });

        res.status(200).json(newMenuItem);
    } catch (e) {
        console.error(e);
    }
}

async function destroy(req, res, next) {
    try {
        const menuItem = await prisma.menuitem.findFirst({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if (!menuItem) {
            res.status(404).send("Menu item not found");
            return;
        }

        await prisma.menuitem.delete({
            where: {
                id: parseInt(menuItem.id),
            }
        });

        res.status(200).send("Menu item deleted");
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    index,
    store,
    update,
    destroy,
}