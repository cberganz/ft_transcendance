import * as React from 'react';
import {
	Avatar,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	DialogTitle,
	Dialog,
	TextField,
	MenuItem,
	ListItemIcon,
	Button,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { selectCurrentUser } from '../Hooks/authSlice'
import { useSelector } from "react-redux"
import { useUpdateUserMutation } from "../Api/User/userApiSlice"
import useAlert from "../Hooks/useAlert";

export interface SimpleDialogProps {
	open: boolean;
	onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
	const currentUser = useSelector(selectCurrentUser)
	const { onClose, open } = props;
	const [username, setMessage] = React.useState(currentUser.username);
	const { setAlert } = useAlert();
	const [updateUser] = useUpdateUserMutation()

	const handleChange = (event: any) => {
	  setMessage(event.target.value);
	};


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
		updateUser(input)
			.then(() => setAlert("Username has been updated", "success"))// verifier que le username n'existe pas deja
			.catch(() => setAlert("Failed updating userdata", "error"))
		handleClose()
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
				open={open}
				onClose={handleClose}
			/>
		</div>
	);
}