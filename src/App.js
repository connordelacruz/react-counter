import { useState } from 'react'
import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Container,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Divider,
  IconButton, InputAdornment,
  Stack,
  TextField, Toolbar,
  Typography
} from "@mui/material";
import {AddBox, AddCircleOutline, Clear, Edit, RemoveCircleOutline} from "@mui/icons-material";
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
        <Button
          variant="outlined" size="large" fullWidth
          startIcon={<RemoveCircleOutline/>}
          onClick={decrementOnClick}
        >
          {decrementBy}
        </Button>
        <Box
          my={2} sx={{width: 1}}
        >
          <Typography variant="h3" sx={{textAlign: 'center'}}>{value}</Typography>
        </Box>
        <Button
          variant="outlined" size="large" fullWidth
          startIcon={<AddCircleOutline/>}
          onClick={incrementOnClick}
        >
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
                             form, setForm,
                             confirmOnClick, closeOnClick
                           }) {

  // TODO: just get it to work without validation
  // TODO: figure out validation on submit

  function onUpdateField(e) {
    const newForm = {
      ...form,
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
              defaultValue={form.name}
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
            defaultValue={form.value}
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
              defaultValue={form.decrementBy}
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
              defaultValue={form.incrementBy}
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
  // Edit dialog
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
  function setEditForm(newForm) {
    setEditDialog({
      ...editDialog,
      form: {...newForm},
    })
  }

  // ================================================================================
  // COUNTER HANDLER FUNCTIONS
  // ================================================================================
  // Increment/decrement counter
  function handleCounterButtonClick(i, amountToAdd) {
    const newCounters = [...counters]
    newCounters[i].value = newCounters[i].value + amountToAdd
    setCounters(newCounters)
  }

  // Open delete confirmation dialog
  function handleDeleteButtonClick(i) {
    return () => {
      // Set delete dialog target and open confirmation
      setDeleteDialog({open: true, target: i})
    }
  }

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
  // EDIT DIALOG HANDLER FUNCTIONS
  // ================================================================================

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
  // CREATE / RENDER COUNTER FUNCTIONS
  // ================================================================================

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

  // Render Counter component
  function renderCounter(i) {
    return (
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
    )
  }

  // Render list of counters from state
  const counterList = counters.map((counter, i) => {
    return (
      <Box key={i}>
        {renderCounter(i)}
      </Box>
    )
  })

  // ================================================================================
  // RENDER COUNTER LIST
  // ================================================================================
  return (
    <Box>
      <Stack spacing={2}>{counterList}</Stack>
      <Box sx={{ my: 4 }}>
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
        targetName={deleteDialog.target !== null ? counters[deleteDialog.target].name : ''}
        confirmOnClick={handleDeleteConfirmButtonClick}
        closeOnClick={handleDeleteCloseButtonClick}
      />
      <EditCounterDialog
        open={editDialog.open}
        form={editDialog.form} setForm={setEditForm}
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
