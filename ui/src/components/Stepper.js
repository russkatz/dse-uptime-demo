import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
// import Button from '@material-ui/core/Button';
// import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
        width: '80%',
        marginTop: '10px',
        margin: 'auto',
    },
    // backButton: {
    //     marginRight: theme.spacing.unit,
    // },
    // instructions: {
    //     marginTop: theme.spacing.unit,
    //     marginBottom: theme.spacing.unit,
    // },
});

const stepperStyle = {
    padding: '6px',
}

function getSteps() {
    return ['Healthy System Started', 'Datacenter Affected', 'Recovery Achieve'];
}

// function getStepContent(stepIndex) {
//     switch (stepIndex) {
//         case 0:
//         return 'Viewing a healthy datacenter...';
//         case 1:
//         return 'Two nodes have been compromised...';
//         case 2:
//         return 'Data read/writes routed to new cluster...';
//         default:
//         return 'Unknown stepIndex';
//     }
// }

class stepperBar extends React.Component {
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

    return (
        <div className={classes.root}>
            <Stepper container='true' spacing={24} activeStep={activeStep} style={stepperStyle} alternativeLabel>
                {steps.map(label => {
                    return (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                    );
                })}
            </Stepper>
            {/* <div>
                {this.state.activeStep === steps.length ? (
                    <div>
                    <Typography className={classes.instructions}>Node Rerouting Completed</Typography>
                    <Button onClick={this.handleReset}>Reset</Button>
                    </div>
                ) : (
                    <div>
                        <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
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
            </div> */}
        </div>
        );
    }
}

stepperBar.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(stepperBar);