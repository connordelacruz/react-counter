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
// TODO: make prop names consistent
function EditCounterDialog({ open,
                             currentCounter, setUpdatedCounter,
                             closeOnClick
                           }) {
  // Form input states
  // Initialize values to null, if they're unchanged we'll ignore them when updating the counter
  const [nameInput, setNameInput] = useState({
    value: null,
    errorMessage: null,
  })
  const [valueInput, setValueInput] = useState({
    value: null,
    errorMessage: null,
  })
  const [incrementByInput, setIncrementByInput] = useState({
    value: null,
    errorMessage: null,
  })
  const [decrementByInput, setDecrementByInput] = useState({
    value: null,
    errorMessage: null,
  })
  
  // Function for resetting form input states
  function resetInputStates() {
    setNameInput({value: null, errorMessage: null})
    setValueInput({value: null, errorMessage: null})
    setIncrementByInput({value: null, errorMessage: null})
    setDecrementByInput({value: null, errorMessage: null})
  }

  // Returns onChange handler function for an input
  function inputOnChangeHandler(setStateMethod) {
    return (e) => {
      const newInput = {
        value: e.target.value,
        // Clear errors
        errorMessage: null,
      }
      setStateMethod(newInput)
    }
  }

  // Reset form on close
  function onCloseHandler() {
    resetInputStates()
    closeOnClick()
  }

  // Helper function for numeric field validation
  function sanitizeAndValidateNumericInput(inputState) {
    const validatedInputState = {...inputState}
    
    // Attempt to parse int
    validatedInputState.value = parseInt(inputState.value)
    if (isNaN(validatedInputState.value)) {
      validatedInputState.errorMessage = 'Value must be an integer.'
    }
    return validatedInputState
  }

  // Cleans up non-null form values, then attempts to validate them.
  // If invalid, update state of each to show error message and set error to true.
  // Returns true if everything is valid, false if there's any issues
  function sanitizeAndValidateFormValues() {
    let errorsDetected = false

    // Cleanup name and ensure it isn't blank
    if (nameInput.value !== null) {
      const sanitizedName = {
        value: nameInput.value.trim(),
        errorMessage: null,
      }
      if (sanitizedName.value === '') {
        errorsDetected = true
        sanitizedName.errorMessage = 'Name cannot be blank.'
      }
      // Update state
      setNameInput(sanitizedName)
    }
    // Ensure numeric inputs can be parsed into ints
    if (valueInput.value !== null) {
      const sanitizedValue = sanitizeAndValidateNumericInput(valueInput)
      errorsDetected &= sanitizedValue.errorMessage !== null
      // Update state
      setValueInput(sanitizedValue)
    }
    if (decrementByInput.value !== null) {
      const sanitizedDecrementBy = sanitizeAndValidateNumericInput(decrementByInput)
      errorsDetected &= sanitizedDecrementBy.errorMessage !== null
      // Update state
      setDecrementByInput(sanitizedDecrementBy)
    }
    if (incrementByInput.value !== null) {
      const sanitizedIncrementBy = sanitizeAndValidateNumericInput(incrementByInput)
      errorsDetected &= sanitizedIncrementBy.errorMessage !== null
      // Update state
      setIncrementByInput(sanitizedIncrementBy)
    }

    // If everything checks out, return true, else false
    return errorsDetected
  }

  // Validate form inputs and update counter if successful
  function onConfirmHandler() {
    // Update form state and check for errors
    const errorsDetected = sanitizeAndValidateFormValues()

    // Update counter and close dialog on success
    if (!errorsDetected) {
      const newCounter = {...currentCounter}
      // Update counter values
      if (nameInput.value !== null) {
        newCounter.name = nameInput.value
      }
      if (valueInput.value !== null) {
        newCounter.value = valueInput.value
      }
      if (decrementByInput.value !== null) {
        newCounter.decrementBy = decrementByInput.value
      }
      if (incrementByInput.value !== null) {
        newCounter.incrementBy = incrementByInput.value
      }

      // Update counter
      setUpdatedCounter(newCounter)
      // Close dialog
      onCloseHandler()
    }
  }

  return (
    <Dialog open={open} onClose={onCloseHandler}>
      <DialogTitle>Edit Counter</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} my={2}>
          <Grid xs={12}>
            <TextField
              fullWidth
              inputProps={{ name: 'name' }}
              error={nameInput.errorMessage !== null}
              helperText={nameInput.errorMessage}
              onChange={inputOnChangeHandler(setNameInput)}
              label="Name"
              defaultValue={currentCounter.name}
            />
          </Grid>
          <Grid xs={12}>
          <TextField
            fullWidth
            type="number"
            inputProps={{ name: 'value' }}
            InputLabelProps={{
              shrink: true,
            }}
            error={valueInput.errorMessage !== null}
            helperText={valueInput.errorMessage}
            onChange={inputOnChangeHandler(setValueInput)}
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
              }}
              error={decrementByInput.errorMessage !== null}
              helperText={decrementByInput.errorMessage}
              onChange={inputOnChangeHandler(setDecrementByInput)}
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
              }}
              error={incrementByInput.errorMessage !== null}
              helperText={incrementByInput.errorMessage}
              onChange={inputOnChangeHandler(setIncrementByInput)}
              label="Add By"
              defaultValue={currentCounter.incrementBy}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseHandler}>
          Cancel
        </Button>
        <Button onClick={onConfirmHandler}>
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
      currentCounter: {
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
        currentCounter: targetCounter,
      })
    }
  }

  // Passed to EditDialog to update the counter
  function setUpdatedCounter(updatedCounter) {
    if (editDialog.target !== null && counters[editDialog.target] !== undefined) {
      const newCounters = [...counters]
      newCounters[editDialog.target] = {...updatedCounter}
      setCounters(newCounters)
    }
  }

  // Close button click
  function handleEditCloseButtonClick() {
    // Clear counter and close dialog
    setEditDialog({
      open: false,
      target: null,
      currentCounter: {
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
        currentCounter={editDialog.currentCounter}
        setUpdatedCounter={setUpdatedCounter}
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
