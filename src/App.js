import { useState } from 'react'
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import {AddBox, AddCircleOutline, Clear, Edit, RemoveCircleOutline} from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2";


// Counter Component
function Counter({ value, name,
                   nameOnChange, decrementOnClick, incrementOnClick,
                   deleteOnClick
                 }) {
  return (
    <Box>
      <Grid container>
        <Grid xs={10}>
          <TextField
            variant="standard" size="small" fullWidth
            value={name}
            onChange={(event) => {
              nameOnChange(event.target.value)
            }}
          />
        </Grid>
        <Grid xs={2} sx={{textAlign: 'right'}}>
          <ButtonGroup>
            <IconButton>
              <Edit/>
            </IconButton>
            <IconButton onClick={deleteOnClick}>
              <Clear/>
            </IconButton>
          </ButtonGroup>
        </Grid>
      </Grid>
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
      >
        <Button
          variant="outlined" size="large" fullWidth
          onClick={decrementOnClick}
        >
          <RemoveCircleOutline/>
        </Button>
        <Box
          my={2} sx={{width: 1}}
        >
          <Typography
            variant="h3" sx={{textAlign: 'center'}}
          >
            {value}
          </Typography>
        </Box>
        <Button
          variant="outlined" size="large" fullWidth
          onClick={incrementOnClick}
        >
          <AddCircleOutline/>
        </Button>
      </Stack>
    </Box>
  )
}


// Delete confirmation dialog
// TODO: make code consistent, add prop for target name
function DeleteCounterDialog({ open, confirmOnClick, closeOnClick }) {
  return (
    <Dialog
      open={open}
      onClose={closeOnClick}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Delete Counter
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this counter?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeOnClick} autoFocus>
          Cancel
        </Button>
        <Button onClick={confirmOnClick}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}


// List of Counters
function CounterList() {
  // ================================================================================
  // STATE
  // ================================================================================
  // Counters list
  const [counters, setCounters] = useState(
    [
      {
        value: 0,
        incrementBy: 1,
        decrementBy: 1,
        name: 'Counter 0',
      }
    ]
  )
  // Delete dialog
  const [deleteDialog, setDeleteDialog] = useState(
    {
      open: false,
      target: null,
    }
  )

  // ================================================================================
  // COUNTER HANDLER FUNCTIONS
  // ================================================================================
  // Increment/decrement counter
  function handleCounterButtonClick(i, amountToAdd) {
    const newCounters = [...counters]
    newCounters[i].value = newCounters[i].value + amountToAdd
    setCounters(newCounters)
  }

  // Modify counter name
  function handleNameTextInputChange(i) {
    return (newName) => {
      const newCounters = [...counters]
      newCounters[i].name = newName
      setCounters(newCounters)
    }
  }

  // Open delete confirmation dialog
  function handleDeleteButtonClick(i) {
    return () => {
      // Set delete dialog target and open confirmation
      setDeleteDialog({open: true, target: i})
    }
  }

  // ================================================================================
  // DELETE CONFIRMATION DIALOG HANDLER FUNCTIONS
  // ================================================================================

  // Confirm button click
  function handleDeleteConfirmButtonClick() {
    if (deleteDialog.target !== null) {
      // Delete the target counter
      const newCounters = [...counters]
      newCounters.splice(deleteDialog.target, 1)
      setCounters(newCounters)
    }
    // Clear delete target and close dialog
    handleDeleteCloseButtonClick()
  }

  // Close button click
  function handleDeleteCloseButtonClick() {
    // Clear delete target and close dialog
    setDeleteDialog({open: false, target: null})
  }

  // ================================================================================
  // TODO: organize code sections from here
  // ================================================================================

  function renderCounter(i) {
    return (
      <Counter
        value={counters[i].value}
        name={counters[i].name}
        nameOnChange={handleNameTextInputChange(i)}
        incrementOnClick={() => handleCounterButtonClick(i, counters[i].incrementBy)}
        decrementOnClick={() => handleCounterButtonClick(i, -1 * counters[i].decrementBy)}
        deleteOnClick={handleDeleteButtonClick(i)}
      />
    )
  }

  function handleNewCounterButtonClick() {
    const counterNumber = counters.length
    const newCounter = {
      value: 0,
      incrementBy: 1,
      decrementBy: 1,
      name: `Counter ${counterNumber}`,
    }
    const newCounters = [...counters, newCounter]
    setCounters(newCounters)
  }

  const counterList = counters.map((counter, i) => {
    return (
      <Box key={i}>
        {renderCounter(i)}
      </Box>
    )
  })
  return (
    <Box>
      <Stack
        divider={<Divider orientation="horizontal" flexItem />}
        spacing={2}
      >
        {counterList}
      </Stack>
      <Box
        sx={{ my: 4 }}
      >
        <Button
          variant="contained" size="large" disableElevation fullWidth
          startIcon={<AddBox/>}
          onClick={() => handleNewCounterButtonClick()}
        >
          Create New Counter
        </Button>
      </Box>
      <DeleteCounterDialog
        open={deleteDialog.open}
        confirmOnClick={handleDeleteConfirmButtonClick}
        closeOnClick={handleDeleteCloseButtonClick}
      />
    </Box>
  )
}


// Root component
export default function AppContainer() {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            my: 4,
            width: 1,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
          >
            Counters
          </Typography>
          <CounterList />
        </Box>
      </Container>
    )
}
