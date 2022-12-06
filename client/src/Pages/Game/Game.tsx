import React, { useEffect, useRef, useState } from "react";
import Ball from "./classes/Ball";
import Player from "./classes/Player";
import StartingScreen from "./components/StartingScreen/StartingScreen";
import io, { Socket } from "socket.io-client";
import WaitingStart from "./components/WaitingStart/WaitingStart";
import EnterQueue from "./components/EnterQueue/EnterQueue";
import "./game.css";
import { selectCurrentUser } from "../../Hooks/authSlice";
import { useSelector } from "react-redux";

function Game() {
  console.log(useSelector(selectCurrentUser).id);

  const socket: Socket = io("http://localhost:3000/game", {
    query: {
      id: useSelector(selectCurrentUser).id,
    },
  });

  const [enterQueue, setEnterQueue] = useState<boolean>(false);
  const [startButton, setStartButton] = useState<boolean>(false);
  const [win, setWin] = useState<number>(0);
  const [ready, setReady] = useState<boolean>(false);
  const factor: number = 1.32;
  const heightRef = useRef(window.innerHeight / factor);
  const widthRef = useRef(window.innerWidth / factor);
  const boardHeightRef = useRef(heightRef.current / 6);
  const boardWidthRef = useRef(heightRef.current / 50);
  const ballSizeRef = useRef(heightRef.current / 50);
  let startRef = useRef(false);
  let timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const p1Ref = useRef(
    new Player(
      [
        widthRef.current / 50,
        heightRef.current / 2 - boardHeightRef.current / 2,
      ],
      1
    )
  );
  const p2Ref = useRef(
    new Player(
      [
        widthRef.current - boardWidthRef.current - widthRef.current / 50,
        heightRef.current / 2 - boardHeightRef.current / 2,
      ],
      2
    )
  );
  const ballRef = useRef(
    new Ball([widthRef.current / 2, heightRef.current / 2], ballSizeRef.current)
  );

  const p1 = p1Ref.current;
  const p2 = p2Ref.current;
  const ball = ballRef.current;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "w": {
          socket.emit("msgToServer", "u");
          break;
        }
        case "s": {
          socket.emit("msgToServer", "d");
          break;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        e.key === "w" &&
        (p1.getDirection() === "u" || p2.getDirection() === "u")
      ) {
        socket.emit("msgToServer", "n");
      } else if (
        e.key === "s" &&
        (p1.getDirection() === "d" || p2.getDirection() === "d")
      ) {
        socket.emit("msgToServer", "n");
      }
    };

    const handleBlur = () => {
      socket.emit("msgToServer", "n");
    };

    const updatePlayerDirection = (val: string) => {
      switch (val) {
        case "u1": {
          p1.setDirection("u");
          break;
        }
        case "d1": {
          p1.setDirection("d");
          break;
        }
        case "n1": {
          p1.setDirection("n");
          break;
        }
        case "u2": {
          p2.setDirection("u");
          break;
        }
        case "d2": {
          p2.setDirection("d");
          break;
        }
        case "n2": {
          p2.setDirection("n");
          break;
        }
      }
    };

    const updateBallDir = (arr: Array<number>) => {
      ball.setDirectionX(arr[0]);
      ball.setDirectionY(arr[1]);
    };

    const updatePlayerPos = (param: { pos: number; id: number }) => {
      if (param.id === 1) {
        p1.setY(param.pos * heightRef.current);
      } else {
        p2.setY(param.pos * heightRef.current);
      }
    };

    const updateBallPos = (param: { posX: number; posY: number }) => {
      ball.setX(param.posX * widthRef.current);
      ball.setY(param.posY * heightRef.current);
    };

    const updateScore = (param: { playerNumber: number; score: number }) => {
      if (param.playerNumber === 1) {
        p1.setScore(param.score);
      } else {
        p2.setScore(param.score);
      }
    };

    const updateReadyListener = (value: boolean) => {
      if (value === true && ready === false) {
        setReady(true);
      }
    };

    const updateCancel = () => {
      if (ready) resetGame(p1, p2);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    socket.on("msgToClient", updatePlayerDirection);
    socket.on("updateBallDirClient", updateBallDir);
    socket.on("updatePlayerPosClient", updatePlayerPos);
    socket.on("updateBallPosClient", updateBallPos);
    socket.on("updateScoreClient", updateScore);
    socket.on("updateReadyClient", updateReadyListener);
    socket.on("updateCancelClient", updateCancel);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
      socket.off("msgToClient", updatePlayerDirection);
      socket.off("updateBallDirClient", updateBallDir);
      socket.off("updatePlayerPosClient", updatePlayerPos);
      socket.off("updateBallPosClient", updateBallPos);
      socket.off("updateScoreClient", updateScore);
      socket.off("updateReadyClient", updateReadyListener);
      socket.off("updateCancelClient", updateCancel);
      socket.disconnect();
    };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    canvasCtxRef.current = canvas.getContext("2d");
    const ctx = canvasCtxRef.current;
    if (!ctx) {
      return;
    }

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.width / factor;
      heightRef.current = canvas.height;
      widthRef.current = canvas.width;
      boardHeightRef.current = heightRef.current / 6;
      boardWidthRef.current = heightRef.current / 50;
      ballSizeRef.current = heightRef.current / 50;
      p1.setX(widthRef.current / 50);
      p1.setY(heightRef.current * p1.getRelativePosition());
      p2.setX(widthRef.current - boardWidthRef.current - widthRef.current / 50);
      p2.setY(heightRef.current * p2.getRelativePosition());
      ball.setX(widthRef.current * ball.getRelativePosition()[0]);
      ball.setY(heightRef.current * ball.getRelativePosition()[1]);
      ball.setStartingPosition([
        widthRef.current / 2 - ballSizeRef.current / 2,
        heightRef.current / 2 - ballSizeRef.current / 2,
      ]);
    };

    window.addEventListener("resize", handleResize);

    handleResize();
    initGame();

    let animationFrameId = 0;

    const loopGame = () => {
      draw(ctx, p1, p2);
      if (p1.getScore() < 10 && p2.getScore() < 10) {
        animationFrameId = requestAnimationFrame(loopGame);
      } else {
        resetGame(p1, p2);
      }
    };
    loopGame();

    return () => {
      cancelAnimationFrame(animationFrameId);
      //   socket.emit("leaveRoom");
      window.removeEventListener("resize", handleResize);
    };
  });

  function initGame(): void {
    p1.setY(heightRef.current / 2 - boardHeightRef.current / 2);
    p2.setY(heightRef.current / 2 - boardHeightRef.current / 2);
    p1.setRelativePosition(p1.getY() / heightRef.current);
    p2.setRelativePosition(p2.getY() / heightRef.current);
    p1.setY(heightRef.current * p1.getRelativePosition());
    p1.setX(widthRef.current / 50);
    p2.setX(widthRef.current - boardWidthRef.current - widthRef.current / 50);
    p2.setY(heightRef.current * p2.getRelativePosition());
    ball.setX(widthRef.current / 2 - ballSizeRef.current / 2);
    ball.setY(heightRef.current / 2 - ballSizeRef.current / 2);
    ball.setRelativePosition([
      ball.getX() / widthRef.current,
      ball.getY() / heightRef.current,
    ]);
    ball.setX(widthRef.current * ball.getRelativePosition()[0]);
    ball.setY(heightRef.current * ball.getRelativePosition()[1]);
    if (startButton) {
      updateReady(true);
    }
  }

  function drawMap(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, widthRef.current, heightRef.current);
    for (let i: number = 0; i < heightRef.current; i++) {
      ctx.fillStyle = "white";
      if (i % 20 < 10) {
        ctx.fillRect(widthRef.current / 2, i, 1, 1);
      }
    }
  }

  function drawPlayer(ctx: CanvasRenderingContext2D, player: Player): void {
    ctx.fillStyle = "white";
    ctx.fillRect(
      player.getPosition()[0],
      player.getPosition()[1],
      boardWidthRef.current,
      boardHeightRef.current
    );
  }

  function drawBall(ctx: CanvasRenderingContext2D, ball: Ball): void {
    ctx.fillStyle = "white";
    ctx.fillRect(
      ball.getX(),
      ball.getY(),
      ballSizeRef.current,
      ballSizeRef.current
    );
  }

  function updatePlayerPosition(player: Player): void {
    if (player.getDirection() === "u" && player.getY() > 0) {
      socket.emit("updatePlayerPosServer", {
        pos:
          (player.getY() - heightRef.current / player.getSpeed()) /
          heightRef.current,
        id: player.id,
      });
    } else if (
      player.getDirection() === "d" &&
      player.getY() < heightRef.current - boardHeightRef.current
    ) {
      socket.emit("updatePlayerPosServer", {
        pos:
          (player.getY() + heightRef.current / player.getSpeed()) /
          heightRef.current,
        id: player.id,
      });
    }
    player.setRelativePosition(player.getY() / heightRef.current);
  }

  function updateBallPosition(): void {
    socket.emit("updateBallPosServer", {
      posX:
        (ball.getX() +
          (ball.getDirectionX() * widthRef.current) / ball.getSpeed()) /
        widthRef.current,
      posY:
        (ball.getY() +
          (ball.getDirectionY() * heightRef.current) / ball.getSpeed()) /
        heightRef.current,
    });
    ball.setRelativePosition([
      ball.getX() / widthRef.current,
      ball.getY() / heightRef.current,
    ]);
  }

  function ballCollision(p1: Player, p2: Player): boolean {
    if (
      ball.getLeftBorder() <= p1.getX() + boardWidthRef.current &&
      ball.getLeftBorder() >= p1.getX() &&
      ball.getBottomBorder() >= p1.getY() &&
      ball.getTopBorder() <= p1.getY() + boardHeightRef.current &&
      p1.getCanHit()
    ) {
      p1.setCanHit(false);
      p2.setCanHit(true);
      return true;
    }
    if (
      ball.getRightBorder() >= p2.getX() &&
      ball.getRightBorder() <= p2.getX() + boardWidthRef.current &&
      ball.getBottomBorder() >= p2.getY() &&
      ball.getTopBorder() <= p2.getY() + boardHeightRef.current &&
      p2.getCanHit()
    ) {
      p1.setCanHit(true);
      p2.setCanHit(false);
      return true;
    }
    return false;
  }

  function directionAfterCollision(p: Player): number {
    let newDirection =
      ball.getY() +
      ballSizeRef.current / 2 -
      (p.getY() + boardHeightRef.current / 2);
    newDirection = (newDirection / (boardHeightRef.current / 2)) * 0.8;
    return newDirection;
  }

  function updateBallDirection(p1: Player, p2: Player): void {
    if (
      ball.getTopBorder() <= 0 ||
      ball.getBottomBorder() >= heightRef.current
    ) {
      ball.setDirectionY(ball.getDirectionY() * -1);
    }
    if (ballCollision(p1, p2)) {
      ball.setDirectionX(ball.getDirectionX() * -1);
      if (p1.getCanHit() === false) {
        ball.setDirectionY(directionAfterCollision(p1));
      } else {
        ball.setDirectionY(directionAfterCollision(p2));
      }
    }
  }

  function scorePoint(p1: Player, p2: Player): boolean {
    if (ball.getRightBorder() <= 0) {
      socket.emit("updateScoreServer", {
        playerNumber: 2,
        score: p2.getScore() + 1,
      });
      ball.resetPosition();
      ball.setDirectionX(0);
      ball.setDirectionY(0);
      p1.setCanHit(true);
      p2.setCanHit(true);
      return true;
    } else if (ball.getLeftBorder() >= widthRef.current) {
      socket.emit("updateScoreServer", {
        playerNumber: 1,
        score: p1.getScore() + 1,
      });
      ball.resetPosition();
      ball.setDirectionX(0);
      ball.setDirectionY(0);
      p1.setCanHit(true);
      p2.setCanHit(true);
      return true;
    } else if (!startRef.current) {
      ball.setDirectionX(0);
      ball.setDirectionY(0);
      startRef.current = true;
      return true;
    }
    return false;
  }

  function drawScore(
    ctx: CanvasRenderingContext2D,
    p1: Player,
    p2: Player
  ): void {
    ctx.fillStyle = "white";
    ctx.font = "40px sans-serif";
    ctx.textBaseline = "top";
    ctx.fillText(p1.getScore().toString(), 20, 20);
    if (p2.getScore() < 10) {
      ctx.fillText(p2.getScore().toString(), widthRef.current - 42, 20);
    } else {
      ctx.fillText(p2.getScore().toString(), widthRef.current - 64, 20);
    }
  }

  function drawGame(
    ctx: CanvasRenderingContext2D,
    p1: Player,
    p2: Player
  ): void {
    drawMap(ctx);
    drawPlayer(ctx, p1);
    drawPlayer(ctx, p2);
    drawBall(ctx, ball);
    drawScore(ctx, p1, p2);
  }

  function resetGame(p1: Player, p2: Player): void {
    updateReady(false);
    setReady(false);
    setStartButton(false);
    if (p1.getScore() === 10) {
      setWin(1);
    } else if (p2.getScore() === 10) {
      setWin(2);
    }
    startRef.current = false;
    timerRef.current && clearTimeout(timerRef.current);
    p1.setScore(0);
    p2.setScore(0);
    p1.resetPosition();
    p2.resetPosition();
  }

  const draw = (
    ctx: CanvasRenderingContext2D,
    p1: Player,
    p2: Player
  ): void => {
    if (startButton) {
      //   updateReady(true);
      if (ready) {
        if (scorePoint(p1, p2)) {
          timerRef.current = setTimeout(() => {
            socket.emit("updateBallDirServer", ball.initializeDirection());
          }, 1000);
        }
        updatePlayerPosition(p1);
        updatePlayerPosition(p2);
        updateBallDirection(p1, p2);
        updateBallPosition();
        drawGame(ctx, p1, p2);
      }
    }
  };

  function updateReady(ready: boolean): void {
    socket.emit("updateReadyServer", ready);
  }

  return (
    <div className={"gameContainer"}>
      <div className={"gameWidth"}>
        {!enterQueue ? (
          <EnterQueue setEnterQueue={setEnterQueue} socket={socket} />
        ) : !startButton ? (
          <StartingScreen
            setStartButton={setStartButton}
            setWin={setWin}
            win={win}
          />
        ) : !ready ? (
          <WaitingStart />
        ) : null}
        <canvas
          className={`${!startButton && "display-none"}`}
          ref={canvasRef}
        ></canvas>
      </div>
    </div>
  );
}

export default Game;
