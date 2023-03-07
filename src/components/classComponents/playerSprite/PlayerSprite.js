import react, { Component } from "react";
import { SpriteAnimator } from "react-sprite-animator";
import player from "../../../assets/images/game/sprites/player/player-spritesheet.png";
import "./playerSprite.css";

class PlayerSprite extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isStarted: false,
      xPosition: this.props.coords.x,
      yPosition: this.props.coords.y,
    };
  }

  componentDidMount() {
    // this.props.playerRef.current =
  }

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    return (
      <span
        className="character-player character"
        ref={this.props.playerRef}
        style={{
          top: `${this.props.coords.y}px`,
          left: this.state.xPosition,
        }}
        onClick={this.props.handleClick}
      >
        <SpriteAnimator
          sprite={player}
          width={706}
          height={576}
          scale={this.props.coords.scale}
          fps={24}
          frameCount={8}
          wrapAfter={8}
          shouldAnimate={this.props.animate}
        />
      </span>
    );
  }
}

export default PlayerSprite;
