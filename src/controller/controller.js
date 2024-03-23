import Dao from "../mongoOperations/dao.js";

class MainController extends Dao {
    static locals = {
        title: "NodeJs Blog",
        description: "Simple Blog created with Nodejs, Express & MongoDB."
    };
     
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

    async contactPage(req, res) {
        const data = {
            name: "Maximo Ignacio",
            contact: "+63 9972287803"
        };

        res.render("contact.ejs", {
            data: data
        });
    }
    
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

    aboutPage = async (req, res) => {
        res.render("about.ejs", {
            currentRoute: "/about"
        })
    }

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