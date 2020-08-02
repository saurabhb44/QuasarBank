import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';

var sendMoney = (sendClick) => (
    <div>
        <button type="button" onClick={sendClick} className="btn btn-secondary">Send Money</button>
    </div>
);

var sendForm = (toEmail, amount, password, onChangeToEmail, onChangeAmount, onChangePassword, onSubmit, sendClick, isFailed, close, failMsg) => (
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
        {isFailed ? failed(close, failMsg) : null}
        <button type="submit" className="btn btn-primary ">Send</button> <t/><t/><t/><t/>
        <button type="submit" onClick={sendClick} className="btn btn-secondary ">Cancel</button>
    </form>
);

let failed = (props, props1) => {
    return (
    <div className="alert alert-danger mt-3"  role="alert">
     {props1}
     <button type="button" onClick={props} className="close" data-dismiss="alert" aria-label="Close">
         <span aria-hidden="true">&times;</span>
     </button>
     </div>
 );
}

var tr = (trans, key) => (
    <tr>
        <td>{key + 1}</td>
        <td>{new Date(trans.tdate).toUTCString()}</td>
        <td>{trans.narration + "_" + trans.tid}</td>
        <td>{trans.debit}</td>
        <td>{trans.credit}</td>
        <td>{Number(trans.updatedBal).toFixed(2)}</td>
    </tr>
);



export default class Transactions extends Component{
    constructor(props){
        super(props);
        this.state = {
            transactions: [],
            send: true,
            toEmail: '',
            amount: null,
            password: '',
            failed: false,
            failMsg: 'Incorrect Credentials!'
        }
        this.sendClick = this.sendClick.bind(this);
        this.onChangeToEmail = this.onChangeToEmail.bind(this);
        this.onChangeAmount = this.onChangeAmount.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.ts = this.ts.bind(this);
        this.close = this.close.bind(this);
    }
    componentDidMount(){
        let jwt = localStorage.getItem('JWT');
        axios.defaults.headers.common["Authorization"] = "Bearer " + jwt;
        axios.get('http://localhost:5000/Quasar/home/').then( res => {
        if(res.data === "Token Missing Or Wrong"){

        } else {
            this.setState({
                transactions: res.data.authdata.user.transactions,
            });
        }
        }).catch(err => {
            if(err) {
            console.log('Error: ', err); 
            }
        });
        delete axios.defaults.headers.common["Authorization"];
    }
    ts(){
        if(this.state.transactions){
            return this.state.transactions.slice(0).reverse().map( function(currentValue, key){
                return tr(currentValue, key);
            });
        }
        
    }
    close(){
        this.setState({
            failed: false
        });
    }

    onSubmit(e){
        e.preventDefault();
        var transact = {
            sentTo: this.state.toEmail,
            amount: this.state.amount,
            password: this.state.password,
            tdate: new Date()
        }
        let jwt = localStorage.getItem('JWT');
        axios.defaults.headers.common["Authorization"] = "Bearer " + jwt;
        axios.post('http://localhost:5000/Quasar/send', transact).then(res => {
            if(res.data === "Incorrect Password"){
                console.log("Incorrect Password");
                this.setState({
                    failed: true,
                    send: false,
                    failMsg: 'Incorrect Password!'
                });
            } else if (res.data === "Insufficient Funds"){
                console.log("Insufficient Funds");
                this.setState({
                    failed: true,
                    send: false,
                    failMsg: 'Insufficient Funds!'
                });
            } else if (res.data === "Receiver not found"){
                console.log("Receiver not found");
                this.setState({
                    failed: true,
                    send: false,
                    failMsg: 'Invalid Receiver!'
                });
            } else {
                var token = res.data.token;
                localStorage.setItem("JWT", token);
                this.props.onLogIn();
                this.setState({
                    failed: false
                });
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
                                    <th scope="col">Narration</th>
                                    <th scope="col">Debit</th>
                                    <th scope="col">Credit</th>
                                    <th scope="col">Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.ts()}
                            </tbody>
                            
                        </table>
                        {sendMoney(this.sendClick)}
                    </>:
                    <>
                        {sendForm(this.state.toEmail, this.state.amount, this.state.password, this.onChangeToEmail, this.onChangeAmount, this.onChangePassword, this.onSubmit, this.sendClick, this.state.failed, this.close, this.state.failMsg)}
                        {/* {this.state.failed ? failed(this.close, this.state.failMsg) : null} */}
                    </>
                }
            </div>
        );
    }
}