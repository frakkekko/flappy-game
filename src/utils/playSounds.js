import { Howl } from "howler";
import swoosh from "../assets/audio/swoosh.mp3";
import die from "../assets/audio/die.mp3";
import wing from "../assets/audio/wing.mp3";
import hit from "../assets/audio/hit.mp3";

const swooshSound = new Howl({
  src: [swoosh],
});

const dieSound = new Howl({
  src: [die],
});

const wingSound = new Howl({
  src: [wing],
});

const hitSound = new Howl({
  src: [hit],
});

const hitDieSound = new Howl({
  src: [hit],
  onend: playDie,
});

function playHitDie() {
  hitDieSound.play();
}

function playSwoosh() {
  swooshSound.play();
}

function playDie() {
  dieSound.play();
}

function playWing() {
  wingSound.play();
}

function playHit() {
  hitSound.play();
}

export { playSwoosh, playDie, playWing, playHit, playHitDie };
