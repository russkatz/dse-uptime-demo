export const addRequest = (key, request) => {
    return (dispatch, getState) => {
        dispatch({
            type: "ADD_REQUEST",
            key: key,
            request: request
        })
        if(!getState().RequestReducer.indicatorShown)
            dispatch(loadingToggle(true))
    }

}
export const removeRequest = (key) => {
    return (dispatch, getState) => {
        dispatch({
            type: "REMOVE_REQUEST",
            key: key
        })
        if(!Object.keys(getState().RequestReducer.requests).length)
            dispatch(loadingToggle(false))
    }
}
export const loadingToggle = (indicatorShown) => {
    return {
        type: "LOADER_TOGGLE",
        indicatorShown: indicatorShown
    }
}
