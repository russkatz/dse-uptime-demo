const RequestReducer = (state = '', action) => {
    switch (action.type) {
        case "ADD_REQUEST":
            return {
                ...state,
                requests: {
                    ...state.requests,
                    [action.key]: action.request
                }
            }
            return state
        case "REMOVE_REQUEST":
            var requestCopy = state.requests
            delete requestCopy[action.key]

            return {
                ...state,
                requests: requestCopy
            }
        case "LOADER_TOGGLE":
            return {
                ...state,
                indicatorShown:action.indicatorShown
            }
        default:
            return state
    }
}

export default RequestReducer
