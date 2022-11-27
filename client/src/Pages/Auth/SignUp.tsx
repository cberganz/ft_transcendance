import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios, { AxiosResponse } from 'axios';

type Credentials = {
	username: FormDataEntryValue | null,
	login: FormDataEntryValue | null,
}

async function signUp(credentials: Credentials) {
	axios.post('http://localhost:3000/user/signup', {
			username: credentials.username,
			login: credentials.login
		})
		.then((response: AxiosResponse) => {
			if (response.status === 201) {
				window.location.replace('/login');
				return ;
			}
		})
		.catch(() => console.log("User already exist"))
}

const theme = createTheme();

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
	<ThemeProvider theme={theme}>
		<Container id="signup-container"  component="main" maxWidth="xs">
			<CssBaseline />
			<Box
			sx={{
				marginTop: 8,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
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
	</ThemeProvider>
  );
}

