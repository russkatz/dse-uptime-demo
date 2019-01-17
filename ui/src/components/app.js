import {connect} from 'react-redux';
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import MenuContainer from './Menu';
import CustomSim from './CustomSim'
import LocalNodeSim from './LocalNodeSim';
import RemoteNodeSim from './RemoteNodeSim'
import LocalDataCenterSim from './LocalDataCenterSim';
import BottomMenu from './BottomMenu';


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
              <LocalNodeSim />
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
          </Grid>
          <BottomMenu />
      </MuiThemeProvider>
    );
  }
}


const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);
