import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';


export default function Leaderboard() {
	return (
		<React.Fragment>
    	  <CssBaseline />
			<Container maxWidth="lg">
				<Box sx={{ height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<Stack direction="row" spacing={2}>
						<Card sx={{ display: 'flex', alignItems: 'center' }}>
							<Box sx={{ display: 'flex', flexDirection: 'column' }}>
								<CardContent sx={{ display: 'flex' }}>
									<Typography component="div" variant="h6">
										<Box sx={{ display: 'flex', flexDirection: 'column' }}>
											Win rate
										</Box>
									</Typography>
								</CardContent>
							</Box>
							<CardMedia
      						  component="img"
      						  sx={{ width: '10vh', height: '10vh', minWidth: '100px', minHeight: '100px' }}
      						  image="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400"
      						  alt="Live from space album cover"
      						/>
						</Card>
						<Card sx={{ display: 'flex', alignItems: 'center' }}>
							<Box sx={{ display: 'flex', flexDirection: 'column' }}>
								<CardContent sx={{ display: 'flex' }}>
									<Typography component="div" variant="h6">
										<Box sx={{ display: 'flex', flexDirection: 'column' }}>
											Win rate
										</Box>
									</Typography>
								</CardContent>
							</Box>
							<CardMedia
      						  component="img"
      						  sx={{ width: '10vh', height: '10vh', minWidth: '100px', minHeight: '100px' }}
      						  image="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400"
      						  alt="Live from space album cover"
      						/>
						</Card>
					</Stack>
				</Box>
			</Container>
    	</React.Fragment>
	);
}
//import { useTheme } from '@mui/material/styles';
//import CardMedia from '@mui/material/CardMedia';
//import IconButton from '@mui/material/IconButton';
//import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
//import PlayArrowIcon from '@mui/icons-material/PlayArrow';
//import SkipNextIcon from '@mui/icons-material/SkipNext';
//
//export default function MediaControlCard() {
//  const theme = useTheme();
//
//  return (
//    <Card sx={{ display: 'flex' }}>
//      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//        <CardContent sx={{ flex: '1 0 auto' }}>
//          <Typography component="div" variant="h5">
//            Live From Space
//          </Typography>
//          <Typography variant="subtitle1" color="text.secondary" component="div">
//            Mac Miller
//          </Typography>
//        </CardContent>
//        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
//          <IconButton aria-label="previous">
//            {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
//          </IconButton>
//          <IconButton aria-label="play/pause">
//            <PlayArrowIcon sx={{ height: 38, width: 38 }} />
//          </IconButton>
//          <IconButton aria-label="next">
//            {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
//          </IconButton>
//        </Box>
//      </Box>
//      <CardMedia
//        component="img"
//        sx={{ width: 151 }}
//        image="/static/images/cards/live-from-space.jpg"
//        alt="Live from space album cover"
//      />
//    </Card>
//  );
//}
