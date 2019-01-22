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

    },
    card: {
        marginBottom: 0,
    },
    cardheader: {
        backgroundColor: 'lightgrey',
        fontSize: '25px',
        color: 'white',
        padding: '10px',
        textAlign: 'right'
    },
    cardbody: {
        padding: '10px',
    },
    cardtext: {
        height: '150px',
        border: '2px solid blue'
    }
});

class ReadCard extends React.Component {
    render() {
    const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Card className={classes.card}>
                    <CardHeader className={classes.cardheader}>EVENT LOG</CardHeader>
                    <CardBody className={classes.cardbody}>
                    <p className={classes.cardtext}>
                    {/* {this.props.writes} */}
                    </p>
                    </CardBody>
                </Card>
            </div>
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

const ReadCardContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(ReadCard))
export default ReadCardContainer;