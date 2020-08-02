import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faUserEdit, faPen } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function formatDate(string){
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(string).toLocaleDateString([],options);
}

let failed = (props) => {
    return (
    <div className="alert alert-danger" role="alert">
     Incorrect Password!
     <button type="button" onClick={props} class="close" data-dismiss="alert" aria-label="Close">
         <span aria-hidden="true">&times;</span>
     </button>
     </div>
 );
}

let cnfPStyle = {
    backgroundColor: "white"
}
let submitButton = false;

let profile = (user, onEdit) => (
    <>  
        <h3 className="" style={{float: "left"}}>{user.name}</h3>
        <button className="btn btn-link" onClick={onEdit} style={{float: "right", padding: "6px 8px", color: "grey"}} ><span><FontAwesomeIcon icon={faPen} /></span></button>

        <hr style={{clear: "both", margin: "10px 0"}}/>        
        
        <table className="table table-striped table-hover table-bordered">
            <tbody>
                <tr>
                    <th>Email: </th>
                    <td>{user.email} </td>
                </tr>
                <tr>
                    <th>Mobile: </th>
                    <td>{user.mobile} </td>
                </tr>
                <tr>
                    <th>Birth Date: </th>
                    <td>{formatDate(user.DOB)} </td>
                </tr>
            </tbody>
        </table>
    </>
);

export default class Profile extends Component{
    constructor(props){
        super(props);
        this.state = {
            isUpdate: false,
            name: props.user.name,
            email: props.user.email,
            mobile: props.user.mobile,
            DOB: props.user.DOB,
            password: "",
            newPassword: "",
            failed: false
        }
        this.onEdit = this.onEdit.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeMobile = this.onChangeMobile.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeDOB = this.onChangeDOB.bind(this);
        this.onChangeNewPassword = this.onChangeNewPassword.bind(this);
        this.onSubmitUpdate = this.onSubmitUpdate.bind(this);
        this.cancel = this.cancel.bind(this);
        this.onChangeConfirmNewPassword = this.onChangeConfirmNewPassword.bind(this);
        this.close = this.close.bind(this);
    }

    close(){
        this.setState({
            failed: false
        });
    }

    onChangeName(e){
        this.setState({
            name: e.target.value
        });
    }
    onChangeName(e){
        this.setState({
            name: e.target.value
        });
    }
    onChangeEmail(e){
        this.setState({
            email: e.target.value
        });
    }
    onChangeMobile(e){
        this.setState({
            mobile: e.target.value
        });
    }
    onChangePassword(e){
        this.setState({
            password: e.target.value
        });
    }
    onChangeDOB(e){
        this.setState({
            DOB: e.target.value
        });
    }

    onChangeNewPassword(e){
        this.setState({
            newPassword: e.target.value
        });
    }

    onChangeConfirmNewPassword(e){
        if((this.state.newPassword !== e.target.value)){
            cnfPStyle = {
                backgroundColor: "#cf1515",
                color: "white"
            }
            submitButton = true;
        } else {
            cnfPStyle = {
                backgroundColor: "white",
                color: "black"
            }
            submitButton = false;
        }
        this.forceUpdate();
    }

    onSubmitUpdate(e){
        e.preventDefault();
        let newUser = {
            name: this.state.name,
            email: this.state.email,
            DOB: this.state.DOB,
            mobile: this.state.mobile,
            password: this.state.password,
            newPassword: this.state.newPassword
        }
        let jwt = localStorage.getItem('JWT');
        axios.defaults.headers.common["Authorization"] = "Bearer " + jwt;
        axios.put("http://localhost:5000/Quasar/update", newUser).then (res => {
            if(res.data === "Passwords Didn't match!"){
                this.setState({
                    failed: true,
                    isUpdate: false
                });
            } else {
                let JWT = res.data.token;
                localStorage.setItem("JWT", JWT);
                this.props.onUpdate();
                this.setState({
                    isUpdate: false,
                    failed: false
                });
            }
        })
        .catch(err => {
            if(err) throw err;
        });
    }

    onEdit(){
        this.setState({
            isUpdate: true
        });
    }

    cancel(){
        this.setState({
            isUpdate: false
        });
    }

    render(){
        return(
            <div className="text-left" style={{width: "30%", marginLeft: "auto", marginRight: "auto"}}>
                {
                    !this.state.isUpdate ?
                    <>
                    {profile(this.state, this.onEdit)}
                    {this.state.failed ? failed(this.close) : null }
                    </>            
                    : 
                    <> 
                    <form onSubmit={this.onSubmitUpdate} className="container">
                        <div className="form-group">
                            <label>Name: </label>
                            <input type="text" className="form-control" value={this.state.name} onChange={this.onChangeName} id="name" />
                        </div>
                        <div className="form-group">
                            <label>Email:  </label>
                            <input type="email" className="form-control"value={this.state.email} onChange={this.onChangeEmail} id="email" />
                        </div>
                        <div className="form-group">
                            <label>Date of Birth: </label>
                            <input type="date" className="form-control"  onChange={this.onChangeDOB} id="dob" />
                        </div>
                        <div className="form-group">
                            <label>Mobile:  </label>
                            <input type="tel" className="form-control" value={this.state.mobile} onChange={this.onChangeMobile}  id="tel" />
                        </div>
                        <div className="form-group">
                            <label>Current Password: <span style={{color: "red"}}>*</span>  </label>
                            <input type="password" className="form-control" onChange={this.onChangePassword} id="pwd" required/>
                        </div>
                        <div className="form-group">
                            <label>New Password:  </label>
                            <input type="password" onChange={this.onChangeNewPassword} className="form-control"  id="npwd" />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password:  </label>
                            <input type="password" style={cnfPStyle} className="form-control" onChange={this.onChangeConfirmNewPassword} id="Cnpwd" />
                        </div>
                        <div className="form-group form-check">
                            <label className="form-check-label">
                            <input className="form-check-input" type="checkbox" required/> Agree
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={submitButton}>Submit</button> <t/><t/>
                        <button type="submit" onClick={this.cancel} className="btn btn-secondary ">Cancel</button>
                    </form>
                     </>
                }
            </div>
        );
    }
}