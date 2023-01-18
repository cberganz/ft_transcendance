import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { setCredentials } from '../../Hooks/authSlice'
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useLoginMutation } from "../../Api/Auth/authApiSlice"
import './Login.css'


type Credentials = {
	username: FormDataEntryValue | null,
	password: FormDataEntryValue | null,
}


function Login() {
	const [login, { isLoading }] = useLoginMutation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	async function loginUser(credentials: Credentials) {
		const userData = await login(credentials).unwrap()

		console.log(userData.user);
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
			<div className="loginPage">
				<Container component="main" maxWidth="xs">
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
					<h1>TRANSCENDENCE</h1>
					<Button variant="contained" href='http://localhost:3000/auth/42' style={{marginTop: '20px'}}>
						42 Login
					</Button>

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
			</div>
		)

  return content
}

export default Login;