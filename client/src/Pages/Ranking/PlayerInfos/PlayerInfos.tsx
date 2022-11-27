import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import BadgeAvatar from './Badge'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import '../Ranking.css';

export default function PlayerInfos() {
	return (
		<React.Fragment>
    	  <CssBaseline />
    	  <Container maxWidth="lg">
			<Stack sx={{ bgcolor: '#b6adab', height: '100%' }} direction="row" spacing={1}>
			<Box className="RankingContainer">
				<BadgeAvatar />
				<Box>
					<Stack sx={{ mt: 10 }} direction="row" spacing={1}>
						<Button variant="contained" size="small">Add friend</Button>
						<Button variant="contained" size="small">Send message</Button>
					</Stack>
				</Box>
			</Box>
			</Stack>
    	  </Container>
    	</React.Fragment>
	);
}
