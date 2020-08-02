import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';

var DepositMoney = (sendClick) => (
    <div>
        <button type="button" onClick={sendClick} className="btn btn-secondary">Deposit Money</button>
    </div>
);

var DepositForm = (toEmail, amount, password, onChangeToEmail, onChangeAmount, onChangePassword, onSubmit, sendClick) => (
    <form onSubmit={onSubmit} className="container" style={{width: "33%", marginLeft: "auto", marginRight: "auto"}}>
        <div className="form-group">
            <input type="email" className="form-control" value={toEmail} onChange={onChangeToEmail} placeholder="To Email" id="email" required/>
        </div>
        <div className="form-group">
            <input type="number" className="form-control" min='1' value={amount} onChange={onChangeAmount} placeholder="Amount" id="amount" required/>
        </div>
        <div className="form-group">
            <input type="password" className="form-control" value={password} onChange={onChangePassword} placeholder="Enter Password" id="pwd" required/>
        </div>
        <div className="form-group form-check">
            <label className="form-check-label">
            <input className="form-check-input" type="checkbox" required/> Confirm
            </label>
        </div>
        
        <button type="submit" className="btn btn-primary ">Send</button> <t/><t/><t/><t/>
        <button type="submit" onClick={sendClick} className="btn btn-secondary ">Cancel</button>
    </form>
);

var tr = (trans, key) => (
    <tr>
        <td>{key + 1}</td>
        <td>{new Date(trans.tDate).toUTCString()}</td>
        <td>{trans.toEmail}</td>
        <td>{trans.tid}</td>
        <td>{trans.amount}</td>
    </tr>
);



export default class AdminTransactions extends Component{
    constructor(props){
        super(props);
        this.state = {
            transactions: props.transactions,
            send: true,
            toEmail: '',
            amount: null,
            password: ''
        }
        this.sendClick = this.sendClick.bind(this);
        this.onChangeToEmail = this.onChangeToEmail.bind(this);
        this.onChangeAmount = this.onChangeAmount.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.ts = this.ts.bind(this);
    }

    // componentDidMount(){
    //     let jwt = localStorage.getItem('JWTAdmin');
    //     axios.defaults.headers.common["Authorization"] = "Bearer " + jwt;
    //     axios.get('http://localhost:5000/Quasar/adminHome/').then( res => {
        
    //     let trans = res.data.adminData.admin.transactions;
    //     this.setState({
    //         transactions: trans
    //     });
        
    //     }).catch(err => {
    //         if(err) {
    //         console.log('Error: ', err); 
    //         }
    //         this.setState({
    //         isLoggedIn: false
    //         });
    //     });
    //     delete axios.defaults.headers.common["Authorization"];
    // }

    ts(){
        if(!this.state.transactions){
            return;
        }
        return this.state.transactions.slice(0).reverse().map( function(currentValue, key){
            return tr(currentValue, key);
        });
    }
    onSubmit(e){
        e.preventDefault();
        var transact = {
            toEmail: this.state.toEmail,
            amount: this.state.amount,
            password: this.state.password,
            tDate: new Date()
        }
        let jwt = localStorage.getItem('JWTAdmin');
        axios.defaults.headers.common["Authorization"] = "Bearer " + jwt;
        axios.post('http://localhost:5000/Quasar/deposit', transact).then(res => {
            if(res.data === "Incorrect Password"){
                console.log("Incorrect Password");
            } else if (res.data === "Insufficient Funds"){
                console.log("Insufficient Funds");
            } else if (res.data === "Receiver not found"){
                console.log("Receiver not found");
            } else {
                var token = res.data.token;
                localStorage.setItem("JWTAdmin", token);
                this.props.onAdminLogin();
            }
        })
        .catch (err => {
            console.log(err.data);
        });
        this.setState({
            send: true,
            toEmail: '',
            amount: null,
            password: ''
        });
    }

    onChangePassword(e){
        this.setState({
            password: e.target.value
        });
    }

    onChangeToEmail(e){
        this.setState({
            toEmail: e.target.value
        });
    }

    onChangeAmount(e){
        this.setState({
            amount: e.target.value
        });
    }

    sendClick(){
        this.setState({
            send: !this.state.send
        });
    }
    render(){
        return(
            <div className="container">
                <div style={{marginBottom: 0, padding: "10px"}}>
                    <h2 style={{fontFamily: "'Georgia',  serif"}}>TRANSACTIONS</h2>
                </div>
                <hr/>
                {this.state.send ? 
                    <>
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">To Email</th>
                                    <th scope="col">Id</th>
                                    <th scope="col">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.ts()}
                            </tbody>
                            
                        </table>
                        {DepositMoney(this.sendClick)}
                    </>:
                    <>
                        {DepositForm(this.state.toEmail, this.state.amount, this.state.password, this.onChangeToEmail, this.onChangeAmount, this.onChangePassword, this.onSubmit, this.sendClick)} 
                    </>
                }
            </div>
        );
    }
}