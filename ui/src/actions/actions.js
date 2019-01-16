import {createAction} from 'redux-actions';
import requestActions from './requestActions.js';
import {get} from '../common/requests.js';
import post from 'axios';


export function readApi() {
    return(dispatch, getState) => {
        axios.post('http://52.53.185.6:8080/demo/read', {
            "dc": "AWS",
            "count": 5000,

        }, {
            headers: {"Content-Type": "application/json"}
        })
        .then((res) => {
            
        }).catch((err) => {
            
        });


    }
}


export function getDataCenter(url) {
    return(dispatch, getState) => {
        get({
            url: url, 
            success: function(res){
                dispatch(updateValue('nodeList', res.data))
                // console.log(res.data[3].dc)

                //TODO: Get the data centers from res.data and assign them to:
                var rawList = []
                rawList = res.data.map((data) => {
                    if(data.dc) {
                        return data.dc
                    }
                });
                let dcList = [...new Set(rawList)]
                console.log(dcList)
                dispatch(updateValue('dcList', dcList))
            },
            dispatch: dispatch
        });
    }
}

export function updateValue(key, value){
    return(dispatch, getState) => {
            dispatch(updateData("UPDATE", {"key": key, "value": value}))
    }
 }

export const updateData = (type, data) => {
    return {
        type: type,
        data: data
    }
}

export default {updateData, getDataCenter};