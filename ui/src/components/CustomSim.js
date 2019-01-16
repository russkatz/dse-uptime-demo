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

class CustomSim extends Component {
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <div style={{width: '100%', marginLeft: '40px'}}>
                    <DashboardContainer />
                    {/* <DataCenterMap /> */}
                    <ReadWriteCard />
                </div>
            </MuiThemeProvider>
        );
    }
}

export default CustomSim;