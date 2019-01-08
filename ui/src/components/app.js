import {connect} from 'react-redux';
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


// components
import Menu from './Menu';
import Stepper from './Stepper';
import Dashboard from './Dashboard';

import Footer from './Footer';



const theme = createMuiTheme({
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
        <Grid >
          <Menu/>
          <Stepper />
          <Dashboard />
          <Footer/>
        </Grid>
      </MuiThemeProvider>
    );
  }
}


const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);
