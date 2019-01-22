import {createAction} from 'redux-actions';
import requestActions from './requestActions.js';
import {get} from '../common/requests.js';
// import post from 'axios';
import {streamingRequest} from '../common/requests.js';


// export function readApi() {
//     return(dispatch, getState) => {
//         axios.post('http://52.53.185.6:8080/demo/read', {
//             "dc": "AWS",
//             "count": 5000,

//         }, {
//             headers: {"Content-Type": "application/json"}
//         })
//         .then((res) => {
            
//         }).catch((err) => {
            
//         });


//     }
// }

export function writeApi() {
    var data = '{"dc": "AWS", "count": 5000, "cl": "ONE"}';

    return(dispatch, getState) => {
        const url = 'http://52.53.185.6:8080/demo/write';
        streamingRequest({
            url: url,
            params: data,
            success: function(response){
                var reader = response.body.getReader();
                readChunk(reader, dispatch)
            },
            dispatch: dispatch,
            method: "POST"
        })
    }

}

export function readChunk(reader, dispatch, command, removeRequest, key, runWhenDone, args){
    reader.read().then(function(result){
        var decoder = new TextDecoder();
        var chunk = decoder.decode(result.value || new Uint8Array, {stream: !result.done});
        chunk.split("\n").forEach((chunkedLine) => {
            if (chunkedLine.trim().length != 0){
                const purchasesData = JSON.parse(chunkedLine);
                dispatch(appendValue('writes', purchasesData));
        
        //         var chunkObject = {
        //             "source" : id,
        //             "index" : i,
        //             "msg": chunkedLine,
        //             "command": command
            }
        //         i = i + 1;

                //console.log(chunkedLine);

                // if (chunkedLine.indexOf(STATUS_DELIMITER) != -1){
                //     status = chunkedLine.substr(12);
                //     chunkObject.msg = command + " exited with Status code " + status;
                //     if (status == 0){
                //         dispatch(notify(command + " Succeeded", "Success"))
                //     }
                //     else if (status == 1){
                //         dispatch(notify(command + " Not Found", "Error"))
                //     }
                //     else {
                //         dispatch(notify(command + " Failed", "Error"))
                //     }
                // }
                // dispatch(updateLog(chunkObject));
        //             console.log(chunkObject)
        //     }
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
            return readChunk(reader, dispatch, command, removeRequest, key, runWhenDone, args);
        }
    });
}



export function getDataCenter(url) {
    return(dispatch, getState) => {
        get({
            url: url, 
            success: function(res){
                dispatch(updateValue('nodeList', res.data))
                //TODO: Get the data centers from res.data and assign them to:
                let rawList = []
                rawList = res.data.map((data) => {
                    if(data.dc) {
                        return data.dc
                    }
                });
                let dcList = [...new Set(rawList)]
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

export default {updateData, getDataCenter, writeApi, readChunk, updateValue, appendValue};