import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  IconButton,
  Typography,
  TextField,
  Grid,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CardActions,
} from "@mui/material";
import { ThumbUp, ThumbDown, Delete, Edit } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { db } from "./firebaseConfig.ts";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { useSendStates } from "./CreateBoard.tsx";
import CustomSnackBar from "./snackbar.tsx";

interface Cards {
  id: string;
  content: string;
  votes: number;
}

interface Column {
  id: string;
  name: string;
  cards: Cards[];
}

async function saveInFireStore(data: any, id: string) {
  try {
    const docRef = doc(db, "retroboards", id);
    const docSnap = await getDoc(docRef);
    let docobj = docSnap.data();
    if (docobj) docobj.columns = data;
    const boardsCollectionRef = collection(db, "retroboards");
    const boardDocRef = doc(boardsCollectionRef, id);
    console.log("data from save", data, boardDocRef);
    await setDoc(boardDocRef, docobj);
    console.log("data saved successfully");
  } catch (err) {
    console.log("error ", err);
  }
}

const Board = () => {
  const boardId = useParams();
  const { title, setTitle, showSnackBar, snackBarMessage, setShowSnackBar } =
    useSendStates();
  const [columns, setColumns] = useState<Column[]>([
    { id: "0", name: "What Went Well", cards: [] },
    { id: "1", name: "Improvements", cards: [] },
    { id: "2", name: "Action Items", cards: [] },
  ]);
  useEffect(() => {
    saveInFireStore(columns, boardId.id as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns]);
  const docRef = doc(db, "retroboards", boardId.id as string);
  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, (docSnapShot) => {
      if (docSnapShot.exists()) {
        const data = docSnapShot.data();
        if (data && data.columns) {
          console.log("the data ", data);
          setTitle(data.title);
          setColumns(data.columns);
        } else {
          console.log("board  does not exist.");
        }
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editPoint, setEditPoint] = useState<Cards | null>(null);

  const handleAddPoint = (columnId: string) => {
    console.log("columnId", columnId);
    const newCard: Cards = {
      id: Date.now().toString(),
      content: "",
      votes: 0,
    };
    setColumns(
      columns.map((col) => {
        console.log("column", col);
        return col.id === columnId
          ? { ...col, cards: [...col.cards, newCard] }
          : col;
      })
    );
  };

  console.log("columns", columns);

  const handleEditPoint = () => {
    if (editPoint) {
      setColumns(
        columns.map((col) => ({
          ...col,
          cards: col.cards.map((point) =>
            point.id === editPoint.id
              ? { ...point, content: editPoint.content }
              : point
          ),
        }))
      );
      setEditPoint(null);
      setEditDialogOpen(false);
    }
  };

  const handleDeletePoint = (columnId: string, pointId: string) => {
    setColumns(
      columns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: col.cards.filter((point) => point.id !== pointId),
            }
          : col
      )
    );
  };

  const handleVote = (columnId: string, pointId: string, delta: number) => {
    setColumns(
      columns?.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: col.cards.map((point) =>
                point.id === pointId
                  ? { ...point, votes: point.votes + delta }
                  : point
              ),
            }
          : col
      )
    );
  };

  return (
    <div>
      <CustomSnackBar
        showSnackBar={showSnackBar}
        snackBarMessage={snackBarMessage}
        setShowSnackBar={setShowSnackBar}
      />
      <Box id="board-container" sx={{}}>
        <Typography variant="h4" textAlign={"center"} margin={2}>
          {title}
        </Typography>
        <Grid container spacing={3}>
          {columns?.map((column) => (
            <Grid item xs={12} md={4} key={column.id}>
              <Box
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "16px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                {/* Editable Column Title */}
                <TextField
                  fullWidth
                  variant="outlined"
                  value={column.name}
                  onChange={(e) =>
                    setColumns(
                      columns.map((col) =>
                        col.id === column.id
                          ? { ...col, name: e.target.value }
                          : col
                      )
                    )
                  }
                  sx={{ marginBottom: "16px", fontWeight: "bold" }}
                />

                {/* Add Button */}
                {/* <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddPoint(column.id)}
                  sx={{ marginBottom: "16px" }}
                >
                  Add Point
                </Button> */}
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleAddPoint(column.id)}
                  sx={{
                    marginBottom: 2,
                    width: "20%",
                    display: "flex",
                    justifyContent: "center",
                    justifySelf: "center",
                  }}
                >
                  +
                </Button>

                {column.cards.map((point) => (
                  <Card
                    sx={{ marginBottom: "16px", boxShadow: 2 }}
                    key={point.id}
                  >
                    <CardContent>
                      {/* Editable Point Content */}
                      <TextField
                        fullWidth
                        multiline
                        value={point.content}
                        onChange={(e) =>
                          setColumns(
                            columns.map((col) =>
                              col.id === column.id
                                ? {
                                    ...col,
                                    cards: col.cards.map((p) =>
                                      p.id === point.id
                                        ? { ...p, content: e.target.value }
                                        : p
                                    ),
                                  }
                                : col
                            )
                          )
                        }
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ marginTop: "8px", display: "block" }}
                      >
                        Votes: {point.votes}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <IconButton
                        onClick={() => handleVote(column.id, point.id, 1)}
                        color="success"
                      >
                        <ThumbUp />
                      </IconButton>
                      <IconButton
                        onClick={() => handleVote(column.id, point.id, -1)}
                        color="error"
                      >
                        <ThumbDown />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setEditPoint(point);
                          setEditDialogOpen(true);
                        }}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeletePoint(column.id, point.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Dialog for Editing Points */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
      >
        <DialogTitle>Edit Point</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={editPoint?.content || ""}
            onChange={(e) =>
              setEditPoint(
                editPoint ? { ...editPoint, content: e.target.value } : null
              )
            }
            label="Point Content"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditPoint} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Board;
