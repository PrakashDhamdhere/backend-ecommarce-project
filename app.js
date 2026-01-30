require('dotenv').config()
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const path = require('path')
const db = require('./config/mongoose-connection')
const ownersRouter = require("./routes/ownersRouter")
const usersRouter = require("./routes/usersRouter")
const productsRouter = require("./routes/productsRouter")
const index = require("./routes/index")
let expressSession = require('express-session')
let flash = require('connect-flash')

app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
}))
app.use(flash())


app.use("/", index)
app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);


app.listen(process.env.PORT);