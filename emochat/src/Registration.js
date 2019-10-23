import React from 'react';
import serverCall from './ServerCall';
class Registration extends React.Component{
	constructor(props) {
		super(props);
		this.registerEvent = this.registerEvent.bind(this);
		this.emailCheckEvent = this.emailCheckEvent.bind(this);
		this.logPageEvent = this.logPageEvent.bind(this);
		this.onChange = this.onChange.bind(this);
		this.state = {
			user : '',
			name : '',
			email : '',
			password : ''
		}
	}

	registerEvent(){
		let is_valid = true;
		if(this.state.user.length === 0){
			document.getElementById('err_msg').innerText = 'Incorrect User Name';
			is_valid = false;
		}else if(this.state.name.length === 0){
			document.getElementById('err_msg').innerText = 'Incorrect Name';
			is_valid = false;
		}else if(this.state.email.length === 0){
			this.emailCheckEvent(this.state.email)
			is_valid = false;
		}else if(this.state.password.length === 0){
			document.getElementById('err_msg').innerText = 'Incorrect Password';
			is_valid = false;
		}

		if(is_valid){
			let req_data = {
				route : '/Registration',
				method : 'POST',
				body : this.state
			};
			serverCall(req_data).then(res=>{
				if(res.api_err === ""){
				    this.props.stateChange({
				    	page_name : res.page_name,
				    	data : res.data
				    });
				}else{
					document.getElementById('err_msg').innerText = res.api_err;
				};
			})
		}
	}

	onChange(event){
		let obj = {};
		let id = event.target.id;
		let value = event.target.value;
		obj[id] = value;
		this.setState(obj);
	}

	emailCheckEvent(email) {
		let email_arr = email.split('@');
		let is_err = false;
		if(email_arr.length!==2){
			is_err = true;
		}else if(email_arr[0].length===0 || email_arr[1].length===0){
			is_err = true;
		}else{
			email_arr = email_arr[1].split('.');
			if(email_arr.length!==2){
				is_err = true;
			}else if(email_arr[0].length===0 || email_arr[1].length===0){
				is_err = true;
			}
		}

		if(is_err)
			document.getElementById('err_msg').innerText = 'Incorrect Email';
		else
			document.getElementById('err_msg').innerText = '';
	}

	logPageEvent() {
	    this.props.stateChange({page_name : 'LogIn'});
	}

	render() {
		let page_content = <RegisterContent elemVal={this.state} onChange = {this.onChange} emailCheckEvent = {this.emailCheckEvent} registerEvent = {this.registerEvent} logPageEvent = {this.logPageEvent}/>;
		return page_content;
	}
}

function RegisterContent(props) {
	return (
		<div className="pageContent">
			<h3>Register</h3>
			<table className="normTable">
				<tbody>
					<tr>
						<td><label> User Name </label></td>
						<td><input type="text" value={props.elemVal.user} id="user" onChange={props.onChange} /></td>
					</tr>
					<tr>
						<td><label> Name </label></td>
						<td><input type="text" value={props.elemVal.name}  id="name" onChange={props.onChange}/></td>
					</tr>
					<tr>
						<td><label> Email Address </label></td>
						<td><input type="text" value={props.elemVal.email} id="email" onChange={props.onChange} /></td>
					</tr>
					<tr>
						<td><label> Password </label></td>
						<td><input type="text" value={props.elemVal.password} id="password" onChange={props.onChange} /></td>
					</tr>

					<tr>
						<td><button onClick={props.registerEvent}> Register </button></td>
						<td><span onClick={props.logPageEvent}> LogIn </span></td>
					</tr>
					<tr>
						<td><span id="err_msg"></span></td>
					</tr>
				</tbody>
			</table>
		</div>
	)
}

export default Registration;