import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "../screens/Login";
import Game from "../screens/Game";
import Leaderboard from "../screens/Leaderboard";
import PageNotFound from "../screens/PageNotFound";

function Routing(props) {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/game" element={<Game />} />
      <Route path="/leaderboard" element={<Leaderboard />} />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default Routing;
