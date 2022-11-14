import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

async function loginUser(credentials: any) {
	const resp = await fetch('http://localhost:4000/auth/login', {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json'
	  },
	  body: JSON.stringify(credentials)
	})
	  .then(data => data)
	
	if (resp.status != 401) {
		const content = await resp.json();
		localStorage.setItem('access_token', content.access_token);
		window.location.replace('/')
	}
}

const theme = createTheme();

export default function Login() {

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
	const access_token = await loginUser({
		"username": data.get('username'),
		"password": data.get('password')
	})
  };

  return (
	<ThemeProvider theme={theme}>
		<Container component="main" maxWidth="xs">
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
				Sign in
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
				name="password"
				label="Password"
				type="password"
				id="password"
				autoComplete="current-password"
				/>
				<Button
				type="submit"
				fullWidth
				variant="contained"
				sx={{ mt: 3, mb: 2 }}
				>
				Sign In
				</Button>
				<Grid container>
					<Grid item>
						<Link href="#" variant="body2">
						{"Don't have an account? Sign Up"}
						</Link>
					</Grid>
				</Grid>
			</Box>
			</Box>
		</Container>
	</ThemeProvider>
  );
}
