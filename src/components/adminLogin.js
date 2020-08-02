import "bootstrap/dist/css/bootstrap.min.css";
import React, { Component } from 'react';
import { withRouter, Redirect } from "react-router-dom";
import axios from "axios";



let failed = (props) => {
       return (
       <div className="alert alert-danger" role="alert">
        Incorrect Credentials!
        <button type="button" onClick={props} class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
        </div>
    );
}
var link = '/admin';  
var value = true;

class AdminLogin extends Component{
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            fail: false
        }
        this.email = this.email.bind(this);
        this.pass = this.pass.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.close = this.close.bind(this);
    }

    email(e) {
        this.setState({
            email: e.target.value.toLowerCase()
        });
    }
    pass(e) {
        this.setState({
            password: e.target.value
        });
    }

    onSubmit (e) {
        e.preventDefault();
        var auth = {
            accountID: this.state.email,
            password: this.state.password
        }
        axios.post('http://localhost:5000/Quasar/adminLogin', auth).then(res => {
            if(res.data === "Authentication Failed"){
                this.setState({
                    fail: true
                });
                return console.log("Incorrect Credentials" );
            }else{
                this.setState({
                    fail: false
                });
                localStorage.setItem('JWTAdmin', res.data.token);
                this.props.onAdminLogin();
            }
        })
        .catch (err => {
            // console.log("Error: " + err.response.data);
            console.log(err.data);
        });
        if(this.state.logged){
            
        }
        this.setState({
            email: '',
            password: ''
        });
    }

    close(){
        this.setState({
            fail: false
        });
    }
    render(){
        return(
            <form onSubmit={this.onSubmit} className="container">
                <div className="form-group">
                    <input type="text" value={this.state.email} onChange={this.email} className="form-control" placeholder="Enter Account ID" id="id" required = {value}/>
                </div>
                <div className="form-group">
                    <input type="password" value={this.state.password} onChange={this.pass} className="form-control" placeholder="Enter Admin Password" id="pwd" required = {value}/>
                </div>
                { this.state.fail ? failed(this.close) : null}
                <div className="form-group form-check">
                    <label className="form-check-label">
                    <input className="form-check-input" type="checkbox" required = {value}/> Remember me
                    </label>
                </div>
                
                <button type="submit" className="btn btn-primary ">Submit</button>
            </form>
        );
    }
    
}
export default withRouter(AdminLogin);