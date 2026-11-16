const express = require("express");
const router = express.Router();
const prisma = require("../helper/prisma");

router.post("/create", async (req, res, next) => {
   try {
    const {name, description} = req.body;


    const category = await prisma.category.create({
        data: {
            name,
            description
        }
    }); 


    return res.status(201).json({message: "Category created success"})
   } catch (error) {
        next(error);
    }   
});





router.delete("/delete/:id", async (req, res, next) => {
    try {
        const {} = req.params;

        await prisma.category.delete({
            where: {
                id: Number(req.params.id)
            }
        });

        return res.status(200).json({message: "Category deleted success"});
    } catch (error) {
        next(error);
    }
});

router.put("/update/:id", async (req, res, next) => {
    try {
        const {name, description} = req.body;
        const {id} = req.params;    

        const category = await prisma.category.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                name,
                description
            }
        });

        return res.status(200).json({message: "Category updated success"});
    } catch (error) {
        next(error);
    }
});


router.get("/all", async (req, res, next) => {
    try {
        const categories = await prisma.category.findMany();

        return res.status(200).json({message: "Categories retrieved success", data: categories});
    } catch (error) {
        next(error);
    }
});

// router.put("/update", async (req, res, next) => {
//     const {name, email} = req.body;

//     console.log(name,email);
//     return res.status(200).json({message: "Category updated success"})
// });




module.exports = router