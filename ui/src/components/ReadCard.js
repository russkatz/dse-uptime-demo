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
        color: 'blue',
        margin: '0 auto',
    },
    cardtext: {
        height: '260px',
        overflow: 'scroll',
        fontSize: '22px',
    }
});

class ReadCard extends React.Component {
    componentDidMount() {
        this.props.init();
    }
    render() {
    const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Card className={classes.card}>
                    <CardHeader className={classes.cardheader} style={{height: '50px', paddingTop: '20px'}}>DATA READS</CardHeader>
                    <CardBody className={classes.cardbody}>
                    <div className={classes.cardtext}>

                    {
                        [...this.props.reads].reverse().map((read, index) => {
                            return (
                                <div key={index}>Datacenter: {read.dc}, Count: {read.count}, Result: {read.result}</div>
                            )
                        })
                    }


                    {/* {JSON.stringify([...this.props.reads].reverse())} */}

                    </div>
                    </CardBody>
                </Card>
            </div>
        );

    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        reads: state.app.reads
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    init: () => {
    },
    }
}

const ReadCardContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(ReadCard))
export default ReadCardContainer;