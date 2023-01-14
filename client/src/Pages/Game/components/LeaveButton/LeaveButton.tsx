import { Socket } from "socket.io-client";
import { useEffect } from "react";
import Button from "@mui/material/Button";
import "../../game.css";
import { useNavigate } from "react-router-dom";

function LeaveButton({
  setEnterQueue,
  setQueueStatus,
  setStartButton,
  setReady,
  setWin,
  socket,
  resetGame,
  spectator,
}: {
  setEnterQueue: (value: boolean) => void;
  setQueueStatus: (value: boolean) => void;
  setStartButton: (value: boolean) => void;
  setReady: (value: boolean) => void;
  setWin: (value: number) => void;
  socket: Socket;
  resetGame: () => void;
  spectator: boolean;
}) {
  const navigate = useNavigate();
  useEffect(() => {
    const updateQueue = () => {
      setEnterQueue(false);
      setQueueStatus(false);
      setStartButton(false);
      setReady(false);
      setWin(0);
      resetGame();
    };

    const updateSpectator = () => {
      setEnterQueue(false);
      setQueueStatus(false);
      setStartButton(false);
      setReady(false);
      navigate("/");
      window.location.reload();
    };

    socket.on("updateQueueClient", updateQueue);
    socket.on("updateSpectatorClient", updateSpectator);

    return () => {
      socket.off("updateQueueClient", updateQueue);
      socket.off("updateSpectatorClient", updateSpectator);
    };
  });

  function handleClickPlayer() {
    socket.emit("updateQueueServer", false);
  }

  function handleClickSpectator() {
    socket.emit("updateSpectatorServer", false);
  }

  return (
    <div className="button">
      <Button
        variant="contained"
        size="large"
        color="error"
        onClick={spectator ? handleClickSpectator : handleClickPlayer}
      >
        LEAVE
      </Button>
    </div>
  );
}

export default LeaveButton;
