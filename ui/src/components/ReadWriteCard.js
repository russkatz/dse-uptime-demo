import React from "react";
import { withStyles } from '@material-ui/core/styles';
import Card from 'material-kit-react/components/Card/Card';
import CardHeader from 'material-kit-react/components/Card/CardHeader';
import CardBody from 'material-kit-react/components/Card/CardBody';
import Grid from '@material-ui/core/Grid';


const styles = theme => ({
    root: {
        flexGrow: 1,
        justifyContent: 'center',
    },
});

class ReadWriteCard extends React.Component {

    render() {
    const { classes } = this.props;
        return (
            <Grid container 
            className={classes.root} 
            style={{marginTop: '40px'}}
            >
                <Grid item xs={4}>
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
                <Grid item xs={4}>
                    <Grid container>
                        <Card style={{width: "20rem"}}>
                            <CardHeader color="warning">ROWS READ</CardHeader>
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