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

import { setCredentials } from '../../Features/Auth/authSlice'
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useLoginMutation } from "../../Features/Auth/authApiSlice"


type Credentials = {
	username: FormDataEntryValue | null,
	password: FormDataEntryValue | null,
}

const theme = createTheme();

function Login() {
	const [login, { isLoading }] = useLoginMutation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	async function loginUser(credentials: Credentials) {

		const userData = await login(credentials).unwrap()
		dispatch(setCredentials({ user: userData.user, accessToken: userData.jwt_token }))
		return (userData)
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>)  {
		event.preventDefault();
		const data = new FormData(event.currentTarget);

		try {
			await loginUser({
				"username": data.get('username'),
				"password": data.get('login')
			})
			navigate("/")
		}
		catch (e) {
			console.log(e)
		}
	}

	const content = isLoading ? <h1>Loading...</h1> : (
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
						Sign In
						</Button>
						<Grid container>
							<Grid item>
								<Link href="/signup" variant="body2">
								{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
					</Box>
					</Box>
				</Container>
			</ThemeProvider>
		)

  return content
}

export default Login;