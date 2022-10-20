import { useState, useEffect, useContext } from "react";
import { Routes, Route, Link, Router } from "react-router-dom";
import axios from "axios"
import cookie from "js-cookie";
import Forum from "./Forum";
import Home from "./Home";
import Login from "./Login"

export default function App(){
    const cookieToken = cookie.get('refreshToken')

    const BaseURL = "http://localhost:3001/"
    const [res, setResult] = useState('Loading...')
    const [reload, startReload] = useState('')
    const [message, setMessage] = useState('АВТОРИЗУЙТЕСЬ')
 
    var data = async () => {
        return (
            await axios.get(BaseURL).then((res) => {
                console.log(res)
                setResult(res.data)
            })
        )
    }

    var checkAuth = async () => {
        return (
            await axios.get(BaseURL + 'get-all-users', { withCredentials: true, headers: { Authorization: `Bearer ${localStorage.getItem('accesToken')}`}})
        )
    }

    console.log(!cookieToken)
    useEffect(() => {
        if(localStorage.getItem('accesToken')){
            const auth = checkAuth()
            if(auth){
                setMessage('вы авторизованы')
            }
        }
        

    }, [])
     
    if(!cookieToken){ 
        return (
            <Login Reload={startReload}/>
        )
    }
    return (
            <Routes>
                <Route exact path='/' element={<Forum 
                promise={res}
                message={message} 
                function={checkAuth}
                />} />
                <Route path='/home' element={<Home />} />
            </Routes>
    )
}