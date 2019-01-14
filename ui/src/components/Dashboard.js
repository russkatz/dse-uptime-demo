import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import {getDataCenter} from '../actions/actions'


const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
});

let id = 0;
function createData(name, normal, medium, high, down) {
    id += 1;
    return { id, name, normal, medium, high, down };
}

const rows = [
    createData('AWS', 3, 2, 0, 0),
    createData('Azure', 5, 0, 0, 0),
    createData('GCP', 4, 1, 0, 0),
    createData('Onprem-DC1', 3, 0, 2, 0),
];



class Dashboard extends React.Component {
    componentDidMount() {
        this.props.init();
    }
    render (
        { classes } = this.props
    ){
    return (
        <div className={classes.root}>
            <Paper style={{ backgroundColor: 'white', width: '65%', padding: '50px 30px 30px 30px', margin: '0 auto'}}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>DATA CENTER</TableCell>
                            <TableCell align="right">NORMAL</TableCell>
                            <TableCell align="right">MEDIUM</TableCell>
                            <TableCell align="right">HIGH</TableCell>
                            <TableCell align="right">DOWN</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(row => {
                            return (
                            <TableRow key={row.id}>
                                <TableCell component="th" scope="row">
                                {row.name}
                                </TableCell>
                                <TableCell align="right">{row.normal}</TableCell>
                                <TableCell align="right">{row.medium}</TableCell>
                                <TableCell align="right">{row.high}</TableCell>
                                <TableCell align="right">{row.down}</TableCell>
                            </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Paper>
        </div>
    );
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
        dispatch(getDataCenter('http://52.53.185.6:8080/demo/dc'))
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

const DashboardContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Dashboard))
export default DashboardContainer
