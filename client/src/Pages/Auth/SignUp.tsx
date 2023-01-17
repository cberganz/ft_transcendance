import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios, { AxiosResponse } from 'axios';
import './Login.css'

type Credentials = {
	username: FormDataEntryValue | null,
	login: FormDataEntryValue | null,
}

async function signUp(credentials: Credentials) {
	axios.post('http://localhost:3000/user/signup', 
		{
			login: credentials.login,
			username: credentials.username
			// avatar: 'https://profile.intra.42.fr/assets/42_logo_black-684989d43d629b3c0ff6fd7e1157ee04db9bb7a73fba8ec4e01543d650a1c607.png',
		})
		.then((response: AxiosResponse) => {
			if (response.status === 201) {
				window.location.replace('/login');
				return ;
			}
		})
		.catch(() => console.log("User already exist"))
}


export default function signup() {

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
	await signUp({
		"username": data.get('username'),
		"login": data.get('login')
	})
  };

  return (
	<div className="loginPage">
		<Container id="signup-container"  component="main" maxWidth="xs">
			<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				backgroundColor: '#f5f3f2',
				padding: '40px',
				borderRadius: '30px',
			}}
			>
			<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
				<LockOutlinedIcon />
			</Avatar>
			<Typography component="h1" variant="h5">
				Sign up
			</Typography>
			<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
				<TextField
				margin="normal"
				required
				fullWidth
				id="username"
				label="username"
				name="username"
				autoComplete="username"
				autoFocus
				/>
				<TextField
				margin="normal"
				required
				fullWidth
				name="login"
				label="Password"
				id="login"
				autoComplete="current-login"
				/>
				<Button
				type="submit"
				fullWidth
				variant="contained"
				sx={{ mt: 3, mb: 2 }}
				>
				Sign Up
				</Button>
			</Box>
			</Box>
		</Container>
	</div>
  );
}

