"use strict";

const Blog = require("../models/blog");
const requestIp = require("../middlewares/requestIp")

module.exports = {
    list: async (req, res) => {
        /*
            #swagger.tags = ["Blogs"]
            #swagger.summary = "List Blogs"
            #swagger.description = `
                You can use <u>filter[] & search[] & sort[] & page & limit</u> queries with endpoint.
                <ul> Examples:
                    <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=asc&sort[field2]=desc</b></li>
                    <li>URL/?<b>limit=10&page=1</b></li>
                </ul>
            `
        */

        if (req.query.author) {
            const data = await Blog.find({ userId: req.query.author });
        
            res.status(200).send({
                error: false,
                details: await res.getModelListDetails(Blog, {
                    userId: req.query.author,
                }),
                data,
            });
        } else {
            const data = await res.getModelList(Blog, { isPublish: true }, [
                "categoryId",
                "userId",
                { path: "comments", populate: "userId" },
        ]);

        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Blog, { isPublish: true }),
            data,
        });
        }
    },
    
    create: async (req, res) => {
        /*
            #swagger.tags = ["Blogs"]
            #swagger.summary = "Create Blog"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "categoryId": "65343222b67e9681f937f101",
                    "title": "Blog Title 1",
                    "content": "Blog Content 1",
                    "image": "http://imageURL",
                    "isPublish": true
                }
            }
        */
    
        const userId = req.user.id;
        req.body.userId = userId;
    
        const data = await Blog.create(req.body);
    
        res.status(201).send({
            error: false,
            data,
        });
    },

    read: async (req, res) => {
        /*
            #swagger.tags = ["Blogs"]
            #swagger.summary = "Get Single Blog"
        */
    
        const ip = req.clientIp;
    
        const data = await Blog.findOneAndUpdate(
            { _id: req.params.id },
            { $addToSet: { visitors: ip } }, //!unique count
            { new: true }
        ).populate([{ path: "comments", populate: "userId" }, "userId"]);
    
        res.status(200).send({
            error: false,
            data,
        });
    },

    update: async (req, res) => {
        /*
            #swagger.tags = ["Blogs"]
            #swagger.summary = "Update Blog"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "name": "Blog 1"
                }
            }
        */

        const data = await Blog.updateOne({ _id: req.params.id }, req.body, { runValidators: true });
    
        res.status(202).send({
            error: false,
            data,
            newDAta: await Blog.findOne({ _id: req.params.id }),
        });
    },

    delete: async (req, res) => {
        /*
            #swagger.tags = ["Blogs"]
            #swagger.summary = "Delete Blog"
        */
    
        const data = await Blog.deleteOne({ _id: req.params.id });
    
        res.status(data.deletedCount ? 204 : 404).send({
            error: !data.deletedCount,
            data,
        });
    },

    getLike: async (req, res) => {
        /*
            #swagger.tags = ["Blogs"]
            #swagger.summary = "Get Like Info"
        */

        const blog = await Blog.findOne({ _id: req.params.id });
    
        res.status(200).send({
            error: false,
            didUserLike: false,
            countOfLikes: blog.likes.length,
            likes: blog.likes,
        });
    },

    postLike: async (req, res) => {
        /*
            #swagger.tags = ["Blogs"]
            #swagger.summary = "Add/Remove Like"
        */
    
        const blog = await Blog.findOne({ _id: req.params.id });
        const didUserLike = blog.likes.includes(req.user.id);
    
        if (!didUserLike) {
            blog.likes.push(req.user.id);
            await blog.save();
    
            res.status(200).send({
                error: false,
                didUserLike: true,
                countOfLikes: blog.likes.length,
                likes: blog.likes,
            });
        } else {
            const likeUserId = blog.likes.find((item) => item == req.user.id);
            blog.likes.remove(likeUserId);
            await blog.save();
    
            res.status(200).send({
                error: false,
                didUserLike: false,
                countOfLikes: blog.likes.length,
                likes: blog.likes,
            });
        }
    }
}