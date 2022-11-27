import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

export default function Leaderboard() {
	return (
		<React.Fragment>
    	  <CssBaseline />
    	  <Container maxWidth="lg">
    	    <Box sx={{ bgcolor: '#ff7e61', height: '20vh', minHeight: '300px' }} />
    	  </Container>
    	</React.Fragment>
	);
}
