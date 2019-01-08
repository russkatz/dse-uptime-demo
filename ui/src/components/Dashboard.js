import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 11,
        overflowX: 'auto',
    },
    table: {
        width: '60%',
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
    // createData('Gingerbread', 356, 16.0, 49, 3.9),
];

function SimpleTable(props) {
    const { classes } = props;

    return (
        <Paper className={classes.root}>
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
    );
}

SimpleTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);