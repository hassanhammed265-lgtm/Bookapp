const express = require("express");
const router = express.Router();
const prisma = require("../helper/prisma");

const authProtect = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

//Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/avater"); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    // Use a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // Get file extension
    cb(null, file.fieldname + "-" + uniqueSuffix + ext); // Appendextension;
  },
});
const upload = multer({ storage: storage });


router.post(
  "/upload",
  [authProtect],
  upload.single("image"), // Specify the field name for the uploaded file and it should be same as key in postman
  async (req, res, next) => {
    console.log("running");
    console.log(req.file);

    try {
      const { destination, filename } = req.file;
      const profile = await prisma.profile.update({
        where: {
          userId: Number(req.user.sub),
        },
        data: {
          avatar: `${destination}/${filename}`,
        },
      });
      // Access uploaded file information through req.file
      return res.json({ message: "File uploaded successfully" });
    } catch (error) {
      next(error);
    }
  },
);


router.put("/update", authProtect, async (req, res, next) => {
    try {
        const {fullName} = req.body;
        const {sub, isAdmin} = req.user;

        console.log(sub)


        const profile = await prisma.profile.update({
            where: {
                userId: Number(sub),
            },
            data: {
                fullName
            }
        });

        return res.status(201).json({ message: "Profile updated successfully" });   
    } catch (error) {
        next(error);
    }
});

router.get("/single", authProtect, async (req, res, next) => {
    try {
        const {sub, isAdmin} = req.user;

        const profile = await prisma.profile.findFirst({
            where: {
                userId: Number(sub)
            }
        });

    const profileImageUrl = `${req.protocol}://${req.get('host')}/${
        profile.avatar
    }`;

        return res.status(200).json({message: "Profile fetched successfully", profile});
    } catch (error) {
        next(error);
    }
});

module.exports = router;