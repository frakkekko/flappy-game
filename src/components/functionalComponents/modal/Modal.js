import React, { useEffect } from "react";
import close from "../../../assets/images/icons/close.svg";
import playerImg from "../../../assets/images/game/sprites/player/player.png";
import "./modal.css";

function Modal(props) {
  useEffect(() => {
    document.addEventListener("click", attachEvent);

    return () => {
      document.removeEventListener("click", attachEvent);
    };
  }, []);

  function attachEvent(e) {
    if (e.target.className.includes("modal-container")) {
      closeModal();
    }
  }

  function closeModal() {
    props.handleClose();
  }

  return (
    <div className="modal-container">
      <div className="modal-content">
        <img className="close-svg" src={close} onClick={closeModal} />
        <h1 className="title-tutorial"></h1>
        <div className="instruction-wrapper">
          <img src={playerImg} className="sprite-player-img" />
          <p className="instructions">
            Flutter Forest is a simple game where the aim is to survive as long
            as possible avoiding flying monsters. Click on the screen to fly
            upwards and have fun!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Modal;
