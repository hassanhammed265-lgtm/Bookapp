const express = require("express");
const router = express.Router();
const prisma = require("../helper/prisma");
const userSchema = require("../joischema/userSchema");
const argon = require("argon2");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const { sendWelBackEmail } = require("../services/mailService");

const jwt = require("jsonwebtoken");
const config = require("config");
const appSecret = config.get("appSecret");

router.post("/google", async (req, res, next) => {
  try {
    const { googleToken } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const googlePayload = ticket.getPayload();

    console.log(googlePayload);
    const { email } = googlePayload;

    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      // Create a new user if not found
      user = await prisma.user.create({
        data: {
          email,
          profile: {
            create: {},
          },
        },
      });
    }

    const payload = {
      sub: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    const jwtOptions = {
      expiresIn: "30d", //"1d", "20h", 24000
    };

    const token = jwt.sign(payload, appSecret, jwtOptions);

    return res.status(200).json({ access_token: token });

    // Continue with your logic here, e.g., find or create a user in your database
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const valResult = userSchema.userVal.validate(req.body, {
      abortEarly: false,
    });

    if (valResult.error) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (typeof user.password !== "string" || user.password.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const verifyPassword = await argon.verify(user.password, password);

    if (!verifyPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // try {
    //   await sendWelBackEmail(user.email);
    // } catch (error) {
    //   console.error("Failed to send welcome back email");
    // }
    const payload = {
      sub: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    const jwtOptions = {
      expiresIn: "30d", //"1d", "20h", 24000
    };

    const token = jwt.sign(payload, appSecret, jwtOptions);

    return res.status(200).json({ access_token: token });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
