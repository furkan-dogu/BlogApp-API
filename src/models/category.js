"use strict"

const { mongoose } = require("../configs/dbConnection")

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            set: function (name) {
                return name.charAt(0).toUpperCase() + name.slice(1);
            },
        }
    },
    {
        collection: "categories",
        timestamps: true
    }
)

module.exports = mongoose.model("Category", CategorySchema)