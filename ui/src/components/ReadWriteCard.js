import React from "react";
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from 'material-kit-react/components/Card/Card';
import CardHeader from 'material-kit-react/components/Card/CardHeader';
import CardBody from 'material-kit-react/components/Card/CardBody';
import Grid from '@material-ui/core/Grid';

import {writeApi} from '../actions/actions';


const styles = theme => ({
    root: {
        marginTop: '15px',
        marginLeft: '140px',
        width: '89%',
        display: 'flex',
    },
    cardFont: {
        textAlign: 'right',
        fontSize: '24px',
        padding: '7px',
        color: 'white'
    },
    displayBlock: {
        margin: 0,
        width: '100%',
        height: '140px',
        color: 'black',
        border: '2px solid blue',
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
                            <div className={classes.displayBlock}>

                            {/* {this.props.writes} */}

                            </div>
                        </CardBody>
                    </Card>
                </Grid>
            </Grid>
        );

    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        drawerOpen: state.NavigationReducer.drawerOpen,
        page: state.NavigationReducer.page,
        dcList: state.app.dcList,
        writes: state.app.writes
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    init: () => {
        dispatch(getDataCenter('http://52.53.185.6:8080/demo/nodefull'))
        dispatch(writeApi('http://52.53.185.6:8080/demo/write'))
    },

    drawerToggle: (drawerOpen) => {
        dispatch(drawerToggle(drawerOpen))
    },
    changeScreen: (page) => {
        dispatch(changeScreen(page))
        dispatch(drawerToggle(false))
    }
    }
}

const ReadWriteCardContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(ReadWriteCard))
export default ReadWriteCardContainer;