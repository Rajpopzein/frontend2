import React, { useState } from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { Avatar, TextField, Button, CircularProgress, Snackbar, Alert } from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL;

const Management = ({ open, event, handleClose, userData }) => {
  const [userDatas, setUserDatas] = useState(userData);
  const [anchorEl] = useState(event);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDatas((prev) => ({ ...prev, [name]: value }));
  };

  // Handle update
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/auth/update/${userDatas.id}`, userDatas);
      if(response.statusCode === 200){
        localStorage.setItem("token", response.data.token);
      }
      setSnackbar({ open: true, message: "Profile updated successfully!", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Error updating profile. Please try again.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Handle close snackbar
  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: "", severity: "" });
  };

  return (
    <Popover
      id="user-profile-popover"
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      sx={{
        p: "1rem",
        marginLeft: "10rem",
      }}
    >
      <div style={{ padding: "1rem" }}>
        <h2>Profile Details</h2>
        <form className="flex flex-dir-col a-center" style={{ marginTop: "1rem" }}>
          <Avatar>{userDatas.username[0]}</Avatar>
          <br />
          <TextField
            name="username"
            variant="standard"
            value={userDatas.username}
            onChange={handleInputChange}
            placeholder="User Name"
          />
          <br />
          <TextField
            name="email"
            variant="standard"
            value={userDatas.email}
            onChange={handleInputChange}
            placeholder="Email"
          />
          <div className="flex" style={{ marginTop: "1rem", gap: "1rem" }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : "Update"}
            </Button>
            <Button 
              variant="contained" 
              className="secondary"
              onClick={() => handleClose(false)}
            >
              Close
            </Button>
          </div>
        </form>
      </div>
      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Popover>
  );
};

export default Management;
