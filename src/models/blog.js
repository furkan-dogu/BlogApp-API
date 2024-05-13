"use strict"

const { mongoose } = require("../configs/dbConnection")

const BlogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
    
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
    
        title: {
            type: String,
            trim: true,
            required: true,
        },
    
        content: {
            type: String,
            trim: true,
            required: true,
        },
    
        image: {
            type: String,
                trim: true,
                validate: {
                    validator: function (img) {
                        return /(https?:\/\/.*\.(?:png|jpg))/i.test(img);
                    },
                    message: (props) => `${props.value} is not a valid image url!`,
                },
        },
    
        isPublish: {
            type: Boolean,
            default: true,
        },
    
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
    
        visitors: [],

        countOfVisitors: {
            type: Number,
            get: function () {
                return this.visitors.length;
            },
        }
    },
    {
        collection: "blogs",
        timestamps: true,
        toJSON: { getters: true }
    }
)

module.exports = mongoose.model("Blog", BlogSchema)