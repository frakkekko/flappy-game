import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/leaderboard/leaderboard.css";

import { getStorage } from "../utils/localStorageUtls";

function Leaderboard(props) {
  const navigate = useNavigate();

  const scores =
    getStorage("users") === null || getStorage("users") === undefined
      ? []
      : getStorage("users");

  function goToHome() {
    navigate("/");
  }

  function mapUserScore(score, index) {
    return (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{score.name}</td>
        <td>{score.score}</td>
      </tr>
    );
  }

  return (
    <div className="leaderboard-page-container">
      <div className="leaderboard-page ">
        <h1 className="leaderboard-title">LEADERBOARD</h1>
        <div className="leaderboard-container">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>{scores.map(mapUserScore)}</tbody>
          </table>
          <div className="text-center">
            <button onClick={goToHome} className="main-btn ">
              HOME
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
