import './Ranking.css'
import PlayerInfos from './PlayerInfos/PlayerInfos'
import PersonalStats from './PersonalStats/PersonalStats'
import Leaderboard from './Leaderboard/Leaderboard'

export default function Ranking() {
	return (
			<div>
				<PlayerInfos />
				<PersonalStats />
				<Leaderboard />
			</div>
	);
}
