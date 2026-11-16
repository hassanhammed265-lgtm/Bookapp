const express = require("express");
const prisma = require("../helper/prisma");
const router = express.Router();
const userSchema = require("../joischema/userSchema");

const authProtect = require("../middleware/auth");

router.post("/create", authProtect, async (req, res, next) => {
  try {
    const { title, author, description, categoryId, priceRequest } = req.body;
    const { sub, isAdmin } = req.user;

    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        description,
        categoryId: Number(categoryId),
        userId: Number(sub),
        priceRequest: Number(priceRequest),
      },
    });
    return res.status(201).json({ message: "Book created success", newBook });
  } catch (error) {
    next(error);
  }
});

router.put("/update", authProtect, async (req, res, next) => {
  try {
    const { title, author, description, priceRequest, bookId } = req.body;
    const { sub } = req.user;

    // console.log(bookId, "got here")
    const book = await prisma.book.update({
      where: {
        id: Number(bookId),
        userId: Number(sub),
      },
      data: {
        title,
        author,
        description,
        priceRequest: Number(priceRequest),
      },
    });

    return res.status(200).json({ message: "Book updated success" });
  } catch (error) {
    next(error);
  }
});

router.get("/allbooks", authProtect, async (req, res, next) => {
  try {
    const books = await prisma.book.findMany({
      where: {
        userId: Number(req.user.sub),
      },
    });
    return res.status(200).json(books);
  } catch (error) {
    next(error);
  }
});

router.delete("/delete/:id", authProtect, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sub, isAdmin } = req.user;

    const book = await prisma.book.delete({
      where: {
        id: Number(id),
        userId: Number(sub),
      },
    });

    return res.status(200).json({ message: "Book deleted success" });
  } catch (error) {
    next(error);
  }
});

router.get("/single/:id", authProtect, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sub, isAdmin } = req.user;

    const book = await prisma.book.findUnique({
      where: {
        id: Number(id),
        userId: Number(sub),
      },
      select: {
        title: true,
        author: true,
        description: true,
        priceRequest: true,
        id: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });
    return res.status(200).json({message: "Book fetched success", book});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
