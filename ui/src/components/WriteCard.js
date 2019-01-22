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
        display: 'flex',
    },
    card: {
        marginBottom: 0,
        display: 'flex'
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
        overflow: 'scroll',
        padding: '4px',
        marginLeft: '10px',
        fontSize: '12px'
    }
});

class WriteCard extends React.Component {
    componentDidMount() {
        this.props.init();
    }
    render() {
    const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Card className={classes.card}>
                    <CardHeader className={classes.cardheader}>PURCHASES</CardHeader>
                    <CardBody className={classes.cardbody}>
                    <div className={classes.cardtext}>
                    {JSON.stringify(this.props.writes)}
                    </div>
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
        // dispatch(getDataCenter('http://52.53.185.6:8080/demo/nodefull'))
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

const WriteCardContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(WriteCard))
export default WriteCardContainer;