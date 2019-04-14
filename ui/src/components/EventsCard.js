import React from "react";
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from 'material-kit-react/components/Card/Card';
import CardHeader from 'material-kit-react/components/Card/CardHeader';
import CardBody from 'material-kit-react/components/Card/CardBody';

import style from '../style.css';

class EventsCard extends React.Component {
    componentDidMount() {
        this.props.init();
    }
    render() {
    const { classes } = this.props;
    let events = []
    Object.assign(events, this.props.events)
        return (
            <div className={"root"}>
                <Card className={"card"} style={{marginBottom: '130px'}}>
                    <CardHeader className={"cardheader"} style={{height: '50px', paddingTop: '20px'}}>EVENTS</CardHeader>
                    <CardBody className={"cardbody"}>
                    <div className={"cardtext"}>
                    {
                        events.reverse().map((event, index) => {
                        return(
                            <span key={index}>{event}<br /></span>
                            )
                            }
                        )
                    }

                    </div>
                    </CardBody>
                </Card>
            </div>
        );

    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        events: state.app.events
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    init: () => {
    },
    }
}

const EventsCardContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)((EventsCard))
export default EventsCardContainer;
