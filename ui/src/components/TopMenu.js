import React from 'react';
import {connect} from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import {drawerToggle, changeScreen} from '../actions/NavigationActions'


const styles = theme => ({
    root: {
        width: '100%',
        display: 'flex',
    },
    logo: {
        flex: 1,
        margin: 0,
    },
    title: {
        flex: 1,
        textAlign: 'right',
        color: 'white',
    },
    subtitle: {
        marginBottom: '10px',
    },
});


class TopMenu extends React.Component {
    render() {
        const { classes } = this.props;

        return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <div className={classes.logo}>
                        <img style={{height: '100px'}}src={require('../images/logo.png')} />
                    </div>
                    <Typography className={classes.title} variant="h4" color="inherit" noWrap>
                    CHAOS IN THE CLOUDS
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    );
    }

    componentDidMount(){
        this.props.init()
    }
    }

    const mapStateToProps = (state, ownProps) => {
    return {
        drawerOpen: state.NavigationReducer.drawerOpen,
        page: state.NavigationReducer.page,
    }
    }

    const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        init: () => {
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

const TopMenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TopMenu))
export default TopMenuContainer