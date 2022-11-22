import Button from '@mui/material/Button';
import '../chat.css'
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

function CreateChannelButton(props: any) {
    const [open, setOpen] = React.useState(false);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const createChannel = (e: any) => {
      e.preventDefault()
      props.functionHandler(e.target.isPrivate.value, e.target.name.value, e.target.password.value)
    }

    return (
      <div>
        <Button onClick={handleClickOpen} variant="outlined" color="info" sx={{fontSize: '12px', backgroundColor: '#e6f1f7', float: 'right'}}><b>Create channel</b></Button>
        <form  onSubmit={(e) => {createChannel(e)}}>
          <Dialog open={open} onClose={handleClose} disablePortal>
            <DialogTitle>New channel</DialogTitle>
            <DialogContent>
              <DialogContentText>
              </DialogContentText>
              <Checkbox id='isPrivate' /> Private
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Channel name"
                type="name"
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Password (optionnal)"
                type="password"
                fullWidth
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" onClick={handleClose}>Create</Button>
            </DialogActions>
          </Dialog>
          </form>
      </div>
    );
}

function SendMessageButton(props: any) {
    const [open, setOpen] = React.useState(false);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    const [login, setLogin] = React.useState('');
    const handleChange = (event: SelectChangeEvent) => {
        setLogin(event.target.value as string);
    };
  
    return (
      <div>
        <Button onClick={handleClickOpen} variant="outlined" color="success" sx={{fontSize: '12px', backgroundColor: '#f0f7e6', marginRight: '5px'}}><b>Send message</b></Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>New DM</DialogTitle>
          <DialogContent>

            <Box sx={{ minWidth: 120, marginTop: '10px' }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Login</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={login}
                    label="login"
                    onChange={handleChange}
                    >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
            </Box>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Open discussion</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
}

export default function HeaderChannels(props: any) {
    return (
        <div className='ChannelHeader'>
            <SendMessageButton state={props} />
            <CreateChannelButton state={props} />
        </div>
    )
}