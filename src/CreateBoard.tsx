// CreateBoard.js
import React, { useState } from "react";
import { db } from "./firebaseConfig.ts";
import { collection, addDoc } from "firebase/firestore";
import { TextField, Button, MenuItem, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomSnackBar from "./snackbar.tsx";

export const useSendStates = () => {
  const [title, setTitle] = useState("");
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  return {
    title,
    setTitle,
    showSnackBar,
    setShowSnackBar,
    snackBarMessage,
    setSnackBarMessage,
  };
};
const CreateBoard = () => {
  const [template, setTemplate] = useState(
    "Went well - To improve - Action items"
  );

  const navigate = useNavigate();
  const {
    title,
    setTitle,
    setShowSnackBar,
    showSnackBar,
    setSnackBarMessage,
    snackBarMessage,
  } = useSendStates();
  const createBoard = async () => {
    const docRef = await addDoc(collection(db, "retroboards"), {
      title,
      template,
      columns: template
        .split("-")
        .map((col, index) => ({ id: index, name: col, cards: [] })),

      createdAt: new Date(),
    });
    console.log("the docref", docRef);
    setShowSnackBar(true);
    setSnackBarMessage(`Board Created! Share this ID: ${docRef.id}`);
    navigate(`board/${docRef.id}`);
  };

  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyItems: "center",
        gap: 2,
        width: "100%",
        height: "100%",
      }}
    >
      <CustomSnackBar
        showSnackBar={showSnackBar}
        snackBarMessage={snackBarMessage}
        setShowSnackBar={setShowSnackBar}
      />
      <TextField
        label="Board Title"
        value={title}
        sx={{ width: 300 }}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        select
        label="Template"
        value={template}
        sx={{ width: 300 }}
        onChange={(e) => setTemplate(e.target.value)}
      >
        <MenuItem value="Went well - To improve - Action items">
          Went well - To improve - Action items
        </MenuItem>
        <MenuItem value="Start - Stop - Continue">
          Start - Stop - Continue
        </MenuItem>
      </TextField>
      <Button variant="contained" onClick={createBoard}>
        Create Retro
      </Button>
    </Box>
  );
};

export default CreateBoard;
