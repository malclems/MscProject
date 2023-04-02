// Import required packages
require("dotenv").config(); // allows the use of environment variables
const express = require("express"); // web framework for Node.js
const mongoose = require("mongoose"); // MongoDB object modeling tool designed to work in an asynchronous environment
const session = require("express-session"); // middleware for creating a session middleware
//const middleware = require("express-middleware"); // package for express middleware

// Initialize express app and set up port to listen to
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB database
mongoose.connect(process.env.DB_URI,{useNewUrlParser:true, useUnifiedTopology:true});
const db = mongoose.connection;

// Check if there is an error in the connection
db.on('error',(error)=>console.log(console.error(error)));

// Display success message if the connection was successful
db.once('open',()=>console.log("connected to the database"));

// Import and use middlewares
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(session({
secret: "this is my secret key", // set the secret key for the session
saveUninitialized: true, // save uninitialized sessions
resave:false // do not resave sessions
}))

// Set up a middleware for displaying messages
app.use((req,res,next)=>{
res.locals.message = req.session.message;
delete req.session.message;
next();
})

// Set up the view engine to be used
app.set("view engine","ejs");

// Set up routes
app.use("",require ('./routes/routes'))

// Start the server
app.listen(PORT,()=>{
console.log(` is listening on PORT http://localhost:${PORT}`)
})

// The above code initializes the server, sets up middleware for handling incoming requests, sets up the view engine, connects to a MongoDB database, and sets up routes for the server to handle.