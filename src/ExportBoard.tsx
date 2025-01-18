import html2canvas from "html2canvas";

const exportAsImage = async () => {
  const boardElement = document.getElementById("board-container");
  const canvas = boardElement && (await html2canvas(boardElement));
  const link = document.createElement("a");
  link.download = "retro-board.png";
  link.href = (canvas && canvas.toDataURL()) || "";
  if (link.href != "") link.click();
};

{
  /* <Button variant="contained" onClick={exportAsImage}>
  Export as Screenshot
</Button>; */
}
