import { Router } from "express";
import AdminController from "../../controller/adminController.js";
import authMiddleware from "../../middleware/validateTokens.js";
import noCache from "../../middleware/noCache.js";

const router = new Router();
const adminController = new AdminController();

// apply the noCache middleware here to avoid the back button to rendering the cache files of the previous views
router.use(noCache);

/**
 * GET /
 * ADMIN - Login Page
 * 
 */
router.get(
    "/",
    adminController.renderAdminPage
);

/**
 * POST /
 * ADMIN - Check Login
 * 
 */
router.post(
    "/",
    adminController.checkLogin
);

/**
 * POST /
 * ADMIN - Register
 */
router.post(
    "/register",
    adminController.registerAdminAccount
);

/**
 * GET /
 * ADMIN - Dashboard
 */
router.get(
    "/dashboard",
    authMiddleware,
    adminController.dashBoardView
)

/**
 * GET /
 * ADMIN - Fetch Post Api
 */
router.get(
    "/add-post",
    authMiddleware,
    adminController.getPost
)

/**
 * POST /
 * ADMIN - Create New Post
 */
router.post(
    "/add-post",
    authMiddleware,
    adminController.addPost
)

/**
 * GET /
 * ADMIN - Create Post
 */
router.get(
    "/edit-post/:id",
    authMiddleware,
    adminController.fetchBlogById
)

/**
 * PUT /
 * ADMIN - Update New Post
 */
router.put(
    "/edit-post/:id",
    authMiddleware,
    adminController.updatePost
)

/**
 * DELETE
 * ADMIN - DELETE POST
 */
router.delete(
    "/delete-post/:id",
    authMiddleware,
    adminController.deletePost
)

/**
 * GET
 * ADMIN - LOGOUT
 */
router.get(
    "/logout",
    adminController.logout
)



export {
    router
}