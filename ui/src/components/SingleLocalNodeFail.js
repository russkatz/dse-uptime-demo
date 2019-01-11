import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Stepper from './Stepper';
import Dashboard from './Dashboard';
import ReadWriteCard from './ReadWriteCard';

const theme = createMuiTheme({
    root: {
        width: '100%',
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
    render () {
        return (
            <MuiThemeProvider theme={theme}>
                <Grid>
                    <Stepper />
                    <Dashboard />
                    <ReadWriteCard />
                </Grid>
            </MuiThemeProvider>
        );
    }
}

export default HomePage;