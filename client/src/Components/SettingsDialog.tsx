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
import { selectCurrentUser } from '../Hooks/authSlice'
import { useSelector } from "react-redux"
import { useUpdateUserMutation } from "../Api/User/userApiSlice"
import useAlert from "../Hooks/useAlert";

export interface SimpleDialogProps {
	open: boolean;
	// selectedValue: string;
	onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
	const currentUser = useSelector(selectCurrentUser)
	const { onClose, /* selectedValue, */ open } = props;
	const [username, setMessage] = React.useState(currentUser.username);
	const { setAlert } = useAlert();

	const handleChange = (event: any) => {
	  setMessage(event.target.value);
	};

	const [updateUser, {
		data: data,
		isLoading,
		isError,
		isSuccess,
		error
	}] = useUpdateUserMutation()

	const handleClose = () => {
		onClose(username);
	};

	const handleSubmit = (e: any) => {
		e.preventDefault()
		if (!username.length) {
			setAlert("Username must be provided", "error")
			return ;
		}
		const input = {
			id: currentUser.id,
			newUserData: {
				username: username,
			}
		}
		updateUser(input)// verifier que le username n'existe pas deja
	}	

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
				<TextField
				type="text"
				id="username"
				name="username"
				label="update username"
				onChange={handleChange}
				value={username}
				/>
			</ListItem>
			<ListItem>
				<Button onClick={handleSubmit} variant="contained" disableElevation>
					update changes
				</Button>
			</ListItem>
		</List>
		</Dialog>
	);
}

export default function SettingsDialog() {
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = (value: string) => {
		setOpen(false);
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
				// selectedValue={selectedValue}
				open={open}
				onClose={handleClose}
			/>
		</div>
	);
}