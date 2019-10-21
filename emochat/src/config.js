// All Component
import LogIn from './LogIn';
import ServerErr from './ServerErr';
import Registration from './Registration';
import Main from './Main';
import './App.css';
import socketIOClient from "socket.io-client";

const emochat_comp = {
	ServerErr: ServerErr,
	LogIn: LogIn,
	Registration: Registration,
	Chat: Main
};

// Server Link
const link = 'http://localhost:4000';
const socket = socketIOClient(link+'/');
// App Css

export {
	link,
	emochat_comp,
	socket
};