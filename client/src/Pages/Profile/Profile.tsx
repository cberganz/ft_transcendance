import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { Grid, Container } from '@mui/material'
import PlayerInfos from './components/PlayerInfos'
import StatCard from './components/StatCard'
import PlayedGames from './components/PlayedGames'
import axios from "axios"
import { useSearchParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectCurrentToken } from '../../Hooks/authSlice'

function ProfileHook(component: any) {
	return function WrappedProfile(props: any) {
		const [searchParams] = useSearchParams()
		const userId = searchParams.get("userId")
		const token = useSelector(selectCurrentToken);
		return (<Profile token={token} userId={userId ? userId : ""} />)
	}
}

class Profile extends React.Component<{ token: string, userId: string }, {}> {

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
		},
		userId: this.props.userId
	};

	async componentDidMount() {
		await axios.get("http://localhost:3000/user/stats/" + this.state.userId,
			{withCredentials: true, headers: {Authorization: `Bearer ${this.props.token}`}})
			.then(response => response.data)
			.then(Profile => { this.setState({ data: Profile }); })
			.catch(error => alert("Profile " + error.status + ": " + error.message))
	}

	async componentDidUpdate(prevProps: any) {
		if (prevProps.userId !== this.props.userId) {
			await axios.get("http://localhost:3000/user/stats/" + this.props.userId,
			{withCredentials: true, headers: {Authorization: `Bearer ${this.props.token}`}})
				.then(response => response.data)
				.then(Profile => { this.setState({ data: Profile, userId: this.props.userId }); })
				.catch(error => alert("Profile " + error.status + ": " + error.message))
		}
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
									userId={this.state.userId}
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

export default ProfileHook(Profile);
