import React from 'react'
import { Avatar, TextField, Button, CircularProgress, Snackbar, Alert } from "@mui/material";

const Alerts = ({snackbars , handleSnackbarClose }) => {
  return (
    <Snackbar
        open={snackbars.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbars.severity} 
          sx={{ width: "100%" }}
        >
          {snackbars.message}
        </Alert>
      </Snackbar>
  )
}

export default Alerts