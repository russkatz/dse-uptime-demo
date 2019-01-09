import React from "react";

// material-ui components
// import withStyles from "@material-ui/core/styles/withStyles";

import cardTitle from 'material-kit-react/assets/jss/material-kit-react';
import Card from 'material-kit-react/components/Card/Card';
import CardHeader from 'material-kit-react/components/Card/CardHeader';
import CardBody from 'material-kit-react/components/Card/CardBody';


// const style = {
//     cardTitle: any,
// };

class ReadWriteCard extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <Card style={{width: "20rem"}}>
                <CardHeader color="warning">Featured</CardHeader>
                <CardBody>
                    <h4>Special title treatment</h4>
                    <p>
                        With supporting text below as a
                        natural lead-in to additional content.
                    </p>
                </CardBody>
            </Card>
        );
    }
    }

// export default withStyles(style)(ReadWriteCard);
export default ReadWriteCard;