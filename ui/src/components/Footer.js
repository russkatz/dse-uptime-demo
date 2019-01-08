import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';


const styles = {
    root: {
    flexGrow: 1,
    },
    stickToBottom: {
        position: 'static',
        // bottom: "0",
        height: 47,
        margin: '4vh 0 0 0',
    },
};

function Footer(props) {
    const { classes } = props;
    return (
        <div className={classes.root}>
            <AppBar className={classes.stickToBottom}>
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit">@DigitalStax</Typography>
                </Toolbar>
            </AppBar>
        </div>
    );
}

Footer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Footer);