const express = require('express')
const app = express()
const router = express.Router();
const func = require("./function");
const db = require("./config");
const port = 3000;
const cors = require('cors');
app.use(cors());

app.post("/games/post",func.cobaAdd);
app.put("/games/edit",func.cobaEdit);
app.delete("/games/delete",func.cobaDelete);
app.get("/games/get",func.getAllGames);
app.get("/games/get1",func.getOneGames);

app.listen(port, () => console.log(`Running on port ${port}!`));