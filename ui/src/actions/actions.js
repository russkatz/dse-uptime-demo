import {createAction} from 'redux-actions';
import requestActions from './requestActions.js';
import { get } from '../common/requests.js';
import { post } from '../common/requests.js';
import { streamingRequest } from '../common/requests.js';


export function writeApi() {
    var data = '{"dc": "AWS", "count": 5000, "cl": "ONE"}';
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
        }, 5000)
        
    }
}

export function dropOneNode() {
    return(dispatch, getState) => {
        const url = 'http://52.53.185.6:8080/demo/killnode';
        const nodeIpAddresses = getState().app.nodeList.filter((node) => {
            return node.mode === 'normal';
        }).map(node => {
            return node.node_ip
        }) 
        const randomDroppedNode = nodeIpAddresses[parseInt(Math.random() * nodeIpAddresses.length)]

        console.log([randomDroppedNode]) 

        if (randomDroppedNode !== undefined) {
            post({
                url: url,
                params: [randomDroppedNode],
                success: function(res){

                },
                dispatch: dispatch,
                method: "POST"
            })
        }
    }
}

export function resetAllNodes() {
    return(dispatch, getState) => {
        const url = 'http://52.53.185.6:8080/demo/recover';
        // debugger
        const nodesDown = [];
        getState().app.nodeList.map(node => {
            if (node.mode === null) {
                nodesDown.push(node.node_ip)
            } 
            return nodesDown
        })
        console.log(nodesDown)

        post({
            url: url,
            params: nodesDown,
            success: function(res){
                // setStartingNodes(dispatch, getState)
            },
            dispatch: dispatch,
            method: "POST"
        })
    }
}


// export function setStartingNodes(dispatch, getState) {

// }


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


export default {writeApi, readApi, readChunk, getNodeInfo, dropOneNode, resetAllNodes, updateValue, appendValue, updateData};