import jwt from "jsonwebtoken";

export default async function authMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.render("unauthorized.ejs");
        // return res.status(401).json({ message: "Unauthorized" });
        // you can use res.render here instead to make a html view
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.userId;
        next();
    
    } catch (error) {
        // enter your html here
        res.render("unauthorized.ejs");
        // res.status(401).json({ message: "Unauthorized" });
    }
}
