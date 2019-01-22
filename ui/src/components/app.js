import {connect} from 'react-redux';
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import MenuContainer from './TopMenu';
import LocalNodePage from './LocalNodePage';
import BottomMenuContainer from './BottomMenu';


const theme = createMuiTheme({
    root: {
        height: '100vh',
    },
    typography: {
        useNextVariants: true,
    },
    palette: {
        primary: {
        main: '#1AB5E0',
        },
        secondary: {
        main: '#ca5f14',
        },
    },
});

class App extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        this.props.app.engine.unregisterCallbacks();
    }

    render() {
        return (
        <MuiThemeProvider theme={theme}>
            <MenuContainer />
            <LocalNodePage />
            {/* <Grid>
                {
                this.props.NavigationReducer.page === 'Local Node Page' ?
                <LocalNodePage />
                :
                null
                }
                {
                this.props.NavigationReducer.page === 'Remote Node Simulation' ?
                <RemoteNodeSim />
                :
                null
                }
                {
                this.props.NavigationReducer.page === 'Local Data Center Simulation' ?
                <LocalDataCenterSim />
                :
                null
                }
                {
                this.props.NavigationReducer.page === 'Custom Event Simulation' ?
                <CustomSim />
                :
                null
                }
            </Grid> */}
            <BottomMenuContainer />
        </MuiThemeProvider>
        );
    }
}


const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);