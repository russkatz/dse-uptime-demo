import React, {PureComponent} from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Stepper from './Stepper';
import Dashboard from './Dashboard';
import ReadWriteCard from './ReadWriteCard';

export default class HomePage extends PureComponent {

    render() {
        return (
            <Paper className="paper" elevation={1}>
            <div className="container">
            <Typography variant="h6" color="inherit" noWrap>
                Dual Remote Node Failure
            </Typography>
            </div>
            <Grid>
                <Stepper />
                <Dashboard />
                <ReadWriteCard />
            </Grid>
            </Paper>
        );
    }
}