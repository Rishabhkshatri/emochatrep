import React from 'react';
import serverCall from './ServerCall';
import {socket, link} from './config';
import emojisList from 'emojis-list';
var emoji_ind = {"analytical":1569,"joy":1639,"sadness":1664,"anger":1661};

class Chat extends React.Component{
	constructor(props) {
		super(props);
		this.chatEvent = this.chatEvent.bind(this);
		this.onChange = this.onChange.bind(this);
		this.sendMsgEvent = this.sendMsgEvent.bind(this);
		this.uploadEvent = this.uploadEvent.bind(this);
		this.backUserList = this.backUserList.bind(this);
		this.state = {
			active_user : {},
			pre_chat : [],
			view : this.props.data.view,
			msg_text : "",
			r_user_id : null,
			video_list : []
		}
		this.cur_user = this.props.data.cur_user;
		this.fileInput = React.createRef();
	}

	UNSAFE_componentWillMount(){
		socket.emit('newUser',this.cur_user);
		socket.on('newUser',(active_user)=>{
			delete active_user[this.cur_user['user_id']];
			this.setState({active_user : active_user});
		});
		
		socket.on('newMsg',(msg_obj)=>{
			if((parseInt(msg_obj.r_user_id) === parseInt(this.state.r_user_id) && parseInt(msg_obj.s_user_id) === parseInt(this.cur_user.user_id))
			 || (parseInt(msg_obj.s_user_id) === parseInt(this.state.r_user_id) && parseInt(msg_obj.r_user_id) === parseInt(this.cur_user.user_id))){
				let pre_chat = this.state.pre_chat;
				pre_chat.push(msg_obj);
				this.setState({pre_chat : pre_chat});
			}
		});
		
		let req_data = {
			route : '/GetFileList',
			method : 'POST'
		}

		serverCall(req_data).then(res=>{
			this.setState({
				video_list : res.data.video_list
			});
		});
	}
	
	onChange(event){
		let obj = {};
		let id = event.target.id;
		let value = event.target.value;
		obj[id] = value;
		this.setState(obj);
	}

	uploadEvent(event){
		var formData = new FormData();
		formData.append('file',this.fileInput.current.files[0]);
        let headers = {
                        'Accept': 'application/json'
                    };
		let req_data = {
			route : '/FileUpload',
			method : 'POST',
			headers : headers,
			body : formData
		}
		serverCall(req_data).then(res=>{
			if(res.api_err.length === 0){
				let video_list = this.state.video_list;
				video_list.push(res.video_data)
				this.setState({
					video_list : video_list
				});
			}
		});

	}

	chatEvent(event){
		let key = event.target.getAttribute('data-key');
		let body = {};
		if(key !== undefined){
			body['r_user_id'] = key;
		}
		body['s_user_id'] = this.cur_user['user_id'];
		let req_data = {
			route : '/GetChats',
			method : 'POST',
			body : body
		}
		serverCall(req_data).then(res=>{
			this.setState({
				pre_chat : res.data.pre_chat,
				view : res.data.view,
				r_user_id : body['r_user_id']
			});
		});
	}

	sendMsgEvent(event){
		let body = {};
		if(this.state.msg_text.length === 0)
			return;

		body['msg_text'] = this.state.msg_text;
		body['r_user_id'] =  this.state.r_user_id;

		let req_data = {
			route : '/SendMsg',
			method : 'POST',
			body : body
		}
		serverCall(req_data).then(res=>{
			this.setState({
				msg_text : ""
			});
		});
	}

	backUserList(){
		this.setState({
			view : "user_list",
		});
	}

	render(){
		let page_content;
		if(this.state.view === "user_list")
			page_content = <UserContent active_user={this.state.active_user} chatEvent={this.chatEvent} uploadEvent={this.uploadEvent} />;
		else if(this.state.view === "chat_detail")
			page_content = <ChatDetail pre_chat={this.state.pre_chat} msg_text={this.state.msg_text} cur_user={this.cur_user} onChange={this.onChange} sendMsgEvent={this.sendMsgEvent} backUserList={this.backUserList}/>;

		return page_content;
	}
}

function UserContent(props) {
	let user_list = "";
	let videos = "";
	if(Object.keys(props.active_user).length === 0){
		user_list = "No Active User";
	}else{
		user_list = <ul className="chatListUl">{Object.entries(props.active_user).map((user_obj)=>
			<li className="chatList" key={user_obj[0]} data-key={user_obj[0]} onClick={props.chatEvent}>{user_obj[1]}</li>
		)}</ul>
	}

	return (<div className="chatListDiv">
				<h3 className="chatListH3">Active Users</h3>
					{user_list}
			</div>);
}

function ChatDetail(props) {
	let chat_list = "";
	if(props.pre_chat.length !== 0){
		chat_list = props.pre_chat.map((chat_obj)=>{
			let emoji = emojisList[1645];
			if(emoji_ind[chat_obj['message_tone']] !== undefined){
				emoji = emojisList[emoji_ind[chat_obj['message_tone']]];
			}
			if(chat_obj['s_user_id'] === props.cur_user['user_id'])
				return <li className="chatList rightList" key={chat_obj['chat_id']}>{chat_obj['message']+"	"+emoji}</li>
			else
				return <li className="chatList" key={chat_obj['chat_id']}>{chat_obj['message']+"	"+emoji}</li>
		});
	}
	
	return (<div>
				<div className="chatListDiv">
					<div className="chatHead">
						<button className="backBtn" onClick={props.backUserList}>Back</button>
						<h3 className="chatH3">Chats</h3>
					</div>
					<ul className="chatListUl">{chat_list}</ul>
					<div className="msgDiv">
						<div className="msgInputDiv">
							<textarea className="msgInput" id="msg_text" value={props.msg_text} onChange={props.onChange} />
						</div>
						<div className="msgBtnDiv">
							<button className="msgBtn" onClick={props.sendMsgEvent}> Send </button>
						</div>
					</div>
				</div>
			</div>);
}

class VideoFeed extends React.Component{
	constructor(props) { console.log(props);
		super(props);
		this.getProfile = this.getProfile.bind(this);
		this.videoList = this.videoList.bind(this);
		this.onChange = this.onChange.bind(this);
		this.uploadEvent = this.uploadEvent.bind(this);
		this.showVideoEvent = this.showVideoEvent.bind(this);
		this.state = {
			video_list : [],
			show_video : 0
		}
		this.cur_user = this.props.data.cur_user;
		this.fileInput = React.createRef();
	}

	UNSAFE_componentWillMount(){
		this.getProfile();
		this.videoList();
		socket.on('newVideo',(active_user)=>{
			this.videoList();
		});

	}
	
	getProfile(){
		let req_data = {
			route : '/GetProfile',
			method : 'POST'
		}

		serverCall(req_data).then(res=>{
			this.setState({
				show_video : res.show_video_all,
			});
		});

	}

	videoList(){
		let req_data = {
			route : '/GetFileList',
			method : 'POST'
		}

		serverCall(req_data).then(res=>{
			this.setState({
				video_list : res.data.video_list,
			});
		});
	}

	onChange(event){
		let obj = {};
		let id = event.target.id;
		let value = event.target.value;
		obj[id] = value;
		this.setState(obj);
	}

	uploadEvent(event){
		var formData = new FormData();
		formData.append('file',this.fileInput.current.files[0]);
        let headers = {
                        'Accept': 'application/json'
                    };
		let req_data = {
			route : '/FileUpload',
			method : 'POST',
			headers : headers,
			body : formData
		}
		serverCall(req_data).then(res=>{
			if(res.api_err.length === 0){
				let video_list = this.state.video_list;
				video_list.push(res.video_data)
				this.setState({
					video_list : video_list,
				});
			}
		});

	}

	showVideoEvent(event){
		let data = {"show_video" : event.target.checked};
		let req_data = {
			route : '/ProfileSettings',
			method : 'POST',
			body : data
		}
		serverCall(req_data).then(res=>{
			if(res.api_err.length === 0){
				this.setState({
					show_video : data['show_video']
				});
			}else{
				this.setState({
					show_video : !data['show_video']
				});
			}
		});
	}
	
	render(){
		return <AllVideo uploadEvent={this.uploadEvent} fileInput={this.fileInput} video_list={this.state.video_list} show_video={this.state.show_video} showVideoEvent={this.showVideoEvent} />;
	}
}

function AllVideo(props) {
	let videos = "";
	console.log(props);
	if(props.video_list.length === 0){
		videos = "No Video";
	}else{
		videos = props.video_list.map((video_obj)=>{
				return(
					<div className="videoCont" key={video_obj.video_id}>
						<span className="videoSpan">{video_obj.user_u_name}</span>
						<video width="320" height="240" controls>
					  		<source src={link+'/GetFile/'+video_obj.video_name} type="video/mp4" />
					  		Your browser does not support the video tag.
						</video>
					</div>
					)});
	}

	return (<div className="videoDiv">
				<div className="videoInputDiv">
					<input className="videoInput" type="file" ref={props.fileInput} onChange={props.uploadEvent} accept="video/*" />
					<label className="container">Show Videos
						<input type="checkbox" title="Show your videos to others" checked={props.show_video} onChange={props.showVideoEvent} />
					  	<span className="checkmark"></span>
					</label>
				</div>
				<div className="videoShowDiv">
					{videos}
				</div>
			</div>
			);
}

export {
	Chat,
	VideoFeed
}
				