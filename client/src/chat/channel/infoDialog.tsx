import InfoIcon from '@mui/icons-material/Info';
import Button from '@mui/material/Button';
import '../chat.css'
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

export function InfoDialog() {
    const [open, setOpen] = React.useState(false);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    return (
        <div>
            <Tooltip title="Chat commands">
                <InfoIcon
                    onClick={handleClickOpen}
                    fontSize='large'
                    sx={{cursor: 'pointer', marginLeft: '45%', marginTop: '30px'}}
                />
            </Tooltip>
            <Dialog open={open} onClose={handleClose}>
         
            <DialogTitle>Chat commands</DialogTitle>
            <DialogContent>

                <Box sx={{ minWidth: 120, marginTop: '10px' }}>
                    <p><b>/leave</b>                 Leave chan.</p><br />
                    <p><b>/block [username]</b>      Blocks [username].</p><br />
                    <p><b>/unblock [username]</b> Unblocks [username]. </p><br />
                    <p><b>/setpwd [password]</b> Sets password for channel (only if owner).</p><br />
                    <p><b>/rmpwd</b> Removes password of channel (only if owner).</p><br />
                    <p><b>/addadmin [username]</b> Adds new administrator (only if administrator).</p><br />
                    <p><b>/ban [username] [time]</b> Bans [username] for [time] minutes.</p><br />
                    <p><b>/mute [username] [time]</b> Mutes [username] for [time] minutes.</p><br />
                    <p><b>/game [username]</b> Sends game invitation to [username].</p><br />
                </Box>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Got it</Button>
            </DialogActions>
            </Dialog>
        </div>
    )
}