import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import DashboardContainer from './Dashboard';
import ReadWriteCard from './ReadWriteCard';
import DataCenterMap from './DataCenterMap';

const theme = createMuiTheme({
    root: {
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

class LocalDataCenterSim extends Component {
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <div style={{width: '100%'}}>
                    <DashboardContainer />
                    {/* <DataCenterMap /> */}
                    <ReadWriteCard />
                </div>
            </MuiThemeProvider>
        );
    }
}

export default LocalDataCenterSim;