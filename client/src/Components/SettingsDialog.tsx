import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import TextField from '@mui/material/TextField';
import { blue } from '@mui/material/colors';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';


const emails = ['username@gmail.com', 'user02@gmail.com'];

export interface SimpleDialogProps {
	open: boolean;
	selectedValue: string;
	onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
	const { onClose, selectedValue, open } = props;

	const handleClose = () => {
		onClose(selectedValue);
	};

	return (
		<Dialog onClose={handleClose} open={open}>
		<DialogTitle sx={{width:'300px'}}>Settings</DialogTitle>
		<List sx={{ pt: 0 }}>
			<ListItem>
				<ListItemAvatar>
					<Avatar sx={{
						width: 56,
						height: 56,
						bgcolor: blue[100],
						color: blue[600]
					}}>
						<PersonIcon />
					</Avatar>
				</ListItemAvatar>
			</ListItem>
			<ListItem>
				<TextField id="update-username-settings" label="Update Username" variant="standard" />
			</ListItem>
			<ListItem>
				<Button variant="contained" disableElevation>
					update changes
				</Button>
			</ListItem>
		</List>
		</Dialog>
	);
}

export default function SettingsDialog() {
	const [open, setOpen] = React.useState(false);
	const [selectedValue, setSelectedValue] = React.useState(emails[1]);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = (value: string) => {
		setOpen(false);
		setSelectedValue(value);
	};

	return (
		<div>
			<MenuItem onClick={handleClickOpen}>
				<ListItemIcon>
					<SettingsIcon/>
				</ListItemIcon>
				<ListItemText>Settings</ListItemText>
			</MenuItem>
			<SimpleDialog
				selectedValue={selectedValue}
				open={open}
				onClose={handleClose}
			/>
		</div>
	);
}