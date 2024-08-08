const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

async function index(req, res, next) {
    try {
        const menuCategories = await prisma.menucategory.findMany({
            orderBy: {
                priority: 'asc',
            }
        });
        res.status(200).json(menuCategories);
    } catch (e) {
        console.error(e);
    }
}

async function store(req, res, next) {
    try {
        const {name, priority} = req.body;
        //check for empty fields
        if (!name || !priority) {
            res.status(400).send("One of the mandatory fields is missing");
            return;
        }
        const menuCategory = await prisma.menucategory.create({
            data: {
                name: name,
                priority: priority,
                updatedAt: new Date(),
            }
        });

        res.status(200).json(menuCategory);
    } catch (e) {
        console.error(e);
    }
}

async function update(req, res, next) {
    try {
        const {name, priority} = req.body;
        //check for empty fields
        if (!name || !priority) {
            res.status(400).send("One of the mandatory fields is missing");
            return;
        }
        //check if the menu category exists
        const menuCategory = await prisma.menucategory.findFirst({
            where: {
                id: parseInt(req.params.id),
            }
        });
        if (!menuCategory) {
            res.status(400).send("Menucard category with the given ID does not exist");
            return;
        }

        const updatedMenuCategory = await prisma.menucategory.update({
            where: {
                id: menuCategory.id,
            },
            data: {
                name: name,
                priority: priority,
                updatedAt: new Date(),
            }
        });

        res.status(200).json(updatedMenuCategory);
    } catch (e) {
        console.error(e);
    }
}

async function destroy(req, res, next) {
    try {
        const menuCategory = await prisma.menucategory.findFirst({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if (!menuCategory) {
            res.status(404).send("Menu category not found");
            return;
        }

        await prisma.menucategory.delete({
            where: {
                id: parseInt(menuCategory.id),
            }
        });

        res.status(200).send("Menu category deleted");
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