import axios from "axios";
let APIURL = process.env.REACT_APP_APIURL

export const loginService = (formdata) =>{
    return axios({
        url:APIURL+'/login',
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formdata),
    }).then(response =>{
        return response
    }).catch(e =>{
        console.log('loginerror', e.reponse)
    });
}