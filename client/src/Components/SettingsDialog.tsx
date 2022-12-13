import * as React from 'react';
import {
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
import SettingsIcon from '@mui/icons-material/Settings';
import { selectCurrentUser, selectCurrentToken, setCredentials } from '../Hooks/authSlice'
import { useSelector, useDispatch } from "react-redux"
import useAlert from "../Hooks/useAlert";
import { AvatarUpload } from './AvatarUpload';
import axios from 'axios'

export interface SimpleDialogProps {
	open: boolean;
	onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
	const currentUser = useSelector(selectCurrentUser)
	const { onClose, open } = props;
	const [username, setMessage] = React.useState(currentUser.username);
	const { setAlert } = useAlert();
    const [file, setFile] = React.useState<any>();
	const dispatch = useDispatch()
	const token = useSelector(selectCurrentToken)

	const handleMessageChange = (event: any) => {
	  setMessage(event.target.value);
	};

	const handleClose = () => {
		onClose(username)
	};

	const onFileChange = (file: React.ChangeEvent) => {
        const { files } = file.target as HTMLInputElement;
        if (files && files.length !== 0) {
          setFile(files[0])
        }
    }

	const handleSubmit = async (e: any) => {
		e.preventDefault()
		if (!username.length) {
			setAlert("Username must be provided", "error")
			handleClose()
			return ;
		}
		const formData = new FormData();
		if (file)
			formData.append('file', file, currentUser.login)
		formData.append('username', username)
		const upload = await axios({
			withCredentials: true,
			url: `http://localhost:3000/user/${currentUser.id}`,
			method: "put",
			// headers:{
			// 	Authorization: `Bearer ${currentUser.token}`
			// },
			data: formData
		})
		.then((req: any) => {
			console.log(req.data)
			if (req.status !== 200) {
				setAlert("Failed updating userdata", "error")
				return
			}
			setAlert("Username has been updated", "success")
			req.data.avatar = "https://miro.medium.com/max/700/1*JJIYMJIIMg8rjkuoPnAeAA.png"
			dispatch(setCredentials({ user: req.data, accessToken: token }))
		})
		.catch((error: any) => setAlert("Failed updating userdata catch", "error"))
		handleClose()
	}


	return (
		<Dialog onClose={handleClose} open={open}>
		<form onSubmit={e => e.preventDefault()}>
			<DialogTitle sx={{width:'300px'}}>Settings</DialogTitle>
			<List sx={{ pt: 0 }}>
				<ListItem>
					<ListItemAvatar>
						<AvatarUpload onChange={onFileChange} avatarSrc={currentUser.avatar}/>
					</ListItemAvatar>
				</ListItem>
				<br/>
				<ListItem>
					<TextField
					type="text"
					id="username"
					name="username"
					label="update username"
					onChange={handleMessageChange}
					value={username}
					/>
				</ListItem>
				<br/>
				<ListItem>
					<Button onClick={handleSubmit} variant="contained" disableElevation>
						update changes
					</Button>
				</ListItem>
			</List>
		</form>
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