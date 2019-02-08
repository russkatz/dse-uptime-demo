import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import {getNodeInfo, writeApi, getDataCenter} from '../actions/actions'


const styles = theme => ({
    root: {
        overflowX: 'auto',
    },
    tablecell: {
        fontSize: '45px',
    },
});

class Dashboard extends React.Component {
    componentDidMount() {
        this.props.init();
    }


    render ({ classes } = this.props){
        let dataCenterDetails = []

        let nodeList = this.props.nodeList
        nodeList.map((node, id) => {
            if (node.mode === null) {
                var oldNodeList = this.props.oldNodeList

                if (oldNodeList === undefined || oldNodeList[id] === undefined) {
                    return node
                }
                if (oldNodeList[id].mode === 'starting') {
                    node.mode = 'starting'
                }
                return node
            } 
        })

        nodeList.map((node, id) => {
            let newDcDetail = {};
            newDcDetail.name = node.dc
            let nodeCondition = ['normal', 'starting', null];
            let nodeConditionName = ['countUp', 'starting', 'countDown'];

            if (dataCenterDetails.length === 0 ){
                nodeCondition.map((value, index) => {
                    if (node.mode === value) {
                        newDcDetail[nodeConditionName[index]] = 1;
                    } else {
                        newDcDetail[nodeConditionName[index]] = 0;
                    }
                }) 
                dataCenterDetails.push(newDcDetail)
            } else {
                let dcIsMissing = true;
                dataCenterDetails.map(detail => {
                    if (detail.name === node.dc) {
                        dcIsMissing = false;
                        nodeCondition.map((value, index) => {
                            if (node.mode === value) {
                                detail[nodeConditionName[index]] = detail[nodeConditionName[index]] + 1
                            } else {
                                detail[nodeConditionName[index]] = detail[nodeConditionName[index]]
                            }
                        })
                    }
                })
                if (dcIsMissing) {
                    // debugger
                    nodeCondition.map((value, index) => {
                        if (node.mode === value) {
                            newDcDetail[nodeConditionName[index]] = 1;
                        } else {
                            newDcDetail[nodeConditionName[index]] = 0;
                        }
                    }) 
                    dataCenterDetails.push(newDcDetail)
                    
                }
            }
        })
        
        return (
            <div className={classes.root}>
                <Table className={classes.table}>
                    <TableHead style={{backgroundColor: 'silver'}}>
                        <TableRow>
                            <TableCell className={classes.tablecell} style={{color: 'black', fontSize: '25px'}}>DATA CENTER</TableCell>
                            <TableCell className={classes.tablecell} style={{color: 'black', fontSize: '25px'}} align='center'>ONLINE</TableCell>
                            <TableCell className={classes.tablecell} style={{color: 'black', fontSize: '25px'}} align='center'>STARTING</TableCell>
                            <TableCell className={classes.tablecell} style={{color: 'black', fontSize: '25px'}} align='center'>OFFLINE</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataCenterDetails.map ((detail, id) => {
                            return (
                                <TableRow key={id}>
                                    <TableCell style={{fontSize: '30px', color: 'gray'}} className={classes.tablecell}>{detail.name}</TableCell>
                                    <TableCell style={{color: 'limegreen'}} className={classes.tablecell} align='center'>{detail.countUp}</TableCell>
                                    <TableCell style={{color: '#ffc966'}} className={classes.tablecell} align='center'>{detail.starting}</TableCell>
                                    <TableCell style={{color: 'red'}} className={classes.tablecell} align='center'>{detail.countDown}</TableCell>
                                </TableRow>
                                )
                            })}
                    </TableBody>
                </Table>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        drawerOpen: state.NavigationReducer.drawerOpen,
        page: state.NavigationReducer.page,
        nodeList: state.app.nodeList,
        oldNodeList: state.app.oldNodeList,
        dcList: state.app.dcList,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    init: () => {
        dispatch(getNodeInfo('http://52.53.185.6:8080/demo/nodefull'))
        // dispatch(getDataCenter('http://52.53.185.6:8080/demo/nodefull'))
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
