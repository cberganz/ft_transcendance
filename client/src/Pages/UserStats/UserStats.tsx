import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Grid, Container } from '@mui/material';
import PlayerInfos from './components/PlayerInfos'
import StatCard from './components/StatCard';
import PlayedGames from './components/PlayedGames'
import axios from "axios"

//const userData = {
//	"id": 1,
//	"avatar": "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400",
//	"login": "cberganz",
//	"username": "cberganz",
//	"games": [
//		{ id: 1, date: '12/01/2022', playerScore: 2,  opponent: 'Robin',  opponentScore: 12, result: 'Eq'	  },
//		{ id: 2, date: '12/01/2022', playerScore: 2,  opponent: 'Celine', opponentScore: 12, result: 'Loser'  },
//		{ id: 3, date: '12/01/2022', playerScore: 2,  opponent: 'Ugo',    opponentScore: 12, result: 'Loser'  },
//		{ id: 4, date: '12/01/2022', playerScore: 2,  opponent: 'Julien', opponentScore: 12, result: 'Loser'  },
//		{ id: 5, date: '12/01/2022', playerScore: 12, opponent: 'Robin',  opponentScore: 2,  result: 'Winner' },
//		{ id: 6, date: '12/01/2022', playerScore: 12, opponent: 'Celine', opponentScore: 2,  result: 'Winner' },
//		{ id: 7, date: '12/01/2022', playerScore: 12, opponent: 'Ugo',    opponentScore: 2,  result: 'Winner' },
//		{ id: 8, date: '12/01/2022', playerScore: 12, opponent: 'Julien', opponentScore: 2,  result: 'Winner' },
//	],
//};

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

type AxiosData = {
	  data: Stats;
};

interface Props {
  userId?: any;
}

const default_avatar = "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400"

export default class UserStats extends React.Component {

	state = {
		data: {
			id: undefined,
			avatar: default_avatar,
			username: "Unknown",
			games: [],
			playedGames: "N/A",
			gamesWon: "N/A",
			gamesLost: "N/A",
			winRate: "N/A",
		}
	};

	async componentDidMount() {
		await axios.get("http://localhost:3000/user/stats/1")
			.then(response => response.data)
			.then(UserStats => { this.setState({ data: UserStats }); })
			.catch(error => alert("getUserStats " + error.status + ": " + error.message))
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
									data={String(this.state.data.winRate) + "%"}
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
