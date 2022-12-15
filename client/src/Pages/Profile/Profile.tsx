import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Grid, Container } from '@mui/material';
import PlayerInfos from './components/PlayerInfos'
import StatCard from './components/StatCard';
import PlayedGames from './components/PlayedGames'
import axios from "axios"

interface Game {
	id: number;
	date: string;
	playerScore: number;
	opponent: string;
	opponentScore: number;
	result: string;
};

interface Stats {
	id: number;
	avatar: string;
	username: string;
	games: Game[];
	playedGames: number;
	gamesWon: number;
	gamesLost: number;
	winRate: number;
};

export default class Profile extends React.Component {

	state = {
		data: {
			id: undefined,
			avatar: "",
			username: "Unknown",
			games: [],
			playedGames: "N/A",
			gamesWon: "N/A",
			gamesLost: "N/A",
			winRate: -1,
		}
	};

	async componentDidMount() {
		const userId = new URLSearchParams(window.location.search).get("userId")
		await axios.get("http://localhost:3000/user/stats/" + userId)
			.then(response => response.data)
			.then(Profile => { this.setState({ data: Profile }); })
			.catch(error => alert("Profile " + error.status + ": " + error.message))
	}
	
	render() {
		return (
			<React.Fragment>
				<CssBaseline />
				<div>
					<Container maxWidth="md" sx={{ mt: 6 }}>
						<Grid container spacing={3}>
							<Grid item xs={12} sm={12} md={12}>
								<PlayerInfos
									username={this.state.data.username}
									avatar={this.state.data.avatar}
								/>
							</Grid>
							<Grid item xs={12} sm={6} md={3}>
								<StatCard
									title="Games played"
									data={String(this.state.data.playedGames)}
								/>
							</Grid>
							<Grid item xs={12} sm={6} md={3}>
								<StatCard
									title="Games won"
									data={String(this.state.data.gamesWon)}
								/>
							</Grid>
							<Grid item xs={12} sm={6} md={3}>
								<StatCard
									title="Games lost"
									data={String(this.state.data.gamesLost)}
								/>
							</Grid>
							<Grid item xs={12} sm={6} md={3}>
								<StatCard
									title="Win rate"
									data={this.state.data.winRate !== -1 ? String(this.state.data.winRate) + "%" : "N/A"}
								/>
							</Grid>
							<Grid item xs={12} md={18} lg={18}>
								<PlayedGames
									games={this.state.data.games}
								/>
							</Grid>
						</Grid>
					</Container>
				</div>
    		</React.Fragment>
		);
	}
}
