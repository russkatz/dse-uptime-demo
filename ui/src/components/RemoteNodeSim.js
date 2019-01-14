import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Stepper from './Stepper';
import ReadWriteCard from './ReadWriteCard';
import DataCenterMap from './DataCenterMap';
import DashboardContainer from './Dashboard';


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

class HomePage extends Component {
    render() {


        return (
            <MuiThemeProvider theme={theme}>
                <div style={{width: '100%', marginLeft: '40px'}}>
                    <DashboardContainer />
                    {/* <DataCenterMap /> */}
                    <ReadWriteCard />
                </div>
                <Stepper />
            </MuiThemeProvider>
        );
    }
}

export default HomePage;