import "bootstrap/dist/css/bootstrap.min.css";
import React, { Component } from 'react';
import axios from 'axios';
import symbols from '../symbols.json';
import finnhub, {DefaultApi, ApiClient } from 'finnhub';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const api_key = ApiClient.instance.authentications['api_key'];
api_key.apiKey = "bshg7ufrh5r9t1gmtrtg" // Replace this
const finnhubClient = new DefaultApi();

const getSuggestions = value => {
    const inputValue = value.trim().toUpperCase();
    const inputLength = inputValue.length;
   
    return inputLength === 0 ? [] : symbols.filter(lang =>
      lang.symbol.toUpperCase().slice(0, inputLength) === inputValue
    );
};

let listItem = (stock, key, onClick) => {
    function onUpdate(){
        onClick(stock.symbol, stock.description);
    }
    return (
        <button onClick={onUpdate} className="list-group-item list-group-item-action" id={key}>
            <div className="d-flex w-100 justify-content-between">
                <h6 className="mb-1">{stock.symbol}</h6>
                <p className="mb-1" style={{fontFamily:  'serif'}}>{stock.description}</p>
            </div>
        </button>
    );
}

let tradeList = (trade, onSelect) => {
    function onclick(){
        onSelect(trade.symbol, trade.quantity, trade.buyPrice);
        // console.log(onSelect);
    }

    return (
        <button onClick={onclick} id='trade' className='btn btn-default'>
                <ul class="list-group list-group-horizontal" style={{fontFamily:  'serif'}}>
                    <li class="list-group-item" style={{width: "15%", marginLeft: "auto", marginRight: "auto", padding: 10}}>{new Date(trade.date).toDateString()}</li>
                    <li class="list-group-item" style={{width: "40%", marginLeft: "auto", marginRight: "auto", padding: 10}}>{trade.description}</li>
                    <li class="list-group-item" style={{width: "10%", marginLeft: "auto", marginRight: "auto", padding: 10}}> {trade.symbol} x {trade.quantity} </li>
                    <li class="list-group-item" style={{width: "15%", marginLeft: "auto", marginRight: "auto", padding: 10}}>@ {trade.buyPrice}</li>
                    <li class="list-group-item" style={{width: "20%", marginLeft: "auto", marginRight: "auto", padding: 10}}> T: {trade.amount} </li>
                </ul>
        </button>
    );
}

var interval, interval1;


export default class Trade extends Component{
    constructor(props){
        super(props);
        this.state = {
            description: '',
            buyPrice: 0,
            userBal: this.props.balance,
            maxqty: null,
            button: 1,
            forex: [],
            value: '',
            suggestions: [],
            buyWindow: false,
            quote: null,
            qty: null,
            total: 0,
            trades: [],
            sellWindow: false
        }
        this.onChange = this.onChange.bind(this);
        this.list = this.list.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onChangeQty = this.onChangeQty.bind(this);
        this.cancel = this.cancel.bind(this);
        this.tradesList = this.tradesList.bind(this);
        this.onSelectSell = this.onSelectSell.bind(this);
        this.onPurchase = this.onPurchase.bind(this);
        this.onSell = this.onSell.bind(this);
    }

    onChange(e){
        this.setState({
            value: e.target.value,
            suggestions: getSuggestions(e.target.value)
        });

        
    }

    list(){
        return this.state.suggestions.slice(0, 5).map((currValue, key) => {
            return listItem(currValue, key, this.onSelect);
        });
    }

    onSelect(e, e1){
        setTimeout(
            this.setState({
                value: e,
                description: e1,
                buyWindow: true
            })
        ,1000);
        
        // interval = setInterval(
            
        // ,1000);
        finnhubClient.quote(e, (error, data, response) => {
            if(error){
                return;
            }
            var num = new Number(data.c * this.state.forex.INR).toFixed(2);
            this.setState({
                quote: num,
                maxqty: parseInt(this.state.userBal / num)
            });
        })
    }
    cancel(){
        clearInterval(interval);
        this.setState({
            buyWindow: false,
            sellWindow: false,
            button: 2,
            value: '',
            qty: null,
            quote: 0,
            total: 0,
            suggestions: []
        })
    }

    onChangeQty(e){
        this.setState({
            qty: e.target.value,
            total: e.target.value * this.state.quote
        });
    }

    tradesList(){
        if((this.state.trades).length === 0) {
            return (
                <div>
                    <h4>No shares are currently held!</h4>
                </div>
            );
        }
        if(this.state.trades !== 0) {
            return this.state.trades.map((currValue, key) => {
                let amt = new Number(currValue.buyPrice * currValue.quantity).toFixed(3);
                let dt = currValue.date;
            
                // if( !dt){
                //     dt = new Date();
                // }
                let trade = {
                    description: currValue.description,
                    symbol: currValue.symbol,
                    buyPrice: currValue.buyPrice,
                    quantity: currValue.quantity,
                    date: dt,
                    amount: amt
                }
                // console.log(trade);
                return tradeList(trade, this.onSelectSell);
            });
        }
        
    }
    onSelectSell(e, qty, buyP){
        
        
        finnhubClient.quote(e, (error, data, response) => {
            if(error){
                return;
            }
            var num = new Number(data.c * this.state.forex.INR).toFixed(2);
            this.setState({
                quote: num,
                maxqty: qty
            });
        });
    
        this.setState({
            sellWindow: true,
            value: e,
            buyPrice: buyP
        });
        // interval = setTimeout(
        //     finnhubClient.quote(e, (error, data, response) => {
        //         var num = new Number(data.c * this.state.forex.INR).toFixed(2);
        //         this.setState({
        //             quote: num,
        //             maxqty: qty
        //         });
        //     })
        // ,1000);
    }

    componentDidMount(){
        interval1 = setInterval(
            finnhubClient.forexRates({"base": "USD"}, (error, data, response) => {
                if(error){
                    return;
                }
                this.setState({
                    forex: data.quote
                })
            })
        , 10000);

        let jwt = localStorage.getItem('JWT');
        axios.defaults.headers.common['Authorization'] = 'bearer ' + jwt;
        axios.get('http://localhost:5000/Quasar/tradeHistory').then( (res) => {
            this.setState({
                trades: res.data.trades
            });
            
        }).catch((err) => {
            console.log('Error: ' + err);
        });
    }

    onPurchase(e){
        e.preventDefault();
        let shareInfo = {
            description: this.state.description,
            quantity: this.state.qty,
            symbol: this.state.value,
            unitPrice: this.state.quote,
            amount: Number(this.state.quote * this.state.qty).toFixed(2),
            date: new Date()
        }
        // console.log(shareInfo);
        let jwt = localStorage.getItem('JWT');
        axios.defaults.headers.common['Authorization'] = 'bearer ' + jwt;
        axios.post('http://localhost:5000/Quasar/buyShares', shareInfo).then( (res) => {
            if(res.data === 'Token Missing Or Wrong'){
                this.props.onLogOut();
            } else {
                jwt = res.data.token;
                localStorage.setItem('JWT', jwt);
                this.props.onLogIn();
            }
            
        }).catch((err) => {
            console.log('Error: ' + err);
        });
    }

    onSell(e){
        e.preventDefault();
        let shareInfo = {
            quantity: this.state.qty,
            symbol: this.state.value,
            amount: Number(this.state.quote * this.state.qty).toFixed(2),
            date: new Date()
        }
        // console.log(shareInfo);
        let jwt = localStorage.getItem('JWT');
        axios.defaults.headers.common['Authorization'] = 'bearer ' + jwt;
        axios.post('http://localhost:5000/Quasar/sellShares', shareInfo).then( (res) => {
            if(res.data === 'Token Missing Or Wrong'){
                this.props.onLogOut();
            } else {
                jwt = res.data.token;
                localStorage.setItem('JWT', jwt);
                this.props.onLogIn();
            }
            
        }).catch((err) => {
            console.log('Error: ' + err);
        });
    }

    componentWillUnmount(){
        // clearInterval(interval);
        clearInterval(interval1);
    }

    render(){
        return (
            <div className="container">
                    <table className='table table-bordered'>
                        <tbody>
                            <tr className="text-secondary">
                                <th  style={{width: "16.666%"}}>
                                    <span  >USD/INR | </span> <span >{new Number(this.state.forex.INR).toFixed(5)}</span>
                                </th>
                                <th scope="col" style={{width: "16.666%"}}>
                                    <span >USD/EUR | </span> <span >{new Number(this.state.forex.EUR).toFixed(5)}</span>
                                </th>
                                <th scope="col" style={{width: "16.666%"}}>
                                    <span >USD/GBP | </span> <span>{new Number(this.state.forex.GBP).toFixed(5)}</span>
                                </th>
                                <th scope="col" style={{width: "16.666%"}}>
                                    <span >USD/KWD | </span> <span  >{new Number(this.state.forex.KWD).toFixed(5)}</span>
                                </th>
                                <th scope="col" style={{width: "16.666%"}}>
                                    <span >USD/BHD | </span> <span  >{new Number(this.state.forex.BHD).toFixed(5)}</span>
                                </th>
                                <th scope="col" style={{width: "16.666%"}}>
                                    <span >USD/JPY | </span> <span>{new Number(this.state.forex.JPY).toFixed(5)}</span>
                                </th>
                            </tr>
                        </tbody>
                    </table>

                <div className="btn-group btn-group-lg" style={{width:"50%", marginBottom:"30px"}}>
                    <button type="button" onClick={() => {this.setState({button: 1, sellWindow: false, buyWindow: false})}} className="btn btn-default" style={{width: "50%", border:"black 1px solid"}}>New Trade</button>
                    <button type="button" onClick={() => {this.setState({button: 2, sellWindow: false, buyWindow: false})}} className="btn btn-default" style={{width: "50%", border:"black 1px solid"}}>Trade History</button>
                </div>
                {this.state.button == 1 ? 
                    !this.state.buyWindow ?
                    <>
                        <form className="form">
                            <div className="md-form active-purple-2" style={{ width:"40%", marginLeft: "auto", marginRight: "auto"}}>
                                <input className="form-control" onChange={this.onChange} value={this.state.value} type="text" placeholder="Enter Stock Symbol..." aria-label="Search"/>
                            </div>
                        </form>
                        <br/>
                        <div style={{width: "40%", marginLeft: "auto", marginRight: "auto"}}>
                            <div class="list-group" id="list-tab" role="tablist">
                                {this.list()}
                            </div>
                        </div>
                    </> :
                    <>
                        <div className="card" style={{width: "70%", marginLeft: "auto", marginRight: "auto"}}>
                            <div className="card-header bg-primary text-light">
                                <span style={{float: "left"}}>Buy {this.state.value} x {this.state.qty} Qty</span>
                                <span style={{float: "right"}}>Price Per Share: &#x20B9; {this.state.quote}</span>
                            </div>
                            <div className="card-body">
                                <form onSubmit={this.onPurchase} className='form-inline' >
                                    <div className='form-group'>
                                        <label className="my-1 mr-2">Qty.</label>
                                        <input type='number' className="form-control mr-2" onChange={this.onChangeQty} value={this.state.qty} min='1' max={this.state.maxqty}/>
                                    </div>
                                    <div className='form-group mr-5' >
                                        <label className="my-1 mr-2">Amt.</label>
                                        <input className="form-control" value={new Number(this.state.total).toFixed(2)} placeholder='0' disabled/>
                                    </div>
                                    <div className="ml-5">
                                        <button className='btn btn-primary mr-2' type='submit'>Buy</button>
                                        <button className='btn btn-secondary' onClick={this.cancel}>Cancel</button>
                                    </div>
                                    
                                </form>
                                <hr/>
                                
                                
                            </div>
                        </div>
                    </>
                    
                    : 
                    !this.state.sellWindow ?
                    <div>
                        <ul class="list-group">
                            {this.tradesList()}
                        </ul>
                    </div> 
                    : 
                    <div className="card" style={{width: "70%", marginLeft: "auto", marginRight: "auto"}}>
                        <div className="card-header bg-danger text-light">
                            <span className="mr-3" style={{float: "left"}}>Buy {this.state.value} x {this.state.qty} Qty</span>
                            <span style={{float: "right"}}>Price Per Share: &#x20B9; {this.state.quote}</span>
                            <span >Purchased At: &#x20B9; {this.state.buyPrice}</span>
                        </div>
                        <div className="card-body">
                            <form onSubmit={this.onSell} className='form-inline' >
                                <div className='form-group' >
                                    <label className="my-1 mr-2">Qty.</label>
                                    <input type='number' className="form-control mr-2" onChange={this.onChangeQty} value={this.state.qty} min='1' max={this.state.maxqty}/>
                                </div>
                                <div className='form-group mr-5'>
                                    <label className="my-1 mr-2">Amt.</label>
                                    <input className="form-control" value={new Number(this.state.total).toFixed(2)} placeholder='0' disabled/>
                                </div>
                                <div className="ml-5 float-right">
                                    <button className='btn btn-danger mr-2' type='submit'>Sell</button>
                                    <button className='btn btn-secondary' onClick={this.cancel}>Cancel</button>
                                </div>
                                
                            </form>
                            <hr/>
                            
                            
                        </div>
                    </div>
                }
            </div>
        );
    }
}