require("dotenv").config()
const express = require("express");
const cookie = require("cookie-parser")
const cors = require("cors")
const {body} = require("express-validator");
const routes = require("./routes/routes")
const fileName = require("./mainFunction") 

const PORT = process.env.PORT || 3003
const app = express();

// app.use(cors());  
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.header('Access-Control-Allow-Credentials', true)
    next()
})   
app.use(express.json())
app.use(cookie())

app.get("/", async function(req, res){
    res.end('ron')
});      
app.post("/registration", 
    body('email').isEmail(),  
    body('password').isLength({min: 3, max: 32}),
    routes.registration 
)  
app.post("/login", routes.login)
app.post("/logout", routes.logout)
app.post("/refresh", routes.refresh)
app.get("/get-all-users", routes.getAllUsers)
 
const launch = async () => {
    try {
        fileName.database.connect(function(err){
            if (err) {
              return console.error("Ошибка: " + err.message);
            }
            else{
              console.log("Подключение к серверу MySQL успешно установлено");
            }
        }); 
        app.listen(PORT, () => console.log(`сервер воркает на порту ${PORT}`)) 
    }catch(err) {
        console.log(err)
    }  
} 

launch()