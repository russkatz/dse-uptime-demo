import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Card from 'material-kit-react/components/Card/Card';
import CardBody from 'material-kit-react/components/Card/CardBody';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';


import {drawerToggle} from '../actions/NavigationActions';
import {cardTitle} from 'material-kit-react/assets/jss/material-kit-react';

import classNames from 'classnames';

const drawerWidth = '100%';


const styles = theme => ({
    root: {
        width: '100%',
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
        paddingBottom: 45,
        backgroundColor: '#f4f4f4',
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
    // hide: {
    //     display: 'none',
    // },
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
        height: theme.spacing.unit * 9 + 1,
        [theme.breakpoints.up('sm')]: {
          height: theme.spacing.unit * 5 + 1,
        },
    },
    button: {
        margin: theme.spacing.unit,
    },
    controlContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around',
    },
    button: {
        margin: theme.spacing.unit,
    },
    input: {
        display: 'none',
    },
});


class BottomMenu extends React.Component{
    state = {
        top: false,
        left: false,
        bottom: false,
        right: false,
        };
        
        toggleDrawer = (bottom, open) => () => {
            this.setState({
            [bottom]: open,
            });
        };


    render({classes} = this.props) {

        return (
            <div className={classes.root}>
                <AppBar position="fixed" color="primary" className={classes.appBar} style={{flexDirection: 'row'}}>
                    <Toolbar>
                    <IconButton onClick={() => { this.props.drawerToggle(!this.props.drawerOpen)}} className={classes.menuButton} color="inherit" aria-label="Open drawer">
                        <MenuIcon />
                    </IconButton>
                    <Typography className={classes.title} variant="h6" color="inherit" noWrap>
                    Control Panel
                    </Typography>
                    </Toolbar>
                </AppBar>

                <Drawer
                    anchor="bottom"
                    open={this.state.bottom}
                    onClose={this.toggleDrawer('bottom', false)}
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
                    {/* <div className={classes.toolbar}>
                        <IconButton onClick={() => { this.props.drawerToggle(!this.props.drawerOpen)}}>
                        { !this.props.drawerOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </div> */}
                    {/* <Divider /> */}
                    <Paper square className={classes.paper}>
                        <div className={classes.controlContainer}>
                            <Card style={{width: "20rem"}}>
                                <CardBody style={{whiteSpace: 'normal'}}>
                                <h4 className={classes.cardTitle}>PURCHASE DATA</h4>
                                <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pharetra vitae sem sed mattis.
                                </p>
                                <Button color="default" variant="contained" color="default" className={classes.button}>START</Button>
                                <Button color="primary" variant="contained" color="primary" className={classes.button}>STOP</Button>
                                </CardBody>
                            </Card>
                            <Card style={{width: "20rem"}}>
                                <CardBody style={{whiteSpace: 'normal'}}>
                                <h4 className={classes.cardTitle}>EVENTS DATA</h4>
                                <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pharetra vitae sem sed mattis.
                                </p>
                                <Button color="default" variant="contained" color="default" className={classes.button}>START</Button>
                                <Button color="primary" variant="contained" color="primary" className={classes.button}>STOP</Button>
                                </CardBody>
                            </Card>
                            <Card style={{width: "20rem"}}>
                                <CardBody style={{whiteSpace: 'normal'}}>
                                <h4 className={classes.cardTitle}>EVENTS DATA</h4>
                                <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pharetra vitae sem sed mattis.
                                </p>
                                <Button color="default" variant="contained" color="default" className={classes.button}>START</Button>
                                <Button color="primary" variant="contained" color="primary" className={classes.button}>STOP</Button>
                                </CardBody>
                            </Card>
                            <Card style={{width: "20rem"}}>
                                <CardBody style={{whiteSpace: 'normal'}}>
                                <h4 className={classes.cardTitle}>EVENTS DATA</h4>
                                <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pharetra vitae sem sed mattis.
                                </p>
                                <Button color="default" variant="contained" color="default" className={classes.button}>START</Button>
                                <Button color="primary" variant="contained" color="primary" className={classes.button}>STOP</Button>
                                </CardBody>
                            </Card>

                        </div>
                    </Paper>
                </Drawer>
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
        page: state.NavigationReducer.page
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

const BottomMenuContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(BottomMenu))
export default BottomMenuContainer