import React from "react";
import { withStyles } from '@material-ui/core/styles';
import cardTitle from 'material-kit-react/assets/jss/material-kit-react';
import Card from 'material-kit-react/components/Card/Card';
import CardHeader from 'material-kit-react/components/Card/CardHeader';
import CardBody from 'material-kit-react/components/Card/CardBody';
import Grid from '@material-ui/core/Grid';


const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        height: 140,
        width: 100,
    },
    control: {
        padding: theme.spacing.unit * 2,
    },
});

class ReadWriteCard extends React.Component {

    state = {
        spacing: '16',
    };

    render() {
    const { classes } = this.props;
    const { spacing } = this.state;
        return (
            <Grid container className={classes.root} spacing={16}>
                <Grid item xs={6}>
                    <Grid container>
                        <Card style={{width: "20rem"}}>
                            <CardHeader color="primary">ROWS WRITTEN</CardHeader>
                            <CardBody>
                                <h4>**dc**</h4>
                                <h4>**timestamp**</h4>
                            </CardBody>
                        </Card>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Grid container>
                        <Card style={{width: "20rem"}}>
                            <CardHeader color="warning">ROWS WRITTEN</CardHeader>
                            <CardBody>
                                <h4>**dc**</h4>
                                <h4>**timestamp**</h4>
                            </CardBody>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        );

    }
}



export default withStyles(styles)(ReadWriteCard);