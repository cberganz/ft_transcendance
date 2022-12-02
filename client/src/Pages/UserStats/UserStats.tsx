import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Grid, Container } from '@mui/material';
import PlayerInfos from './components/PlayerInfos'
import StatCard from './components/StatCard';
import PlayedGames from './components/PlayedGames'

export default class UserStats extends React.Component {
	render () {
		return (
			<React.Fragment>
				<CssBaseline />
				<div>
					<Container maxWidth="md" sx={{ mt: 6 }}>
						<Grid container spacing={3}>
							<Grid item xs={12} sm={12} md={12}>
								<PlayerInfos />
							</Grid>
							<Grid item xs={12} sm={6} md={3}>
								<StatCard title="Games played" data="42" color="#343F3E" bgColor="#7899D4" />
							</Grid>
							<Grid item xs={12} sm={6} md={3}>
								<StatCard title="Games won" data="21" color="#343F3E" bgColor="#7899D4" />
							</Grid>
							<Grid item xs={12} sm={6} md={3}>
								<StatCard title="Win rate" data="50%" color="#343F3E" bgColor="#7899D4" />
							</Grid>
							<Grid item xs={12} sm={6} md={3}>
								<StatCard title="Other" data="What?" color="#343F3E" bgColor="#7899D4" />
							</Grid>
							<Grid item xs={12} md={18} lg={18}>
								<PlayedGames />
							</Grid>
						</Grid>
					</Container>
				</div>
    		</React.Fragment>
		);
	}
}
