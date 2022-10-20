import { useEffect, useState } from 'react';
import './index.css'
import cookie from 'js-cookie';
import axios from "axios"
// import { useDispatch, useSelector } from "react-redux";

export default function Login( proops ){
    const [data, setData] = useState()

    const sendData = async (url) => {
        const dataLog = document.getElementById('dataLog')
        const dataReg = document.getElementById('dataReg')
        const inputLogin = document.getElementById('inputLogin')
        const inputPassword = document.getElementById('inputPassword')
        const inputEmail = document.getElementById('inputEmail')
        console.log(inputEmail.value, inputPassword.value, inputLogin.value)
        await axios.post("http://localhost:3001" + url, {
                email: inputEmail.value, 
                login: inputLogin.value, 
                password: inputPassword.value
        })
        .then((data) => {
            if(
                'Пользователь с таким имейл не найден' == data.data || 
                'Не верный пароль' == data.data || 
                'регистрация нихуя не успешно прошла' == data.data
            ){
                console.log("ooops", data)
            }
            return data
        })
        .then((data) => {
            console.log(data)
            const tokens = data.data.tokens
            console.log(tokens)
            cookie.set('refreshToken', tokens.refreshToken, {expires: 30})
            localStorage.setItem('accesToken', tokens.accesToken)
        })
        .catch(() => console.log('pogano'))
        console.log('ready')
        localStorage.setItem('LegoDuplio', 'truуsdfe')
        proops.Reload() 
    } 


    return(
        <div id='loginForm' className='loginForm'>
            <h2>Залогиньтесь</h2>
            <div>
                <h3>Введите емейл</h3>
                <input type="text" id="inputEmail"/>
                <h3>Введите логин</h3> 
                <input type="text" id="inputLogin"/>
                <h3>Введите пароль</h3>
                <input type="text" id="inputPassword"/>
                <button onClick={() => sendData('/login')} id="dataLog">Войти</button><button onClick={() => sendData('/registration')} id="dataReg">Зарегистрироваться</button>
            </div>
        </div>
    )
}