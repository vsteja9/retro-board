import React from "react";
import CreateBoard from "./CreateBoard.tsx";
import Navbar from "./NavBar.tsx";
import html2canvas from "html2canvas";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Board from "./Board.tsx";

function App() {
  const exportAsImage = async () => {
    const boardElement = document.getElementById("board-container");
    const canvas = boardElement && (await html2canvas(boardElement));
    const link = document.createElement("a");
    link.download = "retro-board.png";
    link.href = (canvas && canvas.toDataURL()) || "";
    if (link.href !== "") link.click();
  };
  return (
    <>
      <Navbar onExport={exportAsImage} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CreateBoard />}></Route>
          <Route path="/board/:id" element={<Board  />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
