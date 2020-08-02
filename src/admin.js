import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect, NavLink, BrowserRouter } from "react-router-dom";
// import logo from './logo.svg';
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/login";
import Home from './components/home';
import Transactions from "./components/transactions";
import AccountDetails from "./components/accountDetails";
import Profile from "./components/updateProfile";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUniversity } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import axios from 'axios';

let buttons = (props) => {
    return(
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
                <li id="home" className="nav-item">
                    <NavLink exact={true} className="nav-link" activeClassName='active' to={'/'} onClick={props}>Home</NavLink>
                </li>
                <li id="transactions" className='nav-item'>
                    <NavLink className="nav-link" activeClassName='active' to={"/transactions/"}>Transacations</NavLink>
                </li>
                <li id="profile">
                    <NavLink className="nav-link" activeClassName='active' to={'/profile'}>Users</NavLink>
                </li>
            </ul>
        </div>
    );
}
  
let logout = (props) =>{
return(
    <ul className="nav navbar-nav navbar-right">
        <li id="logout" onClick={props}><a className='nav-link' href="#"><span><FontAwesomeIcon icon={faSignOutAlt} /></span> Sign Out</a></li>
    </ul>
    );  
}

export default class Admin extends Component{
    render(){
        return (
            <div>
                <h1>ADMIN</h1>
            </div>
        );
    }
}