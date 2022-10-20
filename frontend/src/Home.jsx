import react from 'react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ava from './img/ava.png'
import bgAva from './img/forest.jpg'
import './index.css'

// const print = (item) => {console.log(item)}

export default function Home(){

    useEffect(() => {
        const loader = document.getElementById('load')
        const html = document.body
        alert('work')
        // window.addEventListener('load', () => { 
        //     loader.style.display = 'none'
        //     html.style.overflow = 'visible'
        // })
        window.onload = function(){
            loader.style.display = 'none'
            html.style.overflow = 'visible'
        }
        
    })

    return (
        <div className='mainHomeDiv'>
            <div className='load' id='load'>
               <div className="loader"></div> 
            </div>
            <div className='rightDiv'>
                <div className='header'>
                    <img src={ava} alt="" className='img' draggable="false"/>
                    <div className='shapka'></div>
                </div>
                <div className='content'>
                    <div className='test'></div>
                    <div className='test'></div>
                    <div className='test'></div>
                    <div className='test'></div>
                </div>
                
            </div>
            
            <div className='leftDiv'>
                <a href='/'>На форум</a>
            </div>
        </div>
    )
}