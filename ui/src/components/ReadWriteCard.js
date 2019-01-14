import React from "react";
import { withStyles } from '@material-ui/core/styles';
import Card from 'material-kit-react/components/Card/Card';
import CardHeader from 'material-kit-react/components/Card/CardHeader';
import CardBody from 'material-kit-react/components/Card/CardBody';
import Grid from '@material-ui/core/Grid';


const styles = theme => ({
    root: {
        marginTop: '10px',
        marginLeft: '30px',
        width: '95%',
    },
    cardFont: {
        textAlign: 'right',
        fontSize: '24px',
        padding: '7px',
    }
});

class ReadWriteCard extends React.Component {

    render() {
    const { classes } = this.props;
        return (
            <Grid container className={classes.root}>
                <Grid item xs={6}>
                    <Card style={{width: "45rem"}}>
                        <CardHeader color="primary" className={classes.cardFont}>PURCHASES</CardHeader>
                        <CardBody>
                            <h4>**dc**</h4>
                            <h4>**timestamp**</h4>
                        </CardBody>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card style={{width: "45rem"}}>
                        <CardHeader color="warning" className={classes.cardFont}>EVENT LOG</CardHeader>
                        <CardBody>
                            <h4>**dc**</h4>
                            <h4>**timestamp**</h4>
                        </CardBody>
                    </Card>
                </Grid>
            </Grid>
        );

    }
}



export default withStyles(styles)(ReadWriteCard);