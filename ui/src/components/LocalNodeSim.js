import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Stepper from './Stepper';
import DashboardContainer from './Dashboard';
import ReadWriteCard from './ReadWriteCard';
import DataCenterMap from './DataCenterMap'
// import Footer from './Footer';

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

class LocalNodeSim extends Component {
    render() {


        return (
            <MuiThemeProvider theme={theme}>
                <div style={{width: '100%', marginLeft: '40px'}}>
                    {/* <Stepper /> */}
                    <DashboardContainer />
                    {/* <DataCenterMap /> */}
                    <ReadWriteCard />
                </div>
                <Stepper />
            </MuiThemeProvider>
        );
    }
}

export default LocalNodeSim;