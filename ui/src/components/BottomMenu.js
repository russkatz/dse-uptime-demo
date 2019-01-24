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
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';


import {drawerToggle} from '../actions/NavigationActions';
import { writeApi, readApi } from '../actions/actions';

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
    controlContainer: {
        width: '100%',
        display: 'flex',
        marginBottom: '20px',
        // justifyContent: 'space-around',
    },
    card: {
        width: '20rem',
        marginTop: '10px',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
        whiteSpace: 'normal',
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

        render() {
            const { classes } = this.props;

        return (
            <div className={classes.root}>
                <AppBar position="fixed" color="primary" className={classes.appBar} style={{flexDirection: 'row'}}>
                    <Toolbar>
                    <IconButton onClick={() => { this.props.drawerToggle(!this.props.drawerOpen)}} className={classes.menuButton} color="inherit" aria-label="Open drawer">
                        <MenuIcon />
                    </IconButton>
                    <Typography className={classes.title} variant="h5" component="h2" color="textPrimary" color="inherit" noWrap>
                    CONTROL CONSOLE
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
                    <Paper square className={classes.paper}>
                        <div className={classes.controlContainer}>
                            <Card className={classes.card}>
                                <CardContent>
                                    <Typography variant="h5" component="h2" color="textPrimary" gutterBottom>
                                        PURCHASES DATA
                                    </Typography>
                                    <Typography className={classes.pos} color="textSecondary">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                <Button variant="contained" color="default" className={classes.button} size="small" onClick={() => {this.props.getWrites()}}>BEGIN PURCHASE TRANSACTIONS</Button>
                                </CardActions>
                            </Card>
                            <Card className={classes.card}>
                                <CardContent>
                                    <Typography variant="h5" component="h2" color="textPrimary" gutterBottom>
                                        EVENTS DATA
                                    </Typography>
                                    <Typography className={classes.pos} color="textSecondary">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                <Button variant="contained" color="default" className={classes.button} size="small" onClick={() => {this.props.getReads()}}>BEGIN EVENT TRANSACTIONS</Button>
                                </CardActions>
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
        page: state.NavigationReducer.page,
        writes: state.app.writes,
        reads: state.app.reads,
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