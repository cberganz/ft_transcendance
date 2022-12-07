import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";

function StartButton({
  setStartButton,
  setWin,
  startButton,
  win,
}: {
  setStartButton: (value: boolean) => void;
  setWin: (value: number) => void;
  startButton: boolean;
  win: number;
}) {
  const [start, setStart] = useState<boolean>(startButton);

  function handleClick() {
    setStart(!start);
    setWin(0);
    setStartButton(true);
  }

  return (
    <>
      {win ? <p className="win-message mb-30">Player {win} wins!</p> : ""}
      <LoadingButton
        variant="contained"
        loading={start}
        size="large"
        onClick={handleClick}
        // className="btn"
      >
        START
      </LoadingButton>
      {start && <p>Waiting for your opponent to start...</p>}
    </>
  );
}

export default StartButton;
