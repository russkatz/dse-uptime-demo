const NavigationReducer = (state = '', action) => {
    switch (action.type) {
        case "CHANGE_SCREEN":
            return {
                ...state,
                page: action.page
            }
        case "DRAWER_TOGGLE":
            return {
                ...state,
                drawerOpen: action.drawerOpen
            }
        case "CLOSE_SNACKBAR":
            return {
                ...state,
                indicatorMsgShown: false
            }
        case "NOTIFY":
            return {
                ...state,
                indicatormsg:action.indicatormsg,
                indicatorMsgShown:action.indicatorMsgShown,
                indicatorType: action.indicatorType
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

export default NavigationReducer