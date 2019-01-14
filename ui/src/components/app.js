import {connect} from 'react-redux';
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import MenuContainer from './Menu';
import SingleLocalNodeFail from './LocalNodeSim';
import DualRemoteNodeFail from './RemoteNodeSim';
import TotalLocalDcFail from './LocalDataCenterSim';
import CustomSim from './CustomSim'


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
            this.props.NavigationReducer.page === 'Local Node Simulation' ?
              <SingleLocalNodeFail/>
            :
            null
            }
            {
            this.props.NavigationReducer.page === 'Remote Node Simulation' ?
              <DualRemoteNodeFail/>
            :
            null
            }
            {
            this.props.NavigationReducer.page === 'Local Data Center Simulation' ?
              <TotalLocalDcFail/>
            :
            null
            }
                        {
            this.props.NavigationReducer.page === 'Custom Event Simulation' ?
              <CustomSim />
            :
            null
            }
          </Grid>
      </MuiThemeProvider>
    );
  }
}


const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);
