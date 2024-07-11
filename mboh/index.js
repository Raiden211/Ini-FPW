const express = require('express')
const app = express()
const port = 3000
const wiki = require("./src/routes/route");
const { connectToDb } = require("./src/config/config"); // Assuming connectToDb is a function to establish MongoDB connection

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", wiki);

const init = async () => {
    console.log("Connecting to database");
    try {
        await connectToDb(); // Connect to the MongoDB database
        console.log("Successfully connected to the database");
        app.listen(port, () => {
            console.log(`Application is running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
};

init();