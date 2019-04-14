import React from "react";
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from 'material-kit-react/components/Card/Card';
import CardHeader from 'material-kit-react/components/Card/CardHeader';
import CardBody from 'material-kit-react/components/Card/CardBody';

class ReadCard extends React.Component {
    componentDidMount() {
        this.props.init();
    }
    render() {
        return (
            <div className={"classes"}>
                <Card className={"card"}>
                    <CardHeader className={"cardheader"} style={{height: '50px', paddingTop: '20px'}}>DATA READS</CardHeader>
                    <CardBody className={"cardbody"}>
                    <div className={"cardtext"}>

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
)((ReadCard))
export default ReadCardContainer;
