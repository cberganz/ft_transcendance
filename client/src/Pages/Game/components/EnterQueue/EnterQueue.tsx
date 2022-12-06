import { Socket } from "socket.io-client";
import LoadingButton from "@mui/lab/LoadingButton";
import { useEffect, useState } from "react";

function EnterQueue({
  setEnterQueue,
  socket,
}: {
  setEnterQueue: (value: boolean) => void;
  socket: Socket;
}) {
  const [queueStatus, setQueueStatus] = useState<boolean>(false);

  useEffect(() => {
    const updateQueue = () => {
      setEnterQueue(true);
    };

    socket.on("updateQueueClient", updateQueue);

    return () => {
      socket.off("updateQueueClient", updateQueue);
    };
  });

  function handleClick() {
    setQueueStatus(!queueStatus);
    socket.emit("updateQueueServer", queueStatus);
  }

  return (
    <div className="starting-screen flex-fill d-flex flex-column justify-content-center align-items-center">
      <LoadingButton
        variant="contained"
        loading={queueStatus}
        size="large"
        onClick={handleClick}
      >
        FIND MATCH
      </LoadingButton>
      {queueStatus && <p>Waiting for another player...</p>}
    </div>
  );
}

export default EnterQueue;
