import { CircularProgress, Button, Dialog, DialogActions, DialogTitle, Box } from "@mui/material";
import React from "react";

type props = {
  isDeleting: boolean;
  id?: string;
  open: boolean;
  handleClose: (confirm: boolean, id?: string) => Promise<void> | void;
};

export default function DeleteDialog({ id, isDeleting, handleClose, open }: props) {
  return (
    <Dialog open={open} aria-labelledby="alert-dialog-title">
      {isDeleting ? (
        <Box p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete?"}</DialogTitle>
          <DialogActions>
            <Button color="warning" onClick={() => void handleClose(false)}>
              No
            </Button>
            <Button variant="contained" onClick={() => void handleClose(true, id)} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
