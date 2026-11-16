const config = require("config");
const express = require('express');
const app = express();
const cors = require("cors");
const port = config.get("PORT") || 9000;
const frontendUrl = config.get("frontendUrl");
const path = require("path");
app.use(cors(frontendUrl));


console.log(config.get("Appname"));


//body parser
app.use(express.json());

app.use("/public", express.static(path.join(__dirname, "public")));


//import files
const categories = require("./routes/categories");
const users = require("./routes/users");
const product = require("./routes/product");
const error = require("./middleware/error");
const authRoute = require("./routes/auth")
const profile = require("./routes/profile")
const book = require("./routes/book")



//api routes
app.use("/categories",categories);
app.use("/users",users);
app.use("/products",product);
app.use("/auth",authRoute);
app.use("/profile",profile);
app.use("/book",book);


app.use(error);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));