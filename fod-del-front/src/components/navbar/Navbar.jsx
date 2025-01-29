import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import "./Navbar.css";
import {Link, useNavigate} from 'react-router-dom'
import { StoreContext } from "../../context/StoreContext";


const Navbar = ({setShowLogin}) => {
   const [menu,setMenu]= useState("home");
   const {getTotalCartAmount,token,setToken} = useContext(StoreContext);
   const navigate= useNavigate();

   const logOut=()=>{
        localStorage.removeItem("token");
        setToken("");
        navigate("/")
   }

  return (
    <div className="navbar">
      <Link to="/"><img className="logo" src={assets.logo} alt="" /></Link>
      <ul className="navbar-menu">
        <Link to="/" className={menu==="home"?"active":""} onClick={()=>setMenu("home")} >home</Link>
        <a href="#explore-menu" className={menu==="menu"?"active":""} onClick={()=>setMenu("menu")}>menu</a>
        <a href="#app-download" className={menu==="mobile-app"?"active":""} onClick={()=>setMenu("mobile-app")}>mobile-app</a>
        <a href="#footer" className={menu==="contact-us"?"active":""} onClick={()=>setMenu("contact-us")}>contact us</a>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
          <Link to="/cart"><img src={assets.basket_icon} alt="" /></Link>
          <div className={getTotalCartAmount()===0?"":"dot"}></div>
        
        </div>
        {!token? <button onClick={()=>setShowLogin(true)}>Sign In</button>:
        <div className="navbar-profile"> 
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              <li onClick={()=>{navigate("/myorders")}}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
              <hr />
              <li onClick={logOut}><img src={assets.logout_icon} alt="" /><p>LogOut</p></li>
              </ul>
          </div>}
       
      </div>
    </div>
  );
};

export default Navbar;
