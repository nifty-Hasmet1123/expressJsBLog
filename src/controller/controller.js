import Dao from "../mongoOperations/dao.js";

/**
 * Represents a controller for handling main site operations.
 * Extends Dao class for database operations.
 */

class MainController extends Dao {
    // Default local variables for site views
    static locals = {
        title: "NodeJs Blog",
        description: "Simple Blog created with Nodejs, Express & MongoDB."
    };
    
    /**
     * Renders the main site page with pagination.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>}
     */
    renderSite = async (req, res) => {
        let perPage = 10;
        let page = req.query.page || 1;

        const details = await this.viewPageWithPagination(perPage, page);

        if (details instanceof Array && details.length !== 0) {
            const [ data, nextPage, hasNextPage ] = details;
           
            res.render("index.ejs", { 
                locals: MainController.locals, 
                data: data,
                current: page,
                nextPage: hasNextPage ? nextPage : null,
                currentRoute: "/home"
            });

        } else {
            console.error("Unexpected result: ", details);
        }
    }

     /**
     * Renders the contact page.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>}
     */
    async contactPage(req, res) {
        const data = {
            name: "Maximo Ignacio",
            contact: "+63 9972287803"
        };

        res.render("contact.ejs", {
            data: data
        });
    }
    
    /**
     * Retrieves a post by its link slug and renders it.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>}
     */
    getByLink = async (req, res) => {
        let slug = req.params.id;

        const data = await this.findId(slug);

        if (data !== null) {
            res.render("post.ejs", {
                locals: {
                    title: data?.title ?? MainController.locals.title,
                    description: data?.body ?? MainController.locals.description
                },
                data: data,
                currentRoute: `/post/${slug}`
            })
        
        } else {
            console.error("Unexpected result: ", data);
        }
    }

    /**
     * Renders the about page.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>}
     */
    aboutPage = async (req, res) => {
        res.render("about.ejs", {
            currentRoute: "/about"
        })
    }

    /**
     * Retrieves data based on user input from the post form and renders search results.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>}
     */
    postFormInput = async (req, res) => {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");
        const data = await this.findSearchInput(searchNoSpecialChar);
        
        if (data !== null) {
            res.render("search.ejs", {
                locals: {
                    title: data?.title,
                    description: data?.description
                },
                data: data,
                currentRoute: "/search"
            })
        } else {
            console.error("Unexpected result: ", data);
        }
    }
}

export {
    MainController
}