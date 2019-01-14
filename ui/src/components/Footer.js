import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


const styles = theme => ({
    root: {
    flexGrow: 1,
    marginLeft: '80px'
    },
    backButton: {
        marginRight: theme.spacing.unit,
    },
    instructions: {
        marginTop: '10px',
        marginBottom: '10px',
    },
});

function getSteps() {
    return ['Healthy System Started', 'Datacenter Affected', 'Recovery Achieve'];
}

function getStepContent(stepIndex) {
    switch (stepIndex) {
        case 0:
        return 'Viewing a healthy datacenter...';
        case 1:
        return 'Two nodes have been compromised...';
        case 2:
        return 'Data read/writes routed to new cluster...';
        default:
        return 'Unknown stepIndex';
    }
}


class Footer extends React.Component {
    state = {
        activeStep: 0,
    };

    handleNext = () => {
        this.setState(state => ({
        activeStep: state.activeStep + 1,
        }));
    };

    handleBack = () => {
        this.setState(state => ({
        activeStep: state.activeStep - 1,
        }));
    };

    handleReset = () => {
        this.setState({
        activeStep: 0,
        });
    };


    render() {
        const { classes } = this.props;
        const steps = getSteps();
        const { activeStep } = this.state;

        return(
            <div className={classes.root}>
                {this.state.activeStep === steps.length ? (
                    <div>
                    <Typography className={classes.instructions}>Node Rerouting Completed</Typography>
                    <Button onClick={this.handleReset}>Reset</Button>
                    </div>
                ) : (
                    <div>
                        <Typography>{getStepContent(activeStep)}</Typography>
                        <div>
                            <Button
                            disabled={activeStep === 0}
                            onClick={this.handleBack}
                            className={classes.backButton}
                            >
                            Back
                            </Button>
                            <Button variant="contained" color="primary" onClick={this.handleNext}>
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}


Footer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Footer);