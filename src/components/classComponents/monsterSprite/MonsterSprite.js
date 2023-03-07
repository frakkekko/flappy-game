import react, { Component } from "react";
import { SpriteAnimator } from "react-sprite-animator";
import "./monsterSprite.css";

class MonsterSprite extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isStarted: false,
      xPosition: this.props.coords.x,
      yPosition: this.props.coords.y,
    };
  }

  componentDidMount() {}

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    return (
      <div
        className={`${this.props.monsterName} character-monster character`}
        style={{
          top: `${this.props.coords.y}px`,
          right: `${this.props.coords.x}px`,
        }}
        ref={this.props.monsterRef}
      >
        <SpriteAnimator
          sprite={this.props.spriteSheet.path}
          width={this.props.spriteSheet.width}
          height={this.props.spriteSheet.height}
          scale={this.props.spriteSheet.scale}
          fps={24}
          frameCount={8}
          wrapAfter={8}
          shouldAnimate={this.props.animate}
        />
      </div>
    );
  }
}

export default MonsterSprite;
