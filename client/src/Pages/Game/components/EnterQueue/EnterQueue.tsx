import { Socket } from "socket.io-client";
import { useEffect } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import "../../game.css";

function EnterQueue({
  setEnterQueue,
  socket,
  setQueueStatus,
  queueStatus,
}: {
  setEnterQueue: (value: boolean) => void;
  setQueueStatus: (value: boolean) => void;
  socket: Socket;
  queueStatus: boolean;
}) {
  useEffect(() => {
    const updateQueue = () => {
      setEnterQueue(true);
    };

    const reconnectQueue = () => {
      setQueueStatus(true);
    };

    socket.on("updateQueueClient", updateQueue);
    socket.on("reconnectQueueClient", reconnectQueue);

    return () => {
      socket.off("updateQueueClient", updateQueue);
      socket.off("reconnectQueueClient", reconnectQueue);
    };
  });

  function handleClick() {
    setQueueStatus(!queueStatus);
    socket.emit("updateQueueServer", true);
  }

  return (
    <>
      <LoadingButton
        variant="contained"
        loading={queueStatus}
        size="large"
        onClick={handleClick}
        // className="btn"
      >
        FIND MATCH
      </LoadingButton>
      {queueStatus && <p>Waiting for another player...</p>}
    </>
  );
}

export default EnterQueue;
