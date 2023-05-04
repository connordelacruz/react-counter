import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField
} from "@mui/material"
import {useState} from "react"
import Grid from "@mui/material/Unstable_Grid2"
import {AddCircleOutline, Edit, Numbers, RemoveCircleOutline, RestartAlt} from "@mui/icons-material"

// Delete confirmation dialog
export function DeleteCounterDialog({open, targetName, confirmOnClick, closeOnClick}) {
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

// Reset confirmation dialog
export function ResetCounterDialog({open, targetName, resetValue, confirmOnClick, closeOnClick}) {
  return (
    <Dialog
      open={open}
      onClose={closeOnClick}
    >
      <DialogTitle>Reset Counter Value?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Reset <b>{targetName}</b> value to <b>{resetValue}</b>?
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
export function EditCounterDialog({
                                    open,
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
  const [resetValueInput, setResetValueInput] = useState({
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
    setResetValueInput({value: null, errorMessage: null})
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
    if (resetValueInput.value !== null) {
      const sanitizedResetValue = sanitizeAndValidateNumericInput(resetValueInput, setResetValueInput)
      if (isNaN(sanitizedResetValue)) {
        errorsDetected = true
      } else {
        newCounter.resetValue = sanitizedResetValue
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
              InputProps={{
                name: 'name',
                startAdornment: (
                  <InputAdornment position="start">
                    <Edit/>
                  </InputAdornment>
                ),
              }}
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
              InputProps={{
                name: 'value',
                startAdornment: (
                  <InputAdornment position="start">
                    <Numbers/>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{shrink: true}}
              error={valueInput.errorMessage !== null}
              helperText={valueInput.errorMessage}
              onChange={inputOnChangeHandler(setValueInput)}
              label="Value"
              defaultValue={currentCounter.value}
            />
          </Grid>
          <Grid xs={12}>
            <TextField
              fullWidth
              type="number"
              InputProps={{
                name: 'resetValue',
                startAdornment: (
                  <InputAdornment position="start">
                    <RestartAlt/>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{shrink: true}}
              error={resetValueInput.errorMessage !== null}
              helperText={resetValueInput.errorMessage}
              onChange={inputOnChangeHandler(setResetValueInput)}
              label="Reset Value"
              defaultValue={currentCounter.resetValue}
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
              InputLabelProps={{shrink: true}}
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
              InputLabelProps={{shrink: true}}
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
              <Radio size="large"
                     color="info" sx={{color: 'info.main'}}
                     value="info"
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