import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
// import Snackbar from '@material-ui/core/Snackbar';


import {drawerToggle} from '../actions/NavigationActions';
import { writeApi, readApi, dropOneNode, dropOneDataCenter, resetAllNodes, snackbarToggle } from '../actions/actions';

import classNames from 'classnames';

const drawerWidth = '100%';

const styles = theme => ({
    root: {
    },
    grow: {
        flexGrow: 1,
    },
    text: {
        paddingTop: theme.spacing.unit * 4,
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2,
    },
    paper: {
        height: '80px',
        paddingTop: '15px',
        paddingBottom: '50px',
        backgroundColor: 'white',
    },
    appBar: {
        top: 'auto',
        bottom: 0,
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['height', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
        }),
    },
    menuButton: {
        marginLeft: 0,
        marginRight: 28,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        height: theme.spacing.unit * 7 + 1,
        [theme.breakpoints.up('sm')]: {
          height: theme.spacing.unit * 4 + 1,
        },
    },
    controlContainer: {
        width: '100%',
        display: 'flex',
        marginBottom: '20px',
        justifyContent: 'space-between',
    },
    button: {
        margin: theme.spacing.unit,
        color: 'secondary',
    },
    warning: {
        backgroundColor: 'red',
    },

});


class BottomMenu extends React.Component{

        render() {
            const { classes } = this.props;  
            return (
                <div className={classes.root}>
                    <AppBar position="fixed" color="primary" className={classes.appBar} style={{flexDirection: 'row'}}>
                        <Toolbar>
                        <IconButton onClick={() => { this.props.drawerToggle(!this.props.drawerOpen)}} className={classes.menuButton} color="default" aria-label="Open drawer">
                            <MenuIcon />
                        </IconButton>
                        <Typography className={classes.title} variant="h5" component="h2" color="default" noWrap>
                        CONTROLS
                        </Typography>
                        </Toolbar>
                    </AppBar>

                    <Drawer
                        anchor="bottom"
                        variant="permanent"
                        className={classNames(classes.drawer, {
                            [classes.drawerOpen]: this.props.drawerOpen,
                            [classes.drawerClose]: !this.props.drawerOpen,
                        })}
                        classes={{
                            paper: classNames({
                            [classes.drawerOpen]: this.props.drawerOpen,
                            [classes.drawerClose]: !this.props.drawerOpen,
                            }),
                        }}
                        open={this.props.drawerOpen}
                        >
                        <Paper square className={classes.paper}>
                            <div className={classes.controlContainer}>
                                <Button variant="contained" color="secondary" className={classes.button} size="large" onClick={() => {this.props.getWrites()}}>START PURCHASES</Button>

                                <Button variant="contained" color="secondary" className={classes.button} size="large" onClick={() => {this.props.getReads()}}>START READS</Button>

                                <Button variant="contained" color="secondary" className={classes.button} size="large" onClick={() => {this.props.dropOneNode()}}>DROP ONE NODE</Button>

                                <Button variant="contained" color="secondary" className={classes.button} size="large" onClick={() => {this.props.dropOneDataCenter()}}>DROP DATACENTER</Button>

                                <Button variant="contained" color="secondary" className={classes.button} size="large" onClick={() => {this.props.resetAllNodes()}}>RESET DOWN NODES</Button>
                            </div>
                        </Paper>
                    </Drawer>
                    {/* <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={this.props.snackbarOpen}
                    onClose={() => this.props.snackbarToggle(!this.props.snackbarOpen)}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{this.props.events}</span>}
                    /> */}
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
        writes: state.app.writes,
        reads: state.app.reads,
        snackbarOpen: state.app.snackbarOpen
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        init: () => {

        },
        getWrites: () => {
            dispatch(writeApi('http://52.53.185.6:8080/demo/write'))
        },
        getReads: () => {
            dispatch(readApi('http://52.53.185.6:8080/demo/read'))
        },
        dropOneNode: () => {
            dispatch(dropOneNode())
        },
        dropOneDataCenter: () => {
            dispatch(dropOneDataCenter())
        },
        resetAllNodes: () => {
            dispatch(resetAllNodes())
        },
        drawerToggle: (drawerOpen) => {
            dispatch(drawerToggle(drawerOpen))
        },
        snackbarToggle: () => {
            dispatch(snackbarToggle())
        },
        changeScreen: (page) => {
            dispatch(changeScreen(page))
            dispatch(drawerToggle(false))
        }
    }
}

const BottomMenuContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(BottomMenu))
export default BottomMenuContainer