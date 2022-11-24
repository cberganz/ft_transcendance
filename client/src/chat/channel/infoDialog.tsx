import InfoIcon from '@mui/icons-material/Info';
import Button from '@mui/material/Button';
import '../chat.css'
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

interface Column {
    id: 'command' | 'description';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
  }

const columns: readonly Column[] = [
{ id: 'command', label: 'Command', minWidth: 170 },
{ id: 'description', label: 'Description', minWidth: 170 },
];

interface Data {
    command: string;
    description: string;
  }

function createData(
command: string,
description: string,
): Data {
return { command, description };
}

const rows = [
    createData('/leave', 'Leave chan.'),
    createData('/block [username]', 'Blocks [username].'),
    createData('/unblock [username]', 'Unblocks [username].'),
    createData('/setpwd [password]', 'Sets password for channel (only if owner).'),
    createData('/rmpwd', 'Removes password of channel (only if owner).'),
    createData('/addadmin [username]', 'Adds new administrator (only if administrator).'),
    createData('/ban [username] [time]', 'Bans [username] for [time] minutes.'),
    createData('/mute [username] [time]', 'Mutes [username] for [time] minutes.'),
    createData('/game [username]', 'Sends game invitation to [username].'),
  ];

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

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                        {columns.map((column) => (
                            <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth, backgroundColor: '#e1e9f5' }}
                            >
                            <b>{column.label}</b>
                            </TableCell>
                        ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                        .map((row) => {
                            return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={row.command}>
                                {columns.map((column) => {
                                const value = row[column.id];
                                return (
                                    <TableCell key={column.id} align={column.align}>
                                    {column.format && typeof value === 'number'
                                        ? column.format(value)
                                        : value}
                                    </TableCell>
                                );
                                })}
                            </TableRow>
                            );
                        })}
                    </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Got it</Button>
            </DialogActions>
            </Dialog>
        </div>
    )
}