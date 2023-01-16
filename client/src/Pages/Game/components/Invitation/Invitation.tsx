import { usersStatusSocket } from "../../../../App/App";

function invitationGame(invitedPlayerId: number): void {
  usersStatusSocket.emit("invitePlayer", invitedPlayerId);
}

export default invitationGame;
