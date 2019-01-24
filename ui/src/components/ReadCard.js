import React from "react";
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from 'material-kit-react/components/Card/Card';
import CardHeader from 'material-kit-react/components/Card/CardHeader';
import CardBody from 'material-kit-react/components/Card/CardBody';


const styles = theme => ({
    cardheader: {
        backgroundColor: 'lightgrey',
        fontSize: '25px',
        color: 'white',
        padding: '10px',
        textAlign: 'right',
    },
    cardbody: {
        padding: 0,
        marginLeft: '7px'
    },
    cardtext: {
        height: '150px',
        overflow: 'scroll',
        fontSize: '17px',
        margin: '5px',
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
                    <CardHeader className={classes.cardheader}>EVENTS</CardHeader>
                    <CardBody className={classes.cardbody}>
                    <div className={classes.cardtext}>

                    {JSON.stringify(this.props.reads)}

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