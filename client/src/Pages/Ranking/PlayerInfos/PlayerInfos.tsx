import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import BadgeAvatar from './Badge'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function PlayerInfos() {
	return (
		<React.Fragment>
    	  <CssBaseline />
			<Container maxWidth="lg">
	  		  <Stack
				sx={{ height: '15vh', width: '15vh', minHeight: '100px', minWidth: '100px' }}
				direction="row"
				spacing={0}
			  >
				<Stack sx={{ display: 'flex',
							 justifyContent: 'center',
							 minWidth: '100%',
							 minHeight: '100%'
				}}>
					<Box sx={{ width: '80%', height: '80%' }}>
						<BadgeAvatar />
					</Box>
				</Stack>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
	  				<Stack direction="column" spacing={1}>
						<Typography variant="h4">
							Cberganz
						</Typography>
						<Stack direction="row" spacing={1}>
							<Box sx={{ minWidth: '105px', display: 'flex', alignItems: 'center' }}>
								<Button variant="contained" size="small">Add friend</Button>
							</Box>
							<Box sx={{ minWidth: '130px', display: 'flex', alignItems: 'center' }}>
								<Button variant="contained" size="small">Send message</Button>
							</Box>
	  					</Stack>
	  				</Stack>
	  			</Box>
	  		  </Stack>
	  		</Container>
    	</React.Fragment>
	);
}
