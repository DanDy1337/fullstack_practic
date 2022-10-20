require("dotenv").config()
const fileName = require("../mainFunction")
const bcrypt = require("bcrypt")
const userDto = require("../dtos/user-dto")
const {body, validationResult} = require("express-validator");
const { findOneToken } = require("../mainFunction");

class routes {

    async registration(req, res) {  
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.end('введите корректное значение')
        }
        try {
            res.set({ 'content-type': 'text/plain; charset=utf-8' });
            if (req.body.login != undefined & req.body.email != undefined & req.body.password != undefined) {
                console.log(1)
                const candidate = await fileName.findOne(req.body.login, req.body.email)
                if (candidate) {
                    const hashPassword = await bcrypt.hash(req.body.password, 3)
 
                    const userDTO = new userDto({
                        'login': req.body.login,
                        'email': req.body.email
                    })

                    const tokens = await fileName.generateToken({ ...userDTO })
                    await res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

                    var user = await fileName.addNewUser(req.body.login, req.body.email, hashPassword)
                    console.log('пошёл процесс')
                    if (user) {
                        await fileName.saveToken(req.body.login, tokens.refreshToken)
                    }
                    res.json(
                        {
                            message: 'регистрация прошла успешно',
                            tokens: {
                                refreshToken: tokens.refreshToken,
                                accesToken: tokens.accessToken
                            },
                            info: {
                                userLogin: req.body.login
                            }
                        }
                    )
                }
                else {
                    res.end('регистрация нихуя не успешно прошла')
                }
            }
            else {
                res.end('Введите пожалуйста логин, имейл и пароль')
            }
        } catch (error) {
            console.log(error)
        }
    }

    async login(req, res){
        const [email, login, password] = [req.body.email,req.body.login, req.body.password]
        const user = await fileName.getUser(login, email)
        if(user[0] == undefined){
            res.json({message: 'Пользователь с таким имейл не найден'})
        }
        const isPassEquals = await bcrypt.compare(password, user[0].password)
        if(!isPassEquals){
            res.json({message: 'Не верный пароль'}) 
        }
        else{
            const userDTO = new userDto({ 
                'login': req.body.login, 
                'email': req.body.email
            }) 
    
            const tokens = await fileName.generateToken({...userDTO})
            await fileName.saveToken(login, tokens.refreshToken)
    
            await res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            res.json(
                {
                    message: 'Вход прошёл успешно',
                    tokens: {
                        refreshToken: tokens.refreshToken,
                        accesToken: tokens.accessToken
                    },
                    info: {
                        userLogin: req.body.login
                    }
                }
            )
        }
    }


    async logout(req, res){
        try {
            const {refreshToken} = req.cookies
            await fileName.logout(refreshToken)
            res.clearCookie('refreshToken')
            res.end('Успешно разлогинены')
        } catch (error){
            console.log(error)
        } 
    }

    async refresh(req, res){
        const {refreshToken} = req.cookies
        const tokensData = await fileName.validateRefreshToken(refreshToken)
        const results = await findOneToken(refreshToken)
        if(!tokensData || !results){ 
            res.end('вы не авторизованы')
        } 
        const userDTO = new userDto({
            'login': req.body.login, 
            'email': req.body.email
        }) 
    
        const tokens = await fileName.generateToken({...userDTO})
        await fileName.saveToken(login, tokens.refreshToken)
    }

    async getAllUsers(req, res){
        try {
            console.log(req.headers)
            const authHeader = req.headers.Authorization
            if(!authHeader){
                res.status(401).json('не авторизован')
            }
            const accesToken = authHeader.split(' ')[1]
            const checkUser = await fileName.checkUserRole(accesToken)
            if(checkUser){
                res.json('d')
            }
            else{
                res.status(401).json('не авторизован')
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new routes()