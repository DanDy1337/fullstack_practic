import { useEffect, useState } from "react";
import $ from 'jquery';
import { Link, resolvePath } from "react-router-dom";
import logoSite from "./img/website_logo_8.png";
import ava from "./img/ava.png";
import "./index.css";

export default function Forum( mainItem ) {

  const Function = () => {
    mainItem.function().then((data) => console.log(data))
  }

  useEffect(() => {
    const mainContent = document.getElementById("mainContent")
    mainContent.innerHTML = mainItem.promise
    const loader = document.getElementById("load");
    const plate = document.getElementById("1");
    const html = document.body;

    $(window).ready(function (){
      $('.load').hide();
    }) 
    
  });

  return (
    <div className="forumMainDiv">
      <div className="forumLeftDiv">
        <div className="forumHead">
          <img src={ava} className="imgForum" draggable="false" />
          <div style={{ textAlign: "center" }}>
            {/* {data} */}
            Настраиваемое окно <br />
            {mainItem.message}
          </div>
          <img src={logoSite} className="logoSite" alt="" />
        </div>
        <div className="forumContent" id="mainContent"></div>
        <button onClick={Function}>Нажми на кнопку</button>
      </div>
      {/* <button >Показать картинку</button> */}
      <div className="forumRightDiv">
        <a href="/home">Домой</a>
        <a href="/mess">Мессенджер</a>
      </div>
      <div className="load" id="load">
        <div className="loader"></div>
      </div>
    </div>
  );
}
