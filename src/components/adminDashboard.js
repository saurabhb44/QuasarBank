import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';


var tr = (user, key) => (
    <tr>
        <td>{key + 1}</td>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>{new Date(user.DOB).toDateString()}</td>
        <td>{user.mobile}</td>
        <td>{user.balance}</td>
    </tr>
);



export default class AdminDashboard extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        }
        this.ts = this.ts.bind(this);
    }
    ts(){
        if(!this.state.users){
            return;
        }
        return this.state.users.map( function(currentValue, key){
            return tr(currentValue, key);
        });
    }

    componentDidMount(){
        let jwt = localStorage.getItem('JWTAdmin');
        axios.defaults.headers.common["Authorization"] = "Bearer " + jwt;
        axios.get('http://localhost:5000/Quasar/adminHome/').then( res => {
        if(res.data === "Token Missing Or Wrong"){
            this.onLogOut();
        } else {
            let users = res.data.users;

            this.setState({
                users,
            });
        }
        }).catch(err => {
            if(err) {
            console.log('Error: ', err); 
            }
        });
    }
    
    render(){
        return(
            <div className="container">
                <div style={{marginBottom: 0, padding: "10px"}}>
                    <h2 style={{fontFamily: "'Georgia',  serif"}}> BANK USERS</h2>
                </div>
                <hr/>
                <table className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">DOB</th>
                            <th scope="col">Mobile</th>
                            <th scope="col">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.ts()}
                    </tbody>
                    
                </table>
            </div>
        );
    }
}