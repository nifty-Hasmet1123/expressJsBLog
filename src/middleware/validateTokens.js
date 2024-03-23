import jwt from "jsonwebtoken";

/**
 * Middleware function to authenticate requests using JWT token.
 * If no token is present in the request cookies, it renders an unauthorized view.
 * If the token is present but invalid, it also renders an unauthorized view.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
export default async function authMiddleware(req, res, next) {
    // Extract JWT token from request cookies
    const token = req.cookies.token;

    if (!token) {
        return res.render("unauthorized.ejs");
        // return res.status(401).json({ message: "Unauthorized" });
        // you can use res.render here instead to make a html view
    }

    try {  
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Set userId in request object based on decoded token
        req.userId = decoded.userId;

        // Call the next middleware function
        next();
    
    } catch (error) {
        // enter your html here
        // If token is invalid, render an unauthorized view
        res.render("unauthorized.ejs");
        // res.status(401).json({ message: "Unauthorized" });
    }
}
