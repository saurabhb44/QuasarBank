import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect, NavLink, BrowserRouter, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/login";
import Home from './components/home';
import Transactions from "./components/transactions";
import AccountDetails from "./components/accountDetails";
import Profile from "./components/updateProfile";
import AdminDashboard from "./components/adminDashboard";
import AdminTransactions from "./components/adminTransactions";
import Trade from './components/trade';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUniversity } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import axios from 'axios';


//Finnhub


let buttons = () => {
  return(
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
              <li id="home" className="nav-item">
                  <NavLink exact={true} className="nav-link" activeClassName='active' to={'/dashboard'} >Home</NavLink>
              </li>
              <li id="transactions" className='nav-item'>
                  <NavLink className="nav-link" activeClassName='active' to={"/transactions/"}>Transacations</NavLink>
              </li>
              <li id="profile">
                  <NavLink className="nav-link" activeClassName='active' to={'/profile'}>Profile</NavLink>
              </li>
              <li id="profile">
                  <NavLink className="nav-link" activeClassName='active' to={'/trade'}>Trade</NavLink>
              </li>
          </ul>
      </div>
  );
}

let adminButtons = () => {
  return(
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
              <li id="home" className="nav-item">
                  <NavLink exact={true} className="nav-link" activeClassName='active' to={'/admin'}>Home</NavLink>
              </li>
              <li id="transactions" className='nav-item'>
                  <NavLink className="nav-link" activeClassName='active' to={"/admin/transactions/"}>Transacations</NavLink>
              </li>
          </ul>
      </div>
  );
}

let logout = (props) =>{
  return(
      <ul className="nav navbar-nav navbar-right">
          <li id="logout" onClick={props}><a className='nav-link' href=""><span><FontAwesomeIcon icon={faSignOutAlt} /></span> Sign Out</a></li>
      </ul>
  );
  
}


class App extends Component{
  
  constructor(){
    super();
    this.state = {
      isLoggedIn: false,
      isAdminLogin: false,
      user: []
    }
    this.onLogIn = this.onLogIn.bind(this);
    this.onLogOut = this.onLogOut.bind(this);
    this.onAdminLogin = this.onAdminLogin.bind(this);
    // var obj = JSON.parse(symbols);
    // symbols.map((sym) => {
    //   if(sym.symbol.includes('AMZ')){
    //     console.log(sym);
    //   }
    // });
    
    
  }

  componentDidMount(){
    let jwt = localStorage.getItem('JWT');
    let jwtAdmin = localStorage.getItem("JWTAdmin");
    if(jwt){
      this.onLogIn();
    } 
    else if(jwtAdmin){
      this.onAdminLogin();
    } 
    else {
      this.onLogOut();
    }
    // console.log(this.state);
  }

  onAdminLogin(){
    let jwt = localStorage.getItem('JWTAdmin');
    axios.defaults.headers.common["Authorization"] = "Bearer " + jwt;
    axios.get('http://localhost:5000/Quasar/adminHome/').then( res => {
      if(res.data === "Token Missing Or Wrong"){
          this.onLogOut();
      } else {
          let user = res.data.adminData.admin;
          this.setState({
              user,
              isAdminLogin: true,
              isLoggedIn: false
          });
      }
    }).catch(err => {
        if(err) {
          console.log('Error: ', err); 
        }
        this.setState({
          isLoggedIn: false
        });
    });
    delete axios.defaults.headers.common["Authorization"];
    // this.setState({
    //   isLoggedIn: false,
    //   isAdminLogin: true,
    // });
  }

  onLogIn(){
    let jwt = localStorage.getItem('JWT');
    axios.defaults.headers.common["Authorization"] = "Bearer " + jwt;
    axios.get('http://localhost:5000/Quasar/home/').then( res => {
      if(res.data === "Token Missing Or Wrong"){
          this.onLogOut();
      } else {
          let user = res.data.authdata.user;
          this.setState({
              user,
              isLoggedIn: true,
              isAdminLogin: false
          });
      }
    }).catch(err => {
        if(err) {
          console.log('Error: ', err); 
        }
        this.setState({
          isLoggedIn: false
        });
    });
    delete axios.defaults.headers.common["Authorization"];
  }

  onLogOut(){
    localStorage.removeItem("JWT");
    localStorage.removeItem("JWTAdmin");
    delete axios.defaults.headers.common["Authorization"];
    
    this.setState({
      isLoggedIn: false,
      isAdminLogin: false,
      user: []
    })
  }

  render(){
    return (
      <Router>
        <div className="App">
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
              <div className='container'>
                  <a className="navbar-brand" href="/">
                      <span style={{marginRight: 7}}><FontAwesomeIcon icon={faUniversity}/></span> 
                        QuasarBank
                  </a>
                  {this.state.isLoggedIn ?
                      [buttons(),logout(this.onLogOut)]
                  : null
                  }
                  {this.state.isAdminLogin ? 
                    [adminButtons(),logout(this.onLogOut)]
                  : null
                  }

              </div>
          </nav>
          
          { !this.state.isLoggedIn && !this.state.isAdminLogin ? 
            <>
              <Login onLogIn={this.onLogIn} onAdminLogin={this.onAdminLogin}/>
            </> : 
            <>
              <Home userName={this.state.user.name}/>
            </>
          }

          <Route exact path="/dashboard" component = {(props) => 
            <AccountDetails user={this.state.user}/>
          }/>
          <Route exact path="/transactions/" component = {(props) => 
              <Transactions onLogIn={this.onLogIn} transactions={this.state.user.transactions}/>
          }/>
          <Route exact path="/profile/" component = {() => 
            <Profile user={this.state.user} onUpdate={this.onLogIn} />
          }/>
          <Route exact path='/trade' component={(props) => 
            <Trade balance={this.state.user.balance} onLogOut={this.onLogOut} onLogIn={this.onLogIn} />
          }/>

          <Route exact path="/admin" component = {AdminDashboard}/>
          <Route exact path="/admin/transactions/" component = {(props) => 
              <AdminTransactions onAdminLogin={this.onAdminLogin} transactions={this.state.user.transactions}/>
          }/>
          {
            !this.state.isLoggedIn && !this.state.isAdminLogin ? <Redirect to='/'/>
            :
            this.state.isLoggedIn ?  <Redirect exact to='/dashboard'/> : <Redirect exact to='/admin'/>
            
          }

        
        </div>
        <div className='footer'>
            <p className="footer-content">&copy; Saurabh Bhardwaj </p>
        </div>
     </Router>
      );
  }
  
}

export default App;