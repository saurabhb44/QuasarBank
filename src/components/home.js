import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Axios from 'axios';
import AccountDetails from './accountDetails';
import Transactions from './transactions';
// import { Router, Route } from 'react-router-dom';

const date = (props) => (
        <>
            {props.date}
            <p>{props.time}</p>
        </>
);


let border = {
    fontFamily: "'Georgia',  serif",
    border: "0.3px #dbd8d5 outset",
    borderRadius: "7px"
}

export default class Home extends Component{
    constructor(props){
        super(props);
        // console.log(props);
        this.state = {
            userName: props.userName,
            date: new Date().toDateString(),
            time: new Date().toLocaleTimeString(),
            isBal: false
        };
        
    }
    
    componentDidMount(){
        this.intervalID = setInterval(() => {
            this.setState({
                date: new Date().toDateString(),
                time: new Date().toLocaleTimeString()
            });
        }, 1000);

    }
    componentWillUnmount(){
        clearInterval(this.intervalID);
    }
    componentWillReceiveProps(someProp) {
        this.setState({
            userName: someProp.userName
        });
    }

    render(){
        return(
            <div>
                <div className='container text-secondary'>
                    <div className="row">
                        <div className="col-sm bg-light text-grey" style={border}>
                            {date(this.state)}
                        </div>
                        {/* <div className="col-sm"></div> */}
                        <div className="col-sm"></div>
                        
                        <div className="col-sm bg-light text-grey" style={border}>
                            Welcome <p>Mr. {this.state.userName}</p>
                        </div>
                    </div>
                    <hr/>
                </div>
            </div>
        );
    }
}