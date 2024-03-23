import { Router } from "express";
import { MainController } from "../../controller/controller.js";
import noCache from "../../middleware/noCache.js";

const router = new Router();
const mainController = new MainController();


// apply the noCache middleware here to avoid the back button to rendering the cache files of the previous views
router.use(noCache);

/**
 * GET /
 * HOME
 */
router.get(
    "/home",
    mainController.renderSite
);

/**
 * GET /
 * Post: id
 */
router.get(
    "/post/:id",
    mainController.getByLink
)

/**
 * GET /
 * ABOUT
 */
router.get(
    "/about",
    mainController.aboutPage
)

/**
 * GET /
 * CONTACT
 */

router.get(
    "/contact",
    mainController.contactPage
)

/**
 * POST /
 * post search item
 */
router.post(
    "/search",
    mainController.postFormInput
)

export {
    router
}