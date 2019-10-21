import {link,emochat_comp} from './config';

var serverCall = (req_data)=>{
  if(req_data.method === undefined){
    req_data.method = 'GET';
  }

  if(req_data.body === undefined){
    req_data.body = {};
  }

  if(req_data.headers === undefined){
    req_data.headers = {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      }
  }
  
  if(req_data.headers['Content-Type'] === 'application/json'){
   req_data.body = JSON.stringify(req_data.body);
  }

  let req_con = {
      headers: req_data.headers, 
      redirect: 'follow',
      credentials: 'include',
      method : req_data.method,
      body : req_data.body
    };
  
  let req = new Request(link+req_data.route, req_con);

  return new Promise(resolve=>{
    fetch(req).then(res=>{
    resolve(res.json());
  })}); 
}

export default serverCall;