import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
  root: {
    width: '100%',
    display: 'flex',
  },
  logo: {
    flex: 1,
  },
  title: {
    flex: 1,
    textAlign: 'right',
  },
});


function TopMenu(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <div className={classes.logo}>
              <img style={{height: '80px'}}src={require('../images/logo.png')} />
          </div>
          <Typography className={classes.title} variant="h4" color="inherit" noWrap>
            CHAOS IN THE CLOUDS
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default withStyles(styles)(TopMenu);