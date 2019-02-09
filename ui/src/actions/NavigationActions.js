import {get} from '../common/requests'

export const changeScreen = (page) => {
    window.sessionStorage.setItem("page", page)
    return {
        type: "CHANGE_SCREEN",
        page: page
    }
}

export const drawerToggle = (drawerOpen) => {
    return {
        type: "DRAWER_TOGGLE",
        drawerOpen: drawerOpen
    }
}

export const handleSnackBarClose = () => {
    return {
        type: "CLOSE_SNACKBAR",
    }
}

export const notify = (msg, type) => {
    return {
        type: "NOTIFY",
        indicatormsg: msg,
        indicatorMsgShown: true,
        indicatorType: type
    }
}
