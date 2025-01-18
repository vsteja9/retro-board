import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const Navbar = ({ onExport }) => {
  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#3f51b5", boxShadow: "none" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Section */}
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: "bold", marginLeft: 5 }}
        >
          Boards
        </Typography>

        {/* Right Section */}
        <Box>
          <Button
            variant="contained"
            onClick={onExport}
            sx={{
              backgroundColor: "#fff",
              color: "#3f51b5",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            }}
          >
            Export
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
