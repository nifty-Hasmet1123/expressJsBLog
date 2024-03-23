import Post from "../server/models/Post.js";
import User from "../server/models/User.js";

class Dao {
    /**
     * fetch all the data on the post
     * @returns An array of datas
     */
    async viewPageWithPagination(perPage, page) {
        try {
            const data = await Post.aggregate([{$sort: { createdAt: -1 }}]) // sorting documents by createdAt field in descending order
                                .skip(perPage * page - perPage) // skipping documents based on pagination parameters
                                .limit(perPage) // limiting the number of documents per page
                                .exec(); // executing the aggregation query
            
            const count = await Post.countDocuments();
            const nextPage = parseInt(page) + 1;
            const hasNextPage = nextPage <= Math.ceil(count / perPage);

            return [ data, nextPage, hasNextPage ];
            
        } catch (error) {
            console.error(error);
        }
    }

    async findId(slug) {
        try {
            const data = await Post.findById(slug);

            return data;
        } catch (error) {
            console.error(error);
        }
    }

    async findSearchInput(searchNoSpecialChar) {
        try {
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

    // User.js mongoose model here
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

    async deletePostFromDb(id) {
        try {
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