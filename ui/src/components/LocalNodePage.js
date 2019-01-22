import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import DashboardContainer from './Dashboard';
import ReadWriteCard from './ReadWriteCard';
import DataCenterMap from './DataCenterMap';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
    root: {
        flexGrow: 1,
        },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        marginTop: '20px',
        },
});


class LocalNodePage extends Component {
    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <DashboardContainer />
                            {/* <DataCenterMap /> */}
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Paper className={classes.paper}>
                            <ReadWriteCard />
                        </Paper>
                    </Grid>

                    {/* <Grid item xs={12} sm={6}>
                        <Paper className={classes.paper}>
                            <ReadWriteCard />
                        </Paper>
                    </Grid> */}
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(LocalNodePage);