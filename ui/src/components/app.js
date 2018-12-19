import {connect} from 'react-redux';
import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';


// components
import Menu from './Menu';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


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
        <Grid>
          <Menu/>
        </Grid>
      </MuiThemeProvider>
    );
  }
}


const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);
