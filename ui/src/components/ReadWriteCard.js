import React from "react";
import { withStyles } from '@material-ui/core/styles';
import Card from 'material-kit-react/components/Card/Card';
import CardHeader from 'material-kit-react/components/Card/CardHeader';
import CardBody from 'material-kit-react/components/Card/CardBody';
import Grid from '@material-ui/core/Grid';


const styles = theme => ({
    root: {
        marginTop: '15px',
        marginLeft: '140px',
        width: '89%',
    },
    cardFont: {
        textAlign: 'right',
        fontSize: '24px',
        padding: '7px',
        color: 'white'
    }

});

class ReadWriteCard extends React.Component {

    

    render() {
    const { classes } = this.props;
        return (
            <Grid container className={classes.root}>
                <Grid item xs={6}>
                    <Card style={{width: "39rem", marginBottom: "12px"}}>
                        <CardHeader style={{backgroundColor: '#4fc3f7'}} className={classes.cardFont}>PURCHASES</CardHeader>
                        <CardBody style={{height: "150px"}}>
                            <h4>...purchase data will load here</h4>
                        </CardBody>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card style={{width: "39rem", marginBottom: "12px"}}>
                        <CardHeader style={{backgroundColor: '#4fc3f7'}} className={classes.cardFont}>EVENT LOG</CardHeader>
                        <CardBody style={{height: "150px"}}>
                            <h4>...event logging data will load here</h4>
                        </CardBody>
                    </Card>
                </Grid>
            </Grid>
        );

    }
}



export default withStyles(styles)(ReadWriteCard);