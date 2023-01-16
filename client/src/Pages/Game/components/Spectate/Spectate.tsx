import { usersStatusSocket } from "../../../../App/App";

function spectateGame(invitedPlayerId: number): void {
  usersStatusSocket.emit("spectatePlayer", invitedPlayerId);
}

export default spectateGame;
