import React from "react";
import ShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import MoneyIcon from '@material-ui/icons/AttachMoney';
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
        margin: '0 auto'
    },
    cardtext: {
        height: '260px',
        overflow: 'scroll',
        fontSize: '22px',
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
                    <div className={classes.cardtext}>
                    
                    {
                        [...this.props.writes].reverse().map((write, index) => {
                            if (Math.random() < .2){
                            return (
                                <div key={index}><MoneyIcon/> Purchase number {write.count + 1023400} completed</div>
                            )
                            }else{
                            return (
                                <div key={index}><ShoppingCartIcon/> Shopping cart number {write.count + 19900230} completed</div>
                            )
                            }
                        }) 
                    }
                    
                    {/* {JSON.stringify([...this.props.writes].reverse())} */}
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
