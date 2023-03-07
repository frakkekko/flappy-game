import React, { Component } from "react";
import MonsterSprite from "../components/classComponents/monsterSprite/MonsterSprite";
import PlayerSprite from "../components/classComponents/playerSprite/PlayerSprite";
import monster1 from "../assets/images/game/sprites/monsters/enemy1-spritesheet.png";
import monster2 from "../assets/images/game/sprites/monsters/enemy2-spritesheet.png";
import monster3 from "../assets/images/game/sprites/monsters/enemy3-spritesheet.png";
import monster4 from "../assets/images/game/sprites/monsters/enemy4-spritesheet.png";

import withRouter from "../routing/wrapRoutingClass/withNavigation";

import resume from "../assets/images/icons/play.svg";
import pause from "../assets/images/icons/pause.svg";
import restart from "../assets/images/icons/return.svg";
import leaderboard from "../assets/images/icons/leaderboard.svg";

import { playSwoosh, playHit, playWing, playHitDie } from "../utils/playSounds";
import { getRandom } from "../utils/random";

import { setStorage, getStorage } from "../utils/localStorageUtls";

import "../styles/game/game.css";

class Game extends Component {
  constructor(props) {
    super(props);

    this.startTime = null;
    this.pausedTimeStart = 0;
    this.pausedTimeEnd = 0;
    this.pauseTimeIntervall = 0;

    this.pauseFrameStart = 0;
    this.pauseTimeEnd = 0;
    this.pauseFrameIntervall = 0;

    this.gameOverStart = 0;
    this.gameOverEnd = 0;
    this.gameOverIntervall = 0;

    this.startGravity = 1;
    this.gravity = 1;
    this.offsetPlayerMove = window.innerWidth < 480 ? 60 : 80;
    this.rangeSpeed = window.innerWidth < 480 ? [2, 5] : [6, 12];
    this.monstersSpeeds = [
      getRandom(...this.rangeSpeed),
      getRandom(...this.rangeSpeed),
      getRandom(...this.rangeSpeed),
      getRandom(...this.rangeSpeed),
    ];

    this.requestFrameId = null;
    this.prevFrameTime = 0;

    this.playerRef = React.createRef();
    this.monster1Ref = React.createRef();
    this.monster2Ref = React.createRef();
    this.monster3Ref = React.createRef();
    this.monster4Ref = React.createRef();

    this.userName = props.router.location.state.name;
    this.localStorageData =
      getStorage("users") === null || getStorage("users" === undefined)
        ? []
        : getStorage("users");

    this.state = {
      player: {
        y: 346,
        scale: window.innerWidth < 480 ? 11.76 : 7,
      },
      monsters: [
        {
          x: getRandom(-60, -window.innerWidth),
          y: getRandom(110, window.innerHeight - 110),
          scale: window.innerWidth < 480 ? 17.5 : 10.5,
        },
        {
          x: getRandom(-60, -window.innerWidth),
          y: getRandom(110, window.innerHeight - 110),
          scale: window.innerWidth < 480 ? 4.43 : 2.66,
        },
        {
          x: getRandom(-60, -window.innerWidth),
          y: getRandom(110, window.innerHeight - 110),
          scale: window.innerWidth < 480 ? 13.33 : 8,
        },
        {
          x: getRandom(-60, -window.innerWidth),
          y: getRandom(110, window.innerHeight - 110),
          scale: window.innerWidth < 480 ? 4.21 : 2.53,
        },
      ],

      score: 0,
      isPaused: false,
      isGameRunning: false,
    };

    console.log(this.requestFrameId);
  }

  updateLocalStorage = () => {
    this.localStorageData.sort(({ score: a }, { score: b }) => b - a);
    setStorage("users", this.localStorageData);
    // localStorage.setItem(key, JSON.stringify(value));
    // localStorage.setItem("users", JSON.stringify(this.localStorageData));
  };

  handleLocalStorage = (score) => {
    let userFound = this.localStorageData.find((user) => {
      return user.name.toLowerCase() === this.userName.toLowerCase();
    });

    if (!userFound) {
      this.localStorageData.push({
        name: this.userName,
        score: score,
      });
      this.updateLocalStorage();
    }

    if (userFound && userFound.score < score) {
      userFound.score = score;
      this.updateLocalStorage();
    }
  };

  handleFrame = (currentFrameTime) => {
    let deltaTimeFrames =
      currentFrameTime - this.prevFrameTime - this.gameOverIntervall;

    console.log(currentFrameTime);

    this.pauseFrameIntervall = 0;
    this.gameOverIntervall = 0;

    console.log("deltaTimeFrames: " + deltaTimeFrames);

    this.prevFrameTime = currentFrameTime;

    if (deltaTimeFrames > 200) {
      return (this.requestFrameId = requestAnimationFrame(this.handleFrame));
    }

    let isGameRunning = this.state.isGameRunning;
    let score = Math.ceil(
      (Date.now() - this.startTime - this.pauseTimeIntervall) / 500
    );
    let [offset, borderCollisionDetected] = this.applyGravity(deltaTimeFrames);
    let [monstersArr, monstersCollisionDetected] =
      this.moveMonsters(deltaTimeFrames);

    if (monstersCollisionDetected || borderCollisionDetected) {
      isGameRunning = false;
      this.gravity = this.startGravity;
      window.cancelAnimationFrame(this.requestFrameId);
      this.handleLocalStorage(score);

      this.gameOverStart = Date.now();
    }

    this.setState({
      player: offset,
      monsters: monstersArr,
      score: score,
      isGameRunning: isGameRunning,
    });

    if (!monstersCollisionDetected && !borderCollisionDetected) {
      this.requestFrameId = window.requestAnimationFrame(this.handleFrame);
    }
  };

  movePlayer = (e) => {
    if (e.target.classList.contains("pause-popup")) return;
    if (e.target.classList.contains("pause-popup_svg")) return;
    if (e.target.classList.contains("pause")) return;
    if (e.target.classList.contains("pause_svg")) return;
    if (!this.state.isGameRunning) return;
    if (this.state.isPaused) return;

    playWing();

    this.gravity = this.startGravity;

    const currentY = this.playerRef.current.getBoundingClientRect().y;
    this.setState({
      player: {
        y: currentY - this.offsetPlayerMove,
        scale: this.state.player.scale,
      },
    });
  };

  applyGravity = (deltaTime) => {
    let borderCollisionDetected = this.checkBorderCollision();
    const playerY = this.playerRef.current.getBoundingClientRect().y;

    this.gravity = this.gravity + 0.2;

    return [
      {
        y: playerY + this.gravity * (deltaTime / 20),
        scale: this.state.player.scale,
      },
      borderCollisionDetected,
    ];
  };

  startGame = () => {
    this.setState({
      isGameRunning: true,
    });

    this.requestFrameId = window.requestAnimationFrame(this.handleFrame);
    this.startTime = Date.now();
  };

  componentDidMount() {
    document.addEventListener("click", this.movePlayer);
    this.startGame();
  }

  componentDidUpdate(prevProps, prevState) {}

  moveMonsters = (deltaTime) => {
    let collisionDetected = false;

    for (let i = 0; i < this.state.monsters.length; i++) {
      if (
        this.checkMonstersCollision(
          this[`monster${i + 1}Ref`].current.getBoundingClientRect()
        )
      ) {
        collisionDetected = true;
        break;
      }
    }

    const monstersArr = this.state.monsters.map((monster, index) => {
      if (monster.x > window.innerWidth) {
        monster.x = getRandom(-60, -window.innerWidth);
        monster.y = getRandom(110, window.innerHeight - 110);
        this.monstersSpeeds[index] = getRandom(...this.rangeSpeed);
      }

      monster.x += this.monstersSpeeds[index] * (deltaTime / 20);
      console.log(monster);
      return monster;
    });

    return [monstersArr, collisionDetected];

    ////////////////
  };

  checkMonstersCollision(monsterCoords) {
    let monstersCollisionDetected = false;
    let playerCoords = this.playerRef.current.getBoundingClientRect();

    if (
      playerCoords.y < monsterCoords.y + monsterCoords.height &&
      playerCoords.y + playerCoords.height > monsterCoords.y &&
      playerCoords.x < monsterCoords.x + monsterCoords.width &&
      playerCoords.x + playerCoords.width > monsterCoords.x
    ) {
      playHitDie();
      monstersCollisionDetected = true;
    }

    return monstersCollisionDetected;
  }

  checkBorderCollision() {
    let playerCoords = this.playerRef.current.getBoundingClientRect();
    if (
      playerCoords.y < 0 ||
      playerCoords.y + playerCoords.height > window.innerHeight
    ) {
      playHit();
      return true;
    }

    return false;
  }

  initMonstersPosition = () => {
    let monstersPosition = this.state.monsters.map((monster) => {
      return {
        x: getRandom(-60, -window.innerWidth),
        y: getRandom(110, window.innerHeight - 110),
        scale: monster.scale,
      };
    });

    return monstersPosition;
  };

  setPause = () => {
    cancelAnimationFrame(this.requestFrameId);

    this.pausedTimeStart = Date.now();
    this.pauseFrameStart = Date.now();

    this.setState({
      isPaused: true,
    });
  };

  resumeGame = () => {
    this.pausedTime = this.pausedTime + Date.now();
    this.pausedTimeEnd = Date.now();
    this.pauseTimeIntervall =
      this.pauseTimeIntervall + (this.pausedTimeEnd - this.pausedTimeStart);

    this.pauseTimeEnd = Date.now();
    this.pauseFrameIntervall = this.pauseTimeEnd - this.pauseFrameStart;

    this.setState({
      isPaused: false,
    });

    this.requestFrameId = window.requestAnimationFrame(this.handleFrame);
  };

  restartGame = () => {
    let monstersPosition = this.initMonstersPosition();

    this.setState({
      player: {
        y: 346,
        scale: this.state.player.scale,
      },
      monsters: monstersPosition,
      score: 0,
      isPaused: false,
      isGameRunning: true,
    });

    playSwoosh();
    this.startTime = Date.now();
    this.gameOverEnd = Date.now();
    this.gameOverIntervall = this.gameOverEnd - this.gameOverStart;
    this.pauseTimeIntervall = 0;
    this.requestFrameId = window.requestAnimationFrame(this.handleFrame);
  };

  goToLeaderboard = () => {
    this.props.router.navigate("/leaderboard");
  };

  componentWillUnmount() {
    window.cancelAnimationFrame(this.requestFrameId);
    document.removeEventListener("click", this.movePlayer);
  }

  render() {
    return (
      <div className="game-container">
        {!this.state.isGameRunning && (
          <div className="game-over-wrapper">
            <div className="game-over">GAME OVER</div>
            <div className="game-over-choices">
              <img
                className="restart"
                src={restart}
                onClick={this.restartGame}
              />
              <img
                className="leaderboard"
                src={leaderboard}
                onClick={this.goToLeaderboard}
              />
            </div>
          </div>
        )}
        {this.state.isGameRunning && !this.state.isPaused && (
          <div className="pause" onClick={this.setPause}>
            <img className="pause_svg" src={pause} />
          </div>
        )}
        {this.state.isPaused && (
          <div onClick={this.resumeGame} className="pause-popup">
            <img className="pause-popup_svg" src={resume} />
          </div>
        )}
        <div className="score">{this.state.score}</div>
        <div
          className={`layer sky sky_animation ${
            (!this.state.isGameRunning || this.state.isPaused) && "paused"
          }`}
        ></div>
        <div
          className={`layer clouds-1 clouds-1_animation ${
            (!this.state.isGameRunning || this.state.isPaused) && "paused"
          }`}
        ></div>
        <div
          className={`layer rocks rocks_animation ${
            (!this.state.isGameRunning || this.state.isPaused) && "paused"
          }`}
        ></div>
        <div
          className={`layer clouds-2 clouds-2_animation ${
            (!this.state.isGameRunning || this.state.isPaused) && "paused"
          }`}
        ></div>
        <div
          className={`layer ground-1 ground-1_animation ${
            (!this.state.isGameRunning || this.state.isPaused) && "paused"
          }`}
        ></div>
        <div
          className={`layer ground-2 ground-2_animation ${
            (!this.state.isGameRunning || this.state.isPaused) && "paused"
          }`}
        ></div>
        <div
          className={`layer ground-3 ground-3_animation ${
            (!this.state.isGameRunning || this.state.isPaused) && "paused"
          }`}
        ></div>
        <div
          className={`layer plant plant_animation ${
            (!this.state.isGameRunning || this.state.isPaused) && "paused"
          }`}
        ></div>
        <PlayerSprite
          playerRef={this.playerRef}
          coords={{
            x: 50,
            y: this.state.player.y,
            scale: this.state.player.scale,
          }}
          animate={this.state.isGameRunning && !this.state.isPaused}
        />
        <MonsterSprite
          monsterRef={this.monster1Ref}
          monsterName={"monster-yellow"}
          coords={{
            x: this.state.monsters[0].x,
            y: this.state.monsters[0].y,
            width: 0,
            height: 0,
          }}
          spriteSheet={{
            path: monster1,
            width: 1050,
            height: 852,
            scale: this.state.monsters[0].scale,
          }}
          animate={this.state.isGameRunning && !this.state.isPaused}
        />
        <MonsterSprite
          monsterRef={this.monster2Ref}
          monsterName={"monster-purple"}
          coords={{
            x: this.state.monsters[1].x,
            y: this.state.monsters[1].y,
            width: 0,
            height: 0,
          }}
          spriteSheet={{
            path: monster2,
            width: 266,
            height: 207,
            scale: this.state.monsters[1].scale,
          }}
          animate={this.state.isGameRunning && !this.state.isPaused}
        />
        <MonsterSprite
          monsterRef={this.monster3Ref}
          monsterName={"monster-bat"}
          coords={{
            x: this.state.monsters[2].x,
            y: this.state.monsters[2].y,
            width: 0,
            height: 0,
          }}
          spriteSheet={{
            path: monster3,
            width: 800,
            height: 812,
            scale: this.state.monsters[2].scale,
          }}
          animate={this.state.isGameRunning && !this.state.isPaused}
        />
        <MonsterSprite
          monsterRef={this.monster4Ref}
          monsterName={"monster-red"}
          coords={{
            x: this.state.monsters[3].x,
            y: this.state.monsters[3].y,
            width: 0,
            height: 0,
          }}
          spriteSheet={{
            path: monster4,
            width: 253,
            height: 207,
            scale: this.state.monsters[3].scale,
          }}
          animate={this.state.isGameRunning && !this.state.isPaused}
        />

        {/* <div
          className="player"
          ref={this.playerRef}
          style={{ top: `${this.state.player.y}px`, color: "white" }}
          onClick={this.moveBird}
          //   style={{ top: `${this.state.player.y}px` }}
          //   style={{
          //     transform: `translate(${this.state.player.x}px, ${this.state.player.y}px)`,
          //   }}
        >
          {this.state.player.y}px
        </div> */}
      </div>
    );
  }
}

export default withRouter(Game);
