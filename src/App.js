import { useState } from 'react'
import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Container,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Fab, FormControl, FormLabel,
  IconButton, InputAdornment, Radio, RadioGroup,
  Stack,
  TextField, Toolbar,
  Typography
} from "@mui/material";
import {Add, AddCircleOutline, Clear, Edit, RemoveCircleOutline} from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2";

// TODO: https://mui.com/material-ui/react-button/#material-you-version


// Counter Component
function Counter({ value, name, decrementBy, incrementBy, color,
                   decrementOnClick, incrementOnClick,
                   editOnClick, deleteOnClick
                 }) {
  return (
    <Box
      sx={{
        border: 2,
        borderColor: `${color}.main`,
        borderRadius: '4px',
      }}
    >
      <AppBar color={color} position="static" elevation={0}>
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
      <Stack alignItems="center" direction="row" spacing={2} m={2}>
        <Button variant="outlined" size="large" fullWidth color={color}
                startIcon={<RemoveCircleOutline/>}
                onClick={decrementOnClick}>
          {decrementBy}
        </Button>
        <Box my={2} sx={{width: 1}}>
          <Typography variant="h3" sx={{textAlign: 'center'}}>{value}</Typography>
        </Box>
        <Button variant="outlined" size="large" fullWidth color={color}
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
// TODO: make prop and function names consistent
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
  const [colorSelection, setColorSelection] = useState(null)
  
  // Function for resetting form input states
  function resetInputStates() {
    setNameInput({value: null, errorMessage: null})
    setValueInput({value: null, errorMessage: null})
    setIncrementByInput({value: null, errorMessage: null})
    setDecrementByInput({value: null, errorMessage: null})
    setColorSelection(null)
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

  // Update color selection
  function colorRadioGroupOnChangeHandler(e) {
    setColorSelection(e.target.value)
  }

  // Reset form on close
  function onCloseHandler() {
    resetInputStates()
    closeOnClick()
  }

  // Helper function for numeric field validation.
  // Sets error message if value couldn't be parsed into an int.
  // Returns parsed int (NaN if none could be parsed).
  function sanitizeAndValidateNumericInput(inputState, setInputState) {
    const parsedValue = parseInt(inputState.value)
    // Set error message if int can't be parsed
    if (isNaN(parsedValue)) {
      setInputState({
        ...inputState,
        errorMessage: 'Value must be an integer.'
      })
    }
    return parsedValue
  }

  // Attempts to validate form inputs. If everything is valid, update the counter with new values.
  // Set error messages on inputs that are invalid.
  // Returns true if errors were detected, false if not.
  // TODO: rename to better indicate return value
  function validateFormAndUpdateCounterIfValid() {
    const newCounter = {...currentCounter}
    let errorsDetected = false

    // Cleanup name and ensure it isn't blank
    if (nameInput.value !== null) {
      const trimmedName = nameInput.value.trim()
      // Show error on input if name is blank
      if (trimmedName === '') {
        errorsDetected = true
        setNameInput({
          ...nameInput,
          errorMessage: 'Name cannot be blank.'
        })
      } else {
        newCounter.name = trimmedName
      }
    }
    // Ensure numeric inputs can be parsed into ints
    if (valueInput.value !== null) {
      const sanitizedValue = sanitizeAndValidateNumericInput(valueInput, setValueInput)
      if (isNaN(sanitizedValue)) {
        errorsDetected = true
      } else {
        newCounter.value = sanitizedValue
      }
    }
    if (decrementByInput.value !== null) {
      const sanitizedDecrementBy = sanitizeAndValidateNumericInput(decrementByInput, setDecrementByInput)
      if (isNaN(sanitizedDecrementBy)) {
        errorsDetected = true
      } else {
        newCounter.decrementBy = sanitizedDecrementBy
      }
    }
    if (incrementByInput.value !== null) {
      const sanitizedIncrementBy = sanitizeAndValidateNumericInput(incrementByInput, setIncrementByInput)
      if (isNaN(sanitizedIncrementBy)) {
        errorsDetected = true
      } else {
        newCounter.incrementBy = sanitizedIncrementBy
      }
    }
    // Set selected color
    if (colorSelection !== null) {
      newCounter.color = colorSelection
    }

    // Update the counter if everything checks out
    if (!errorsDetected) {
      setUpdatedCounter(newCounter)
    }

    return errorsDetected
  }

  // Validate form inputs and update counter if successful
  function onConfirmHandler() {
    // Update form state and check for errors
    const errorsDetected = validateFormAndUpdateCounterIfValid()

    // Close dialog on success
    if (!errorsDetected) {
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
        <Box>
          <FormControl fullWidth>
            <FormLabel
              color={colorSelection !== null ? colorSelection : 'primary'}
              id="color-radio-group-label"
            >
              Color:
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="color-radio-group-label"
              onChange={colorRadioGroupOnChangeHandler}
              defaultValue={currentCounter.color !== '' ? currentCounter.color : 'primary'}
            >
              <Radio size="large"
                     color="primary" sx={{color: 'primary.main'}}
                     value="primary"
              />
              <Radio size="large"
                     color="secondary" sx={{color: 'secondary.main'}}
                     value="secondary"
              />
              <Radio size="large"
                     color="success" sx={{color: 'success.main'}}
                     value="success"
              />
              <Radio size="large"
                     color="warning" sx={{color: 'warning.main'}}
                     value="warning"
              />
              <Radio size="large"
                     color="error" sx={{color: 'error.main'}}
                     value="error"
              />
            </RadioGroup>
          </FormControl>
        </Box>
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
        name: 'Counter 0',
        value: 0,
        incrementBy: 1,
        decrementBy: 1,
        color: 'primary',
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
      name: `Counter ${counterNumber}`,
      value: 0,
      incrementBy: 1,
      decrementBy: 1,
      color: 'primary',
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
        color: '',
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
        color: '',
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
          name={counters[i].name}
          value={counters[i].value}
          decrementBy={counters[i].decrementBy}
          incrementBy={counters[i].incrementBy}
          color={counters[i].color}
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
