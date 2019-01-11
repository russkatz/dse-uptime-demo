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
        position: 'fixed',
        marginTop: '94vh'
    },
    footerTitle: {
        margin: 'auto',
    },
    font: {
        fontSize: '18px',
        color: 'white',
    },
    fontSymbol: {
        fontSize: '12px',
        color: 'white',
    },
};

function Footer(props) {
    const { classes } = props;
    return (
        <div className={classes.root}>
            <AppBar className={classes.stickToBottom}>
                <div className={classes.footerTitle}>
                    <Toolbar variant="dense">
                        <Typography className={classes.fontSymbol}>©</Typography>
                        <Typography className={classes.font}>DigitalStax</Typography>
                    </Toolbar>
                </div>
            </AppBar>
        </div>
    );
}

Footer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Footer);