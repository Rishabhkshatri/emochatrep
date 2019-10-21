import React from 'react';

class LogIn extends React.Component{
	constructor(props) {
		super(props);
		this.logInEvent = this.logInEvent.bind(this);
		this.registerPageEvent = this.registerPageEvent.bind(this);
		this.onChange = this.onChange.bind(this);
		this.state = {
			email : '',
			password : ''
		}
	}

	onChange(event){
		let obj = {};
		let id = event.target.id;
		let value = event.target.value;
		obj[id] = value;
		this.setState(obj);
	}

	logInEvent() {
		let req_data = {
			route : '/',
			method : 'POST',
			body : this.state
		}
		this.props.serverCall(req_data);
	}

	registerPageEvent() {
	    this.props.stateChange({page_name : 'Registration'});
	}

	render() {
		let page_content = <LogInContent elem_val={this.state} onChange={this.onChange} logInEvent={this.logInEvent} register = {this.registerPageEvent}/>;
		return page_content;
	}
}

function LogInContent(props) {
	return (
		<div className="pageContent">
			<h3>LogIn</h3>
			<table className="normTable">
				<tbody>
					<tr>
						<td><label> Email Address </label></td>
						<td><input type="text" id="email" value={props.elem_val.email} onChange={props.onChange} /></td>
					</tr>
					<tr>
						<td><label> Password </label></td>
						<td><input type="password" id="password" value={props.elem_val.password} onChange={props.onChange} /></td>
					</tr>
					<tr>
						<td><button onClick={props.logInEvent}> LogIn </button></td>
						<td><span onClick={props.register}> Register </span></td>
					</tr>
				</tbody>
			</table>
		</div>
	)
}

export default LogIn;