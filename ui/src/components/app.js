import {connect} from 'react-redux';
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


// components
import Stepper from './Stepper';
import Dashboard from './Dashboard';
import ReadWriteCard from './ReadWriteCard';
import Footer from './Footer';
import MenuContainer from './Menu';
import HomePage from './Homepage'
import SingleLocalNodeFail from './SingleLocalNodeFail';
import DualLocalNodeFail from './DualLocalNodeFail';



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
        <Grid container justify="center">
          <MenuContainer/>
          <Grid className="basepage">
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
        this.props.NavigationReducer.page === 'Dual Local Node Failure' ?
          <DualLocalNodeFail/>
        :
        null
        }
        </Grid>
          <Stepper />
          <Dashboard />
          <ReadWriteCard />
        </Grid>
          <Footer/>
      </MuiThemeProvider>
    );
  }
}


const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);
