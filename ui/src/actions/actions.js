import {createAction} from 'redux-actions';
import requestActions from './requestActions.js';
import {get} from '../common/requests.js';


export function getDataCenter(url) {
    return(dispatch, getState) => {
        get({
            url: url, 
            success: function(res){
                dispatch(updateData('dc', res.data))
            },
            dispatch: dispatch
        });
    }
}

export const updateData = (type, data) => {
    return {
        type: type,
        data: data
    }
}

export default {updateData, getDataCenter};
