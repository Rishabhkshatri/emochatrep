import React from 'react';
import serverCall from './ServerCall';
import {link,emochat_comp} from './config';

class App extends React.Component {
  constructor(props){
    super(props);
    this.stateChange = this.stateChange.bind(this);
    this.state = {
                    page_name : '',
                    loading_text : 'Loading...',
                    data : {}
                  }
  }

  componentDidMount(){
    let req_data = {
      route : '/',
      method : 'POST'
    }
    serverCall(req_data).then(res=>{      
      if(res.page_name !== undefined || res.page_name !== "")
        this.stateChange(
          {
            page_name : res.page_name,
            data : res.data
          }
        );
    });   
  }

  stateChange(state_obj){
    this.setState({page_name:"",data : {}});
    this.setState(state_obj);
  }

  render() {
    let content = <div className="center">{this.state.loading_text}</div>;
    if(this.state.page_name !== ''){
      let PageName = emochat_comp[this.state.page_name];
      content = <PageName data={this.state.data} stateChange={this.stateChange} />
    }
    
    return (
      <div className="App">
        {content}
      </div>
    );
  }
}

export default App;
