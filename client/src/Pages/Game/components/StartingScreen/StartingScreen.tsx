import Button from "@mui/material/Button";

function StartingScreen({
  setStartButton,
  setWin,
  win,
}: {
  setStartButton: (value: boolean) => void;
  setWin: (value: number) => void;
  win: number;
}) {
  return (
    <div className="starting-screen d-flex flex-column justify-content-center align-items-center">
      {win ? <p className="win-message mb-30">Player {win} wins!</p> : ""}
      <Button
        variant="contained"
        size="large"
        onClick={() => {
          setStartButton(true);
          setWin(0);
        }}
      >
        START
      </Button>
    </div>
  );
}

export default StartingScreen;
