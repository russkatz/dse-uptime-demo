import React, {PureComponent} from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';


export default class HomePage extends PureComponent {

    render() {
        return (
            <Paper className="paper" elevation={1}>
            <div className="container">
            <Typography variant="h6" color="inherit" noWrap>
                Single Local Node Failure
            </Typography>
            </div>
            </Paper>
        );
    }
}