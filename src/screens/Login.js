import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { playSwoosh } from "../utils/playSounds";
import Modal from "../components/functionalComponents/modal/Modal";
import "../styles/login/login.css";

function Login() {
  const [state, setState] = useState({ showModal: false });
  const navigate = useNavigate();

  function goToLeaderboard() {
    navigate("/leaderboard");
  }

  function goToGame(e) {
    e.preventDefault();
    playSwoosh();
    console.log(e.target.name.value);
    let name = e.target.name.value;
    navigate("/game", { state: { name: name } });
  }

  function toggleModal() {
    setState({ ...state, showModal: !state.showModal });
  }

  return (
    <div className="login-page-container">
      {state.showModal && <Modal handleClose={toggleModal} />}
      <div className="login-page ">
        <h1 className="game-title">Flutter Forest</h1>
        <h3 className="game-subtitle">
          Fly through the forest and dodge the monsters!
        </h3>
        <form onSubmit={goToGame} className="login-form">
          <div className="login-input-container ">
            <input
              type="text"
              name="name"
              className="input-name"
              placeholder="Username"
              required
            />
          </div>

          <div className="login-btn-container">
            <button type="submit" className="main-btn btn-primary">
              PLAY
            </button>
            <button
              type="button"
              className="main-btn btn-primary"
              onClick={toggleModal}
            >
              TUTORIAL
            </button>
            <button
              type="button"
              onClick={goToLeaderboard}
              className="main-btn btn-primary"
            >
              LEADERBOARD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
