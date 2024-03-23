import Post from "../server/models/Post.js";
import User from "../server/models/User.js";

/**
 * Data Access Object (DAO) class for handling database operations.
 * Provides methods for performing CRUD operations on the database.
 */
class Dao {
    /**
     * Retrieves a page of posts with pagination.
     * @param {number} perPage - The number of posts per page.
     * @param {number} page - The page number to retrieve.
     * @returns {Promise<Array>} An array containing data for the current page, 
     *                           the number of the next page, and whether there's a next page.
     */
    async viewPageWithPagination(perPage, page) {
        try {
            // Retrieve posts with pagination
            const data = await Post.aggregate([{$sort: { createdAt: -1 }}]) // sorting documents by createdAt field in descending order
                                .skip(perPage * page - perPage) // skipping documents based on pagination parameters
                                .limit(perPage) // limiting the number of documents per page
                                .exec(); // executing the aggregation query
            
            // Count total number of posts                    
            const count = await Post.countDocuments();

            // Calculate next page number and whether there's a next page
            const nextPage = parseInt(page) + 1;
            const hasNextPage = nextPage <= Math.ceil(count / perPage);

            return [ data, nextPage, hasNextPage ];
            
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Finds a post by its ID (slug).
     * @param {string} slug - The ID of the post to find.
     * @returns {Promise<Object|null>} The post object if found, otherwise null.
     */
    async findId(slug) {
        try {
             // Find post by ID
            const data = await Post.findById(slug);

            return data;
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Finds posts based on a search input.
     * @param {string} searchNoSpecialChar - The search term to match against post titles and bodies.
     * @returns {Promise<Array>} An array of posts matching the search term.
     */
    async findSearchInput(searchNoSpecialChar) {
        try {
            // Find posts matching search term
            const data = await Post.find({
                $or: [
                    { title: { $regex: new RegExp(searchNoSpecialChar, "i") }}, // flag "i" meaning case-insensitive
                    { body: { $regex: new RegExp(searchNoSpecialChar, "i") }},
                ]
            });

            return data;
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Registers a new user in the database.
     * User.js mongoose model here
     * @param {string} username - The username of the user.
     * @param {string} bcryptPassword - The bcrypt-hashed password of the user.
     * @returns {Promise<Object>} The newly created user object.
     * @throws {Error} If username or password is missing.
     */
    async registerOperation(username, bcryptPassword) {
        try {
            if (username && bcryptPassword) {
                return await User.create({
                    username: username,
                    password: bcryptPassword
                });
            } else {
                throw new Error("Username or password is missing");
            }
        
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    // checklogin
    async accessLogin(username) {
        try {
            const user = await User.findOne({ username });
            
            return user;
            
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }

    async fetchDashBoardDetails() {
        try {
            const data = await Post.find();

            return data;
        } catch (error) {
            console.error(error);
        }
    }

    async createNewPost(requestBody) {
        try {
            const newPost = new Post({
                title: requestBody?.title,
                body: requestBody?.body
            });

            await Post.create(newPost);

            return true;
        } catch (error) {
            console.error(error);
        }
    }

    async fetchUserById(id) {
        try {
            const data = await Post.findById({ _id: id });

            return data;
            
        } catch (error) {
            console.error(error);
        }
    }
    /**
     * Updates the Post
     * 
     * @param {string} id - the current _id
     * @param {object} requestBody - the req.body object
     * @returns {boolean}
     */
    async updateThePost(id, requestBody) {
        try {
            await Post.findByIdAndUpdate(id, {
                title: requestBody?.title,
                body: requestBody?.body,
                updatedAt: Date.now()
            });

            return true;
        
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Deletes a post from the database by its ID.
     * @param {string} id - The ID of the post to delete.
     * @returns {Promise<boolean>} True if the post is deleted successfully, otherwise false.
     */
    async deletePostFromDb(id) {
        try {
            // Delete post by ID
            await Post.deleteOne({_id: id});

            return true;
        } catch (error) {
            console.error(error);
        }
        
    }
}

export default Dao;

// insertPostData() {
    //     Post.insertMany([
    //         {
    //             title: "Building a blog",
    //             body: "This is the body text"
    //         },
    //         {
    //             title: "Deployment of Node.js application",
    //             body: "Understand the different ways to deploy Node.js application."
    //         },
    //         {
    //             title: "Authentication and Authorization in Node.js",
    //             body: "Learn how to add authentication and authorization to your Node.js"
    //         }
    //     ])
    // }