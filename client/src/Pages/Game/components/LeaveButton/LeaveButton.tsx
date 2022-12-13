import { Socket } from "socket.io-client";
import { useEffect } from "react";
import Button from "@mui/material/Button";

function LeaveButton({
  setEnterQueue,
  setQueueStatus,
  setStartButton,
  setReady,
  setWin,
  socket,
  resetGame,
}: {
  setEnterQueue: (value: boolean) => void;
  setQueueStatus: (value: boolean) => void;
  setStartButton: (value: boolean) => void;
  setReady: (value: boolean) => void;
  setWin: (value: number) => void;
  socket: Socket;
  resetGame: () => void;
}) {
  useEffect(() => {
    const updateQueue = () => {
      setEnterQueue(false);
      setQueueStatus(false);
      setStartButton(false);
      setReady(false);
      setWin(0);
      resetGame();
    };

    socket.on("updateQueueClient", updateQueue);

    return () => {
      socket.off("updateQueueClient", updateQueue);
    };
  });

  function handleClick() {
    socket.emit("updateQueueServer", false);
  }

  return (
    <div className="starting-screen flex-fill d-flex flex-column justify-content-center align-items-center">
      <Button
        variant="contained"
        size="large"
        color="error"
        onClick={handleClick}
      >
        LEAVE
      </Button>
    </div>
  );
}

export default LeaveButton;
