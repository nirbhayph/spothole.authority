// this component is the modal which appears on clicking
// a report in the dashboard screen. it comprises
// of the card for showing all the details of the report
// and allows editing for it too.
import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import DetailedDataCard from "./../modal_data_card";

export default function DetailedDataModal(props) {
  const [open, setOpen] = React.useState(true);
  const scroll = "paper";
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xl"));

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullScreen={fullScreen}
      >
        <DialogTitle id="scroll-dialog-title" style={{ textAlign: "center" }}>
          Report # {props.caseNumber}
        </DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DetailedDataCard data={props} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
