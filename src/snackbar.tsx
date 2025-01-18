import { Snackbar, Alert } from "@mui/material";
import React from "react";

export default function CustomSnackBar({
  showSnackBar,
  snackBarMessage,
  setShowSnackBar,
}) {
  console.log("triggered snackbar", showSnackBar, snackBarMessage);
  return (
    <Snackbar
      open={showSnackBar}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={3000}
      onClose={() => setShowSnackBar(false)}
    >
      <Alert
        onClose={() => {
          setShowSnackBar(false);
        }}
        severity={snackBarMessage.endsWith("Again.") ? "error" : "success"}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {snackBarMessage}
      </Alert>
    </Snackbar>
  );
}
