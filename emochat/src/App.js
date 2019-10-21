import React from 'react';
import {link,emochat_comp} from './config';

class App extends React.Component {
  constructor(props){
    super(props)
    this.serverCall = this.serverCall.bind(this);
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
    this.serverCall(req_data);   
  }

  serverCall(req_data){
/*    if(req_data.method === undefined){
      req_data.method = 'GET';
    }*/
    if(req_data.body === undefined){
      req_data.body = {};
    }
    let req_con = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }, 
        redirect: 'follow',
        credentials: 'include',
        method : req_data.method,
        body : JSON.stringify(req_data.body)
      };

    // console.log(req_con);
    let req = new Request(link+req_data.route, req_con);
    fetch(req).then(res=>{
      // console.log(res);
      return res.json()
    }).then(res=>{      
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
      content = <PageName data={this.state.data} serverCall={this.serverCall} stateChange={this.stateChange} />
    }
    
    return (
      <div className="App">
        {content}
      </div>
    );
  }
}

export default App;
