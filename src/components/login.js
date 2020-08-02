import "bootstrap/dist/css/bootstrap.min.css";
import React, { Component } from 'react';

import Register from './register';
import Login_Credentials from "./login_credentials";
import AdminLogin from "./adminLogin";

export default class Login extends Component{
    constructor(props){
        super(props);
        // console.log(this.props.match.params);
        this.state = {
            login: true,
            register: false,
            isLoggedIn: false,
            button: 1
        }
        this.onLogIn = this.onLogIn.bind(this);
        this.display = this.display.bind(this);
        this.onAdminLogin = this.onAdminLogin.bind(this);
    }

    display(){
        if(this.state.button === 1){
            return <Login_Credentials onLogIn={this.onLogIn}/>;
        } else if (this.state.button === 2){
            return <Register />;
        } else {
            return <AdminLogin onAdminLogin={this.onAdminLogin}/>;
        }
    }

    onAdminLogin(){
        this.props.onAdminLogin();
    }

    onLogIn(){
        this.props.onLogIn();
    }
    render(){
        return (
            <div >
                <div className="row" style={{margin: "auto", marginTop: 60}}>
                    <div className="col-sm"></div>
                    <div className="col-sm">
                        <div className="btn-group btn-group-lg" style={{width:"100%", marginBottom:"30px"}}>
                            <button type="button" onClick={() => {this.setState({button: 1})}} className="btn btn-default" style={{border:"black 1px solid"}}>Login</button>
                            <button type="button" onClick={() => {this.setState({button: 2})}} className="btn btn-default" style={{border:"black 1px solid"}}>Register</button>
                            <button type="button" onClick={() => {this.setState({button: 3})}} className="btn btn-default" style={{border:"black 1px solid"}}>Admin</button>
                        </div>
                
                        <div>
                            {/* { this.state.login ? <Login_Credentials onLogIn={this.onLogIn}/> : null}
                            { this.state.register ? <Register /> : null} */}
                            {this.display()}
                        </div>
                    </div>
                    <div className="col-sm"></div>
                </div>
            </div>
        );
    }
}