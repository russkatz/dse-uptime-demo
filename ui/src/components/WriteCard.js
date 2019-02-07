import React from "react";
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from 'material-kit-react/components/Card/Card';
import CardHeader from 'material-kit-react/components/Card/CardHeader';
import CardBody from 'material-kit-react/components/Card/CardBody';


const styles = theme => ({
    cardheader: {
        backgroundColor: 'silver',
        fontSize: '30px',
        color: 'black',
        textAlign: 'center',
    },
    cardbody: {
        padding: '0 0 0 45px',
        marginLeft: '7px'
    },
    cardtext: {
        height: '260px',
        overflow: 'scroll',
        fontSize: '20px',
        margin: '5px 5px 20px 5px',
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
                    <CardHeader className={classes.cardheader} style={{height: '50px', paddingTop: '20px'}}>PURCHASE TRANSACTIONS</CardHeader>
                    <CardBody className={classes.cardbody}>
                    <div className={classes.cardtext} style={{color: "blue"}}>
                    
                    {JSON.stringify([...this.props.writes].reverse())}
                    
                    </div>
                    </CardBody>
                </Card>
            </div>
        );

    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        writes: state.app.writes
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    init: () => {
    },
    }
}

const WriteCardContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(WriteCard))
export default WriteCardContainer;