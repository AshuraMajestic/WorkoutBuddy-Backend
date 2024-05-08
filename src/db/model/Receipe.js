const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    "dish_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    "dish_name": String,
    "calories": Number,
    "macronutrients": {
        "carbohydrates": Number,
        "proteins": Number,
        "fats": {
            "total": Number,
            "saturated": Number,
            "unsaturated": Number,
            "trans": Number
        }
    },
    "micronutrients": {
        "vitamins": {
            "A": Number,
            "C": Number,
            "D": Number,
            "E": Number,
            "K": Number,
            "B12": Number,
            "B6": Number

        },
        "minerals": {
            "calcium": Number,
            "iron": Number,
            "potassium": Number,
            "magnesium": Number,
            "sodium": Number,
            "zinc": Number

        }
    },
    "ingredients": [String],
    "allergens": [String],
    "preparation_instructions": String,
    "serving_size": String
});
const Dishes = new mongoose.model("dish", recipeSchema);
module.exports = Dishes;