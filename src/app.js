import dotenv from "dotenv";
import connectDb from "./server/config/db.js";
import cookieParser from "cookie-parser";
import methodOverride from "method-override"; // this is use when you want to use put and delete http method on a html form tags because html only support GET AND POST method request.
import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import MongoStore from "connect-mongo";
import session from "express-session";
import isActiveRoute from "./server/helpers/routeHelpers.js";
import path from "path";

import { router } from "./server/routes/main.js";
import { router as adminRouter } from "./server/routes/admin.js";
dotenv.config();

// initial configuration
const app = express();
const port = process.env.PORT || 5002;
const rootDirectory = process.cwd();

// mongodb connection
connectDb();

// to pass data from the forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// cookie parser middleware
app.use(cookieParser());

// sessions
app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    cookie: { maxAge: new Date(Date.now() + (36000000)), sameSite: "Strict" }
}))

// public middleware
app.use(express.static(path.join(rootDirectory, "/src/public")));

// Template Engine middleware
app.use(expressEjsLayouts);
app.set("layout", path.join(rootDirectory, "/src/views/layouts/main.ejs"));
app.set("view engine", "ejs");
app.set("views", path.join(rootDirectory, "/src/views"));



// global variable and middleware for isActiveRoute
app.locals.isActiveRoute = isActiveRoute;

// use routes now here
app.use("/", router);
app.use("/admin", adminRouter);

app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`);
})

// cookie: { 
//     maxAge: new Date(Date.now() + (36000000)), // Expires in 10 hours
//     httpOnly: true,
//     secure: true, // Only transmitted over HTTPS
//     sameSite: 'Strict' // Prevents CSRF attacks
// }