import {createAction} from 'redux-actions';
import requestActions from './requestActions.js';
import {get} from '../common/requests.js';

export const updateData = (type, data) => {
    return {
        type: type,
        data: data
    }
}

export default {updateData};
