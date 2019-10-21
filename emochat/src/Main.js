import React from 'react';
import { Chat,VideoFeed } from './Chat'
class Main extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			data : this.props.data
		}
	}

	render(){
		return(
				<div>
					<Chat data={this.state.data} />
					<VideoFeed data={this.state.data} />
				</div>
			);
	}
}

export default Main;
				