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
        minHeight: '350px',
        padding: theme.spacing.unit * 2,
        margin: '10px 10px 0 10px'
        },
    papercard: {
        margin: '0 10px 10px 10px',
    }
});


class LocalNodePage extends Component {
    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Grid container spacing={24}>
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