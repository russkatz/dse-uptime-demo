import {createAction} from 'redux-actions';
import requestActions from './requestActions.js';
import { get } from '../common/requests.js';
import { streamingRequest } from '../common/requests.js';
import { post } from '../common/requests.js';


export function writeApi() {
    var data = '{"dc": "AWS", "count": 5000, "cl": "ONE"}';
    // debugger
    return(dispatch, getState) => {
        const url = 'http://52.53.185.6:8080/demo/write';
        streamingRequest({
            url: url,
            params: data,
            success: function(response){
                var reader = response.body.getReader();
                readChunk(reader, dispatch, "writes")
            },
            dispatch: dispatch,
            method: "POST"
        })
    }

}
export function readApi() {
    var data = '{"dc": "AWS", "count": 5000, "cl": "ONE"}';
    //debugger
    return(dispatch, getState) => {
        const url = 'http://52.53.185.6:8080/demo/read';
        streamingRequest({
            url: url,
            params: data,
            success: function(response){
                var reader = response.body.getReader();
                readChunk(reader, dispatch, "reads")
            },
            dispatch: dispatch,
            method: "POST"
        })
    }
}

export function readChunk(reader, dispatch, valueKey){
    reader.read().then(function(result){
        var decoder = new TextDecoder();
        var chunk = decoder.decode(result.value || new Uint8Array, {stream: !result.done});
        chunk.split("\n").forEach((chunkedLine) => {
            if (chunkedLine.trim().length != 0){
                const incomingApiData = JSON.parse(chunkedLine);
                dispatch(appendValue(valueKey, incomingApiData));
            }
        });

        if (result.done) {
            dispatch(removeRequest(key))
            if (args == null){
                dispatch(runWhenDone())
            }else {
                dispatch(runWhenDone(args))
            }
            return;
        } else {
            return readChunk(reader, dispatch, valueKey);
        }
    });
}

export function getNodeInfo(url) {
    return(dispatch, getState) => {

        const interval = setInterval(() => {
            get({
                url: url, 
                success: function(res){
                    dispatch(updateValue('nodeList', res.data))
                },
                dispatch: dispatch
            });
        }, 8000)
        console.log(interval)
    }
}

// export function resetAllNodes() {

//     return(dispatch, getState) => {
//         const url = 'http://52.53.185.6:8080/demo/recover';
//         // debugger
//         const nodeIpAddresses = getState().app.nodeList.map(nodes => {
//             return nodes.node_ip
//         })
//         // console.log(nodeIpAddresses)
//         post({
//             url: url,
//             params: nodeIpAddresses,
//             success: function(res){
//             },
//             dispatch: dispatch,
//             method: "POST"
//         })
//     }
// }
export function resetOfflineNode() {
    return(dispatch, getState) => {
        const url = 'http://52.53.185.6:8080/demo/recover';
        // debugger
        const nodesDownList = [];
        const nodeIpAddresses= getState().app.nodeList.map(node => {
            if (node.mode !== 'normal') {
                nodesDownList.push(node.node_ip)
            } else {
                return null;
            }
            console.log(nodesDownList)
            // console.log(nodeIpAddresses)
        })


        post({
            url: url,
            params: nodesDownList,
            success: function(res){
            },
            dispatch: dispatch,
            method: "POST"
        })
    }
}

export function killOneNode() {

    return(dispatch, getState) => {
        const url = 'http://52.53.185.6:8080/demo/killnode';
        // debugger
        const nodeIpAddresses = getState().app.nodeList.map(nodes => {
            return nodes.node_ip
        })
        const values = Object.values(nodeIpAddresses)
        const randomValue = values[parseInt(Math.random() * values.length)]

        console.log([randomValue])

        post({
            url: url,
            params: [randomValue],
            success: function(res){
            },
            dispatch: dispatch,
            method: "POST"
        })
    }
}


export function updateValue(key, value){
    return(dispatch, getState) => {
            dispatch(updateData("UPDATE", {"key": key, "value": value}))
    }
}

export function appendValue(key, value) {
    return(dispatch, getState) => {
        const state = getState();
        var currentKeyState = state.app[key]

        currentKeyState.push(value)
        dispatch(updateData("UPDATE", {"key": key, "value": currentKeyState}))
    }
}

export const updateData = (type, data) => {
    return {
        type: type,
        data: data
    }
}

// export default {updateData, getNodeInfo, writeApi, readApi, readChunk, updateValue, appendValue, resetAllNodes, resetOfflineNode};
export default {updateData, getNodeInfo, writeApi, readApi, readChunk, updateValue, appendValue, resetOfflineNode};