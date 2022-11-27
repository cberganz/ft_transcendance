import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

export default function Leaderboard() {
	return (
		<React.Fragment>
    	  <CssBaseline />
    	  <Container maxWidth="lg">
    	    <Box sx={{ bgcolor: '#cfe8fc', height: '51vh', minHeight: '150px' }} />
    	  </Container>
    	</React.Fragment>
	);
}
