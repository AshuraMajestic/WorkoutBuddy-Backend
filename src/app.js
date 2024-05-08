const express = require('express');
const cors = require('cors');
require('./db/conn');
const Register = require("./db/model/info");
const receipe = require("./db/model/Receipe")
const message = require("./db/model/UserMessage")
const app = express();
const port = process.env.PORT || 5000;
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const jwtKey = 'OnePiece';


// Set up CORS
app.use(cors());

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.options('*', cors());


//Register
app.post("/register", async (req, res) => {
    try {
        let user = new Register(req.body);
        let result = await user.save();
        result = result.toObject();
        delete result.password;
        jwt.sign({ result }, jwtKey, { expiresIn: "24h" }, (err, token) => {
            if (err) {
                res.send({ result: 'Something went wrong' });
            }
            res.send({ result, token: token });
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post('/login', async (req, res) => {
    if (req.body.email && req.body.password) {

        let user = await Register.findOne(req.body).select("-password");

        if (user) {
            jwt.sign({ user }, jwtKey, { expiresIn: "24h" }, (err, token) => {
                if (err) {
                    res.send({ result: 'Something went wrong' });
                }
                res.send({ user, token: token });
            })
        } else {
            res.send({ result: 'no user found' });
        }
    }
    else {
        res.send({ result: 'Please fill all fields' });
    }
});


app.post("/contact", async (req, res) => {
    try {
        let user = new message(req.body);
        let result = await user.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.post('/findDishes', tokenAuthorization, async (req, res) => {
    const { height, weight, gender, age } = req.body;

    // Convert age to number
    const ageNum = parseInt(age);

    // Calculate daily calories based on Basal Metabolic Rate (BMR)
    const dailyCalories = calculateCalories(height, weight, gender, ageNum);


    try {
        // Find dishes in the recipe collection
        const allDishes = await receipe.find();

        // Define age-based calorie ranges
        let minCalories, maxCalories;
        if (ageNum <= 18) {
            minCalories = dailyCalories * 0.8;
            maxCalories = dailyCalories * 1.2;
        } else if (ageNum <= 30) {
            minCalories = dailyCalories * 0.9;
            maxCalories = dailyCalories * 1.1;
        } else {
            minCalories = dailyCalories * 0.95;
            maxCalories = dailyCalories * 1.05;
        }

        // Filter dishes within the calorie range
        const filteredDishes = allDishes.filter(dish => {
            var total = dish.calories;
            return total >= minCalories && total <= maxCalories;
        });

        res.json(filteredDishes);
    } catch (error) {
        console.error("Error finding dishes:", error);
        res.status(500).json({ error: "An error occurred while finding dishes" });
    }
});
function calculateCalories(height, weight, gender, age) {

    let bmr = 0;
    if (gender === 'M') {
        bmr = (10 * weight + 6.25 * height - 5 * age + 5) % 700;
    } else if (gender === 'F') {
        bmr = (10 * weight + 6.25 * height - 5 * age - 161) % 700;
    }
    return bmr;
}



// Token Authorization
function tokenAuthorization(req, res, next) {
    let token = req.headers['authorization'];
    if (token) {
        jwt.verify(token, jwtKey, (err, valid) => {
            if (err) {
                res.status(401).send({ result: "Please Provide valid token" })
            } else {
                next();
            }
        })
    } else {
        res.status(403).send("Please add token with header")
    }
}


// Start the server
app.listen(port, () => {
    console.log("Listening on port " + port);
});