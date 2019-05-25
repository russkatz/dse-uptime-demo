import React from "react";
import ShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import MoneyIcon from '@material-ui/icons/AttachMoney';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from 'material-kit-react/components/Card/Card';
import CardHeader from 'material-kit-react/components/Card/CardHeader';
import CardBody from 'material-kit-react/components/Card/CardBody';

class WriteCard extends React.Component {
    componentDidMount() {
        this.props.init();
    }
    render() {
        
    const { classes } = this.props;
        return (
            <div className={"root"}>
                <Card className={"card"}>
                    <CardHeader className={"cardheader"} style={{paddingTop: '20px'}}>PURCHASE TRANSACTIONS</CardHeader>
                    <CardBody className={"cardbody"}>
                    <div className={"cardtext"}>
                    
                    {
                        [...this.props.writes].reverse().map((write, index) => {
                            if(write.result == "Successful"){
                              if (write.count / 10 % 5 > 0){
                              return (
                                  <div key={index}><MoneyIcon/> Purchase number {write.count + 1023400} completed</div>
                              )
                              }else{
                              return (
                                  <div key={index}><ShoppingCartIcon/> Shopping cart number {write.count + 19900230} completed</div>
                              )
                              }
                            }else{
                              return (
                                  <div key={index}>Error</div>
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
)((WriteCard))
export default WriteCardContainer;
