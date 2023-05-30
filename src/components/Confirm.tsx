import { CircularProgress, Button, Dialog, DialogActions, DialogTitle, Box } from "@mui/material";
import React from "react";

type props = {
  isLoading: boolean;
  open: boolean;
  setOpen: (value: boolean) => void;
  onClickHandler: (confirm: boolean) => Promise<void> | void;
  text: string;
};

export default function Confirm({ isLoading, onClickHandler, open, text, setOpen }: props) {
  return (
    <Dialog open={open} aria-labelledby="alert-dialog-title">
      {isLoading ? (
        <Box p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <DialogTitle id="alert-dialog-title">{text}</DialogTitle>
          <DialogActions>
            <Button
              color="warning"
              onClick={() => {
                void onClickHandler(false);
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                void onClickHandler(true);
                setOpen(false);
              }}
              variant="contained"
              autoFocus
            >
              Confirm
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
