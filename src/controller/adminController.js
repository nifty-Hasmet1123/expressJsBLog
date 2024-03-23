import path from "path";
import bcrpyt from "bcrypt";
import jwt from "jsonwebtoken";
import Dao from "../mongoOperations/dao.js";

class AdminController extends Dao {
    static adminLayout = path.join(process.cwd(), "src/views/layouts/admin.ejs");
    static locals = {
        title: "Admin",
        description: "Simple Blog created with Nodejs, Express & MongoDB"
    };

    async renderAdminPage(req, res) {
        res.render("admin/index.ejs", {
            locals: AdminController.locals,
            layout: AdminController.adminLayout,
            currentRoute: "/admin"
        });
    }

    checkLogin = async (req, res) => {
        try {
            const { username, password } = req.body;

            const userData = await this.accessLogin(username);

            if (!userData) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const isPasswordValid = await bcrpyt.compare(password, userData.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign(
                { userId: userData._id },
                process.env.JWT_SECRET
            );
            // 1 day token
            // const maxAge = 24 * 60 * 60 * 1000; 

            // res.cookie("token", token, { httpOnly: true, maxAge: maxAge, secure: true});
            res.cookie("token", token, { httpOnly: true });
            res.redirect("/admin/dashboard");

        } catch (error) {
            console.error(error);
        }
    }

    registerAdminAccount = async (req, res) => {
        try {
            const { username, password } = req.body;
            const hashedPassword = await bcrpyt.hash(password, 10);
            const user = await this.registerOperation(username, hashedPassword);
                
            res.status(201).json({ 
                message: "User Created", 
                user: user.username 
            });

        } catch (error) {
            console.error(error);

            if (error.code === 11000) {
                res.status(409).json({ message: "User already exists" });
            } else {
                res.status(500).json({ message: "Internal Server Error" });
            }
        }
    }

    dashBoardView = async (req, res) => {
        const data = await this.fetchDashBoardDetails();
        
        if (data) {
            res.render("admin/dashboard.ejs", {
                locals: AdminController.locals,
                data: data,
                layout: AdminController.adminLayout
            });
        } 
    }

    getPost = async (req, res) => {
        try {
            const data = await this.fetchDashBoardDetails();

            if (data) {
                res.render("admin/add-post.ejs", {
                        locals: { title: "Add Post", description: AdminController.locals.description },
                        data: data,
                        layout: AdminController.adminLayout
                    }
                )
            }

        } catch (error) {
            console.error(error);
        }
    }

    addPost = async (req, res) => {
        try {
            const isTrue = await this.createNewPost(req.body);
            
            if (isTrue) {
                res.redirect("/admin/dashboard");
            } else {
                res.status(400).json({ message: "Bad Request" });
            }
            
        } catch (error) {
            console.error(error);
        }
    }

    fetchBlogById = async (req, res) => {
        const data = await this.fetchUserById(req.params.id);

        if (data) {
            res.render("admin/edit-post.ejs", {
                locals: { title: "Edit Post", description: "Free Nodejs User Management System" },
                data: data,
                layout: AdminController.adminLayout
            })

        }
    }

    updatePost = async (req, res) => {
        try {
            const id = req.params.id;

            const isTrue = await this.updateThePost(id, req.body);

            if (isTrue) {
                res.redirect(`/admin/edit-post/${id}`);
            }

        } catch (error) {
            console.error(error);
        }
    }

    deletePost = async (req, res) => {
        const isDeleted = await this.deletePostFromDb(req.params.id);

        if (isDeleted) {
            res.redirect("/admin/dashboard");
        }
    }

    logout = async (req, res) => {
        res.clearCookie("token");
        // res.json({ message: "Logout Successful" });

        res.redirect("/home");
    }
}

export default AdminController;