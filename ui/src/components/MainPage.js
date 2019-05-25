import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dashboard from './Dashboard';
import WriteCard from './WriteCard';
import ReadCard from './ReadCard';
import EventsCard from './EventsCard';
import DataCenterMap from './DataCenterMap';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';


class MainPage extends Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={"gridroot"}>
                <Grid container justify='center' >
                    <Grid item xs={12}>
                        <Paper className={"paperdash"}>
                            <Dashboard />
                            {/* <DataCenterMap /> */}
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Paper className={"papercard"}>
                            <WriteCard />
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Paper className={"papercard"}>
                            <ReadCard />
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Paper className={"papercard"}>
                            <EventsCard />
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default (MainPage);
