import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';

let balance = (props) => (
    <div style={{marginTop: '15px'}}>
        <h2 style={{fontFamily: "'Bayon',  serif"}}>&#x20B9; {Number(props).toFixed(2)}</h2>
    </div>
);

function formatDate(string){
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(string).toLocaleDateString([],options);
}

const accountDetails = (props) => {
    const tname = props.name;
    if(typeof tname !== "undefined"){
        let fname = tname.split(" ")[0];
        let lname = tname.split(" ")[1];
        let dob = formatDate(props.DOB);
    
        return(
            <div style={{width: "60%", marginLeft: "auto", marginRight: "auto"}}>
                <table className="table table-striped table-bordered table-hover">
                    <tbody>
                        <tr>
                            <th style={{width:"50%"}}>Firstame</th>
                            <td style={{width:"50%"}}>{fname.toUpperCase()}</td>
                        </tr>
                        <tr>
                            <th style={{width:"50%"}}>Lastname</th>
                            <td style={{width:"50%"}}>{lname.toUpperCase()}</td>
                        </tr>
                        <tr>
                            <th style={{width:"50%"}}>Email</th>
                            <td style={{width:"50%"}}>{props.email}</td>
                        </tr>
                        <tr>
                            <th style={{width:"50%"}}>Mobile</th>
                            <td style={{width:"50%"}}>{props.mobile}</td>
                        </tr>
                        <tr>
                            <th style={{width:"50%"}}>DOB</th>
                            <td style={{width:"50%"}}>{dob}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}    

let isBal = false;

export default class AccountDetails extends Component{
    constructor(props){
        super(props);
        this.state = {
            user: props.user
        }

        this.viewBalance = this.viewBalance.bind(this);
    }
    viewBalance(){
        isBal = !isBal;
        this.forceUpdate();
    }

    render(){
        return(
            <div className="container">
                <div style={{marginBottom: 0, padding: "10px"}}>
                    <h2 style={{fontFamily: "'Georgia',  serif"}}>ACCOUNT SUMMARY</h2>
                </div>
                <hr/>
                    {accountDetails(this.state.user)}
                <div>
                    <button type="button" onClick={this.viewBalance} className="btn btn-secondary">View Balance</button>
                    {isBal ? balance(this.state.user.balance) : null}
                </div>
                
            </div>
        );
    }
}