// import React, {Component} from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSignOutAlt, faUniversity } from '@fortawesome/free-solid-svg-icons';
// import {Link, NavLink} from 'react-router-dom';

// // let loggedin = () => {
// //     return(
        
// //     );
// // }
// var home = "nav-item";
// var transactions = "nav-item";
// var profile = "nav-item";
// var active = "active";

// let buttons = () => {
//     return(
//         <div className="collapse navbar-collapse" id="navbarSupportedContent">
//             <ul className="navbar-nav mr-auto">
//                 <li id="home" className="nav-item">
//                     {/* <a className="nav-link" href="/">Home</a> */}
//                     <NavLink exact={true} className="nav-link" activeClassName='active' to='/'>Home</NavLink>
//                 </li>
//                 <li id="transactions" className='nav-item'>
//                     {/* <a className="nav-link" href="/transactions">Transacations</a> */}
//                     <NavLink className="nav-link" activeClassName='active' to='/transactions'>Transacations</NavLink>
//                 </li>
//                 <li id="profile">
//                     {/* <a className="nav-link" href="/profile">Profile</a> */}
//                     <NavLink className="nav-link" activeClassName='active' to='/profile'>Profile</NavLink>
//                 </li>
//             </ul>
//         </div>
//     );
// }

// let logout = (props) =>{
//     return(
//         <ul className="nav navbar-nav navbar-right">
//             <li id="logout" onClick={props.onLogOut}><a className='nav-link' href="#"><span><FontAwesomeIcon icon={faSignOutAlt} /></span> Sign Out</a></li>
//         </ul>
//     );
    
// }

// export default class Navbar extends Component{
//     constructor(props){
//         super(props);
//         this.state = {
//             isLoggedIn: this.props.logged
//         }
//     }
//     componentWillReceiveProps(someProp) {
//         this.setState({
//             isLoggedIn: someProp.logged
//         });
//     }
//     render(){
//         return(
//             <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//                     <div className='container'>
//                         <a className="navbar-brand" href="/">
//                             <span style={{marginRight: 7}}><FontAwesomeIcon icon={faUniversity}/></span> 
//                              QuasarBank
//                         </a>
//                         {this.state.isLoggedIn ?
//                             [buttons(),logout(this.props)]
//                         : null}
 
//                     </div>
//                 </nav>
//         );
//     }   
// }