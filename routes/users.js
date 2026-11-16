const express = require("express");
const router = express.Router();
const prisma = require("../helper/prisma");
const userSchema = require("../joischema/userSchema");
const argon = require("argon2");

const authProtect = require("../middleware/auth");
const adminProtect = require("../middleware/authAdmin");

router.put("/update", (req, res) => {
  return res.status(200).json({ message: "Products fetched success" });
});

router.delete("/delete", (req, res) => {
  return res.status(200).json({ message: "Products fetched success" });
});

router.post("/register", async (req, res, next) => {
  try {
    console.log(req.body);
    //comparing req body with joi schema
    const valResult = userSchema.userVal.validate(req.body, {
      abortEarly: false,
    });

    //comparing password with joi password complexity
    const pwsResult = userSchema.pwdVal.validate(req.body.password);

    if (valResult.error) {
      return res.status(400).send(valResult.error.details);
    }

    if (pwsResult.error) {
      return res.status(400).send(pwsResult.error.details);
    }

    const { email, password } = req.body;

    //check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email.trim().toLowerCase(),
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already registered" });
    }

    const hashedPassword = await argon.hash(password);

    const newUser = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        password: hashedPassword,
      },
    });

    if (newUser) {
      const userProfile = await prisma.profile.create({
        data: {
          userId: newUser.id,
        },
      });

      return res.status(201).json({ message: "User registered successfully" });
    }

    return res.status(400).json({ message: "User not registered" });
  } catch (error) {
    next(error);
  }
});

router.get("/all",[authProtect, adminProtect], async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        isAdmin: true, 
        profile: {
          select: {
            fullName: true,
            bio: true,
          }
        },

        books  :{
          select: {
            title: true,
            description: true,
            priceRequest: true,
            author: true,
            id: true,
            category: {
              select: {
                name: true,
              }
            }
          }
        }
      }



    });
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

router.put("/update/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        password: password,
      },
    });
    return res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

router.delete("/delete/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const deletedUser = await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });
    return res.status(200).json(deletedUser);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
});
module.exports = router;
