import { useState } from 'react'
import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Container,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Divider, Fab,
  IconButton, InputAdornment,
  Stack,
  TextField, Toolbar,
  Typography
} from "@mui/material";
import {Add, AddBox, AddCircleOutline, Clear, Edit, RemoveCircleOutline} from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2";

// TODO: https://mui.com/material-ui/react-button/#material-you-version


// Counter Component
function Counter({ value, name, decrementBy, incrementBy,
                   decrementOnClick, incrementOnClick,
                   editOnClick, deleteOnClick
                 }) {
  return (
    <Box>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>{name}</Typography>
          <ButtonGroup>
            <IconButton color="inherit" onClick={editOnClick}>
              <Edit/>
            </IconButton>
            <IconButton color="inherit" onClick={deleteOnClick}>
              <Clear/>
            </IconButton>
          </ButtonGroup>
        </Toolbar>
      </AppBar>
      <Stack alignItems="center" direction="row" spacing={2} my={2}>
        <Button variant="outlined" size="large" fullWidth
                startIcon={<RemoveCircleOutline/>}
                onClick={decrementOnClick}>
          {decrementBy}
        </Button>
        <Box my={2} sx={{width: 1}}>
          <Typography variant="h3" sx={{textAlign: 'center'}}>{value}</Typography>
        </Box>
        <Button variant="outlined" size="large" fullWidth
                startIcon={<AddCircleOutline/>}
                onClick={incrementOnClick}>
          {incrementBy}
        </Button>
      </Stack>
    </Box>
  )
}


// Delete confirmation dialog
function DeleteCounterDialog({ open, targetName, confirmOnClick, closeOnClick }) {
  return (
    <Dialog
      open={open}
      onClose={closeOnClick}
    >
      <DialogTitle>Delete Counter?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete <b>{targetName}</b>?
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


// Edit counter dialog
function EditCounterDialog({ open,
                             currentCounter, setForm,
                             confirmOnClick, closeOnClick
                           }) {

  // TODO: just get it to work without validation
  // TODO: figure out validation on submit

  function onUpdateField(e) {
    const newForm = {
      ...currentCounter,
      [e.target.name]: e.target.value,
    }
    setForm(newForm)
  }

  // TODO: remove/use for validation?
  // function onUpdateNumericField(e) {
  //   const numericValMatch = e.target.value.match(/-?\d+/g)
  //   // Update input value then pass this on to the usual handler
  //   e.target.value = numericValMatch === null ? '' : numericValMatch[0]
  //   onUpdateField(e)
  // }


  return (
    <Dialog open={open} onClose={closeOnClick}>
      <DialogTitle>Edit Counter</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} my={2}>
          <Grid xs={12}>
            <TextField
              fullWidth
              inputProps={{ name: 'name' }}
              onChange={onUpdateField}
              label="Name"
              defaultValue={currentCounter.name}
            />
          </Grid>
          <Grid xs={12}>
          <TextField
            fullWidth
            type="number"
            InputLabelProps={{
              name: 'value',
              shrink: true,
            }}
            onChange={onUpdateField}
            label="Value"
            defaultValue={currentCounter.value}
          />
          </Grid>
          <Grid xs={6}>
            <TextField
              fullWidth
              type="number"
              InputProps={{
                name: 'decrementBy',
                startAdornment: (
                  <InputAdornment position="start">
                    <RemoveCircleOutline/>
                  </InputAdornment>
                ),
                shrink: true,
              }}
              onChange={onUpdateField}
              label="Subtract By"
              defaultValue={currentCounter.decrementBy}
            />
          </Grid>
          <Grid xs={6}>
            <TextField
              fullWidth type="number"
              InputProps={{
                name: 'incrementBy',
                startAdornment: (
                  <InputAdornment position="start">
                    <AddCircleOutline/>
                  </InputAdornment>
                ),
                shrink: true,
              }}
              onChange={onUpdateField}
              label="Add By"
              defaultValue={currentCounter.incrementBy}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeOnClick}>
          Cancel
        </Button>
        <Button onClick={confirmOnClick}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}


// List of Counters
function CounterList() {
  // ================================================================================
  // STATE AND HELPER FUNCTIONS
  // ================================================================================
  // --------------------------------------------------------------------------------
  // Counters list
  // --------------------------------------------------------------------------------
  // State
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

  // Increment/decrement counter
  function handleCounterButtonClick(i, amountToAdd) {
    const newCounters = [...counters]
    newCounters[i].value = newCounters[i].value + amountToAdd
    setCounters(newCounters)
  }

  // New counter button click
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

  // --------------------------------------------------------------------------------
  // Delete dialog
  // --------------------------------------------------------------------------------
  // State
  const [deleteDialog, setDeleteDialog] = useState(
    {
      open: false,
      target: null,
    }
  )

  // Open delete confirmation dialog
  function handleDeleteButtonClick(i) {
    return () => {
      // Set delete dialog target and open confirmation
      setDeleteDialog({open: true, target: i})
    }
  }

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

  // --------------------------------------------------------------------------------
  // Edit dialog
  // --------------------------------------------------------------------------------
  // State
  const [editDialog, setEditDialog] = useState(
    {
      open: false,
      target: null,
      form: {
        name: '',
        value: '',
        decrementBy: '',
        incrementBy: '',
      },
    }
  )

  // Open edit dialog
  function handleEditButtonClick(i) {
    return () => {
      const targetCounter = {...counters[i]}
      setEditDialog({
        open: true,
        target: i,
        form: targetCounter,
      })
    }
  }

  // TODO: pass in function to set validated counter instead
  // Update edit form (passed as prop to EditDialog)
  function setEditForm(newForm) {
    setEditDialog({
      ...editDialog,
      form: {...newForm},
    })
  }

  // Confirm button click
  function handleEditConfirmButtonClick() {
    // TODO: rename to indicate that values should be validated
    if (editDialog.target !== null && counters[editDialog.target] !== undefined) {
      const newCounters = [...counters]
      const updatedCounter = {
        name: editDialog.form.name.trim(),
        value: parseInt(editDialog.form.value),
        decrementBy: parseInt(editDialog.form.decrementBy),
        incrementBy: parseInt(editDialog.form.incrementBy),
      }
      newCounters[editDialog.target] = updatedCounter
      setCounters(newCounters)
    }
    handleEditCloseButtonClick()
  }

  // Close button click
  function handleEditCloseButtonClick() {
    // Clear counter and close dialog
    setEditDialog({
      open: false,
      target: null,
      form: {
        name: '',
        value: '',
        decrementBy: '',
        incrementBy: '',
      }
    })
  }

  // ================================================================================
  // RENDER COUNTER LIST
  // ================================================================================

  // Render list of counters from state
  const counterList = counters.map((counter, i) => {
    return (
      <Box key={i}>
        <Counter
          value={counters[i].value}
          name={counters[i].name}
          decrementBy={counters[i].decrementBy}
          incrementBy={counters[i].incrementBy}
          incrementOnClick={() => handleCounterButtonClick(i, counters[i].incrementBy)}
          decrementOnClick={() => handleCounterButtonClick(i, -1 * counters[i].decrementBy)}
          editOnClick={handleEditButtonClick(i)}
          deleteOnClick={handleDeleteButtonClick(i)}
        />
      </Box>
    )
  })

  return (
    <Box>
      <Stack spacing={2}>{counterList}</Stack>
      <Box sx={{
        my: 4,
        textAlign: 'right'
      }}>
        <Fab color="success" variant="extended" size="large"
             onClick={() => handleNewCounterButtonClick()}>
          <Add sx={{ mr: 1 }}/>
          Create New Counter
        </Fab>
      </Box>
      <DeleteCounterDialog
        open={deleteDialog.open}
        targetName={deleteDialog.target !== null ? counters[deleteDialog.target].name : ''}
        confirmOnClick={handleDeleteConfirmButtonClick}
        closeOnClick={handleDeleteCloseButtonClick}
      />
      <EditCounterDialog
        open={editDialog.open}
        currentCounter={editDialog.form} setForm={setEditForm}
        confirmOnClick={handleEditConfirmButtonClick}
        closeOnClick={handleEditCloseButtonClick}
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
          <Typography variant="h4" component="h1" gutterBottom>Counters</Typography>
          <CounterList />
        </Box>
      </Container>
    )
}
