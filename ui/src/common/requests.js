import axios from 'axios';
import {addRequest, removeRequest} from '../actions/requestActions.js'
import { appendValue } from '../actions/actions.js'

/*
 * https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 * UUID function is from the SO post above
 * */
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

export function get({url, params, success, error, dispatch, description, auth = "true"} = {}) {
    var key = uuidv4()
    var request = axios.get(url, {
        headers: {},
        params: params,
    }).then(success || function(response){
        console.log(response)
    })
    .catch(error || function (error) {
        console.log(error.response)
    })
    .then(function(){
        dispatch(removeRequest(key))
    })
    dispatch(addRequest(key, request))
}

export function post({url, params, success, error, dispatch} = {}) {
    var key = uuidv4()
    var request = axios.post(url, params, {
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache"
        },
    })
    .then(success || function(response){
        console.log(response)
    })
    .catch(error || function (error) {
        console.log(error.response)
    })
    .then(function(){
        dispatch(removeRequest(key))
    })
    dispatch(addRequest(key, request))

}

export function remove({url, success, error, dispatch} = {}) {
    var key = uuidv4()
    var request = axios.delete(url, {
        headers: {}
    })
    .then(success || function(response){
        console.log(response)
    })
    .catch(error || function (error) {
        console.log(error.response.headers)
    })
    .then(function(){
        dispatch(removeRequest(key))
    })
    dispatch(addRequest(key, request))
}

export function streamingRequest({url, params, success, error, dispatch, method} = {}) {
    var key = uuidv4()
    var payload = {
        method: method,
        cache: "no-cache",
        mode: "cors",
        headers: {
            "accept": "application/octet-stream",
            "content-type": "application/json",
            "cache-control": "no-cache"
        },
    };

    if (params != null){
        payload["body"] = params;
    }
    var request = fetch(url, payload).then(function(response) {
        success(response);
    })
    .catch(error || function (error) {
        console.log(error);
        if(error.response.status === 504 || error.response.status == 401)
            logout();
            window.location.href = './';
    })
    .then(function(){
        dispatch(removeRequest(key))
    })
    dispatch(addRequest(key, request))
}
