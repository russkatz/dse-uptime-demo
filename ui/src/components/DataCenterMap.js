import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';



const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    }
});


const DataCenterMap = (props) => {
    const { classes } = props;

    return (
        <div className={classes.root}>
            <Paper style={{ backgroundColor: 'white', width: '70%', height: '500px', margin: '0 auto'}}>
                <img style={{ width: '100%' }} src={require('../images/worldmap.png')} />
            </Paper>
        </div>
    );
};

export default withStyles(styles)(DataCenterMap);