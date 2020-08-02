import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';

export default class Register extends Component{
    constructor(props){
        super(props);
        this.state = {
            register_name: '',
            register_dob: '',
            register_email: '',
            register_telephone: '',
            register_password: '',
            confirmed_pass: ''
        }
        this.inputName = this.inputName.bind(this);
        this.inputDOB = this.inputDOB.bind(this);
        this.inputEmail = this.inputEmail.bind(this);
        this.inputTel = this.inputTel.bind(this);
        this.inputPass = this.inputPass.bind(this);
        this.confirmPass = this.confirmPass.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    inputName(e) {
        this.setState({
            register_name: e.target.value
        });
    }
    inputDOB(e) {
        this.setState({
            register_dob: e.target.value
        });
    }
    inputEmail(e){
        this.setState({
            register_email: e.target.value
        });
    }
    inputTel(e){
        this.setState({
            register_telephone: e.target.value
        });
    }
    inputPass(e){
        this.setState({
            register_password: e.target.value
        });
    }
    confirmPass(e){
        this.setState({
            confirmed_pass: e.target.value
        });
    }
    onSubmit (e) {
        e.preventDefault();

        var newUser = {
            email: this.state.register_email,
            name: this.state.register_name,
            mobile: this.state.register_telephone,
            password: this.state.register_password,
            DOB: this.state.register_dob
        }

        if(this.state.register_password !== this.state.confirmed_pass){
            alert("Passwords Mismatch");
        }else{
            axios.post('http://localhost:5000/Quasar/register', newUser).then( res => {
                console.log('User Added...');
            });
        }

        this.setState({
            register_name: '',
            register_dob: '',
            register_email: '',
            register_telephone: '',
            register_password: '',
            confirmed_pass: '' 
        });
    }


    render(){
        return(
            <form onSubmit = {this.onSubmit} className="container">
                <div className="form-group">
                    <input type="text" value={this.state.register_name} onChange={this.inputName} className="form-control" placeholder="Enter Name" id="name" />
                </div>
                <div className="form-group">
                    <input type="date" value={this.state.register_dob} onChange={this.inputDOB} className="form-control" placeholder="Enter email" id="dob" />
                </div>
                <div className="form-group">
                    <input type="email" value={this.state.register_email} onChange={this.inputEmail} className="form-control" placeholder="Enter email" id="email" />
                </div>
                <div className="form-group">
                    <input type="tel" value={this.state.register_telephone} onChange={this.inputTel} className="form-control" placeholder="Enter Phone" id="tel" />
                </div>
                <div className="form-group">
                    <input type="password" value={this.state.register_password} onChange={this.inputPass} className="form-control" placeholder="Enter password" id="pwd" />
                </div>
                <div className="form-group">
                    <input type="password" value={this.state.confirmed_pass} onChange={this.confirmPass} className="form-control" placeholder="Confirm password" id="Cpwd" />
                </div>
                <div className="form-group form-check">
                    <label className="form-check-label">
                    <input className="form-check-input" type="checkbox" /> Agree
                    </label>
                </div>
                <button type="submit" className="btn btn-primary ">Submit</button>
            </form>
        );
    }
}