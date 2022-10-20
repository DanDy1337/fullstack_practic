const MySQL = require("mysql2")
const jwt = require("jsonwebtoken")
const jwtDecode = require("jwt-decode")

database = MySQL.createConnection({
    host: "localhost",
    user: "root",
    database: "forum_chan",
    password: "root"
}); 

class mainFunction {

    database = database

    async findOne(login, email) {
        try {
            return new Promise((resolve, reject) => {
                database.query(`SELECT * FROM user WHERE login=${"'"+login+"'"} OR email=${"'"+email+"'"}`,
                    async function (err, results, fields) {
                        const rer = results
                        console.log(rer) 
                        if(rer != undefined){
                            if(rer[0] == undefined){
                                console.log('sss')
                                resolve(true)
                            }
                            else{
                                resolve(false)
                            }
                        }
                        else{
                            resolve(false)
                        }
                       
                    }
                )
            })
        }catch (error) {
            console.log(error)
        }  
    }

    async addNewUser(login, email, password){
        try {
            console.log('процессик пошёл')
            return new Promise((resolve, reject) => {
                database.query(`INSERT INTO user(login, email, password, role) 
                    VALUES(
                        ${"'"+login+"'"}, 
                        ${"'"+email+"'"},
                        ${"'"+password+"'"},
                        'user'
                    )`
                )
                resolve(true)
            })
        } catch (error) {
            console.log(error)
        }
        
    }

    async findOneLogin(login){
        try {
            return new Promise((resolve, reject) => {
                database.query(`SELECT * FROM user WHERE login=${"'"+login+"'"}`, 
                    async function(err, results, fields){
                        var rer = results
                        if(rer != undefined){
                            resolve(true)
                        }
                        else{
                            resolve(false)
                        }
                    }
                )
            })
        } catch (error) {
            console.log(error)
        }
        
    }

    async generateToken(payload){
        const accessToken = jwt.sign(payload, ''+process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, ''+process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return { 
            accessToken,
            refreshToken
        }
    }

    async saveToken(userLogin, refreshToken){
        const tokenData = await this.findOneLogin(userLogin)
        try {
            if(tokenData){ 
                const specialString = "UPDATE `user` SET `refresh-token` =" + `'${refreshToken}'` + " WHERE `user`.`login` =" + ` '${userLogin}'`
                database.query(specialString) 
                return true
            }
            else{
                console.log('пользователя с таким айди нет')
                return false
            }
        } catch (error) {
            console.log(error)
        }
      
    }

    async getUser(login, email){
        return new Promise((resolve, reject) => {
            database.query(`SELECT * FROM user WHERE login=${"'"+login+"'"} AND email=${"'"+email+"'"}`, 
                async function(err, results, fields){
                    resolve(results)
                }
            )
        })
    }

    async logout(refreshToken){
        const getId = async function(refreshToken1){
            return new Promise((resolve, reject) => {
                database.query("SELECT `id` FROM `user` WHERE `refresh-token`=" + "'"+refreshToken1+"'",
                    async function(err, results, fields){
                        console.log(results, 454)
                        resolve(results[0].id)
                    }
                ) 
            })
        }
        const deleteToken = async function(tokenData){
            return new Promise((resolve, reject) => {
                database.query("UPDATE `user` SET `refresh-token` = 0 WHERE `user`.`id` = " + tokenData,
                    async function(err, results, fields){
                        resolve(true)
                    }
                )
            }) 
        }
        const tokensId = await getId(refreshToken)
        await deleteToken(tokensId)
        return true
    }

    async validateAccessToken(token){
        try {
            const userData = jwt.verify(token, ''+process.env.JWT_ACCESS_SECRET)
            return true
        } catch (error) {
            return false
        }
    }

    async validateRefreshToken(token){
        try {
            const userData = jwt.verify(token, ''+process.env.JWT_REFRESH_SECRET)
            return true
        } catch (error) {
            return false
        }
    }

    async refresh(refreshToken){
        if(!refreshToken){
            return false
        }
    }

    async findOneToken(token){
        return new Promise((resolve, reject) => {
            database.query(`SELECT * FROM user WHERE refresh-token=${"'"+token+"'"}`, 
                async function(err, results, fields){
                    var rer = results
                    if(rer != undefined){
                        resolve(true)
                    }
                    else{
                        resolve(null)
                    }
                }
            )
        })
    }

    async checkUserRole(token){
        const validator = await this.validateAccesToken(token)
        if(validator){
            const accesToken = await jwtDecode(token)
            const resultQuery = await new Promise((resolve, reject) => {
                database.query(`SELECT * FROM user WHERE login=${"'"+accesToken.login+"'"}`, 
                    async function(err, results, fields){
                        if(results != undefined){
                            resolve(results[0])
                        }
                        else(
                            resolve([])
                        )
                    }
                )
            }) 
            console.log(resultQuery)
            if(resultQuery.role == 'admin'){
                return true
            }
            else{
                return false
            }
        }
        else{
            return false
        }
        
    } 

    print(value) { 
        console.log(value)
    }
     
}

module.exports = new mainFunction() 