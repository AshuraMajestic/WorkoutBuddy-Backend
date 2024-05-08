const mongoose = require('mongoose');
// const URL = process.env.DB_URL;
const URL = DB_URL = "mongodb+srv://Ashura:Ashura143@hello.rsvqrec.mongodb.net/?retryWrites=true&w=majority";
mongoose.set('strictQuery', false);

//  Creating a database
mongoose.connect(URL, {
    useUnifiedTopology: true
}).then(() => {
    console.log("Connection Created");
}).catch((err) => {
    console.log("Error: " + err);
});
