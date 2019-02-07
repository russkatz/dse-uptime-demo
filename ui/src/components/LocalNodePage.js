import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dashboard from './Dashboard';
import WriteCard from './WriteCard';
import ReadCard from './ReadCard';
import DataCenterMap from './DataCenterMap';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paperdash: {
        boxShadow: '0px 5px 25px 0px rgba(0,0,0,0.2), 0px 8px 8px 0px rgba(0,0,0,0.14), 0px 10px 1px -2px rgba(0,0,0,0.12)',
        minHeight: '325px',
        padding: '20px',
        margin: '10px'
    },
    papercard: {
        boxShadow: '0px 5px 25px 0px rgba(0,0,0,0.2), 0px 8px 8px 0px rgba(0,0,0,0.14), 0px 10px 1px -2px rgba(0,0,0,0.12)',
        margin: '0 10px 10px 10px',
    }
});


class LocalNodePage extends Component {
    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Grid container justify='center' spacing={24}>
                    <Grid item xs={12}>
                        <Paper className={classes.paperdash}>
                            <Dashboard />
                            {/* <DataCenterMap /> */}
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Paper className={classes.papercard}>
                            <WriteCard />
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Paper className={classes.papercard}>
                            <ReadCard />
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(LocalNodePage);