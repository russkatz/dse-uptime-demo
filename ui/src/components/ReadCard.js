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
            <div className={"root"}>
                <Card className={"classes"}>
                    <CardHeader className={"cardheader"} style={{paddingTop: '20px'}}>DATA READS</CardHeader>
                    <CardBody className={"cardbody"}>
                    <div className={"cardtext"}>

                    {
                        [...this.props.reads].reverse().map((read, index) => {
                            let imageUrl= "";
                            if (read.dc === "AWS"){
                              imageUrl = require('../images/aws.png')
                            }
                            if (read.dc === "Azure"){
                              imageUrl = require('../images/azure.png')
                            }
                            if (read.dc === "GCP"){
                              imageUrl = require('../images/gcp.png')
                            }
                            return (
                              <div key={index}>
                                <img src={imageUrl} alt={read.dc}  height="36" width="58" style={{ "padding-right": "2em"}} />
                                Count: {read.count}, Result: {read.result}
                              </div>
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
)(ReadCard)
export default ReadCardContainer;
