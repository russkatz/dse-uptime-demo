import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

class PositionedSnackbar extends React.Component {
    state = {
        open: false,
        vertical: 'top',
        horizontal: 'center',
    };

    handleClick = state => () => {
        this.setState({ open: true, ...state });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        const { vertical, horizontal, open } = this.state;
        return (
        <div>
            <Button onClick={this.handleClick({ vertical: 'top', horizontal: 'left' })}>
            Top-Left
            </Button>
            <Snackbar
            bodyStyle={{ backgroundColor: 'teal', color: 'coral' }}
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            onClose={this.handleClose}
            ContentProps={{
                'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">PROCESS STARTED</span>}
            />
        </div>
        );
    }
}

export default PositionedSnackbar;