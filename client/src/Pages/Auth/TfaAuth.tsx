import {
	TextField,
	Box
} from '@mui/material';

const TfaAuth = () => {
	return (
		<Box sx={{
		height: "100vh",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
		}}>
			<TextField
			required
			id="outlined-required"
			label="Google 2FA Code"
			/>
		</Box>
	)
}

export default TfaAuth