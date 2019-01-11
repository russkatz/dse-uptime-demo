import {connect} from 'react-redux';
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Footer from './Footer';
import MenuContainer from './Menu';
import HomePage from './Homepage'
import SingleLocalNodeFail from './SingleLocalNodeFail';
import DualRemoteNodeFail from './DualRemoteNodeFail';
import TotalLocalDcFail from './TotalLocalDcFail';


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
          <MenuContainer/>
          <Grid>
            {
            this.props.NavigationReducer.page === 'Home' ?
              <HomePage/>
            :
            null
            }
            {
            this.props.NavigationReducer.page === 'Single Local Node Failure' ?
              <SingleLocalNodeFail/>
            :
            null
            }
            {
            this.props.NavigationReducer.page === 'Dual Remote Node Failure' ?
              <DualRemoteNodeFail/>
            :
            null
            }
            {
            this.props.NavigationReducer.page === 'Total Local Data Center Failure' ?
              <TotalLocalDcFail/>
            :
            null
            }
          </Grid>
          <Footer/>
      </MuiThemeProvider>
    );
  }
}


const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);
