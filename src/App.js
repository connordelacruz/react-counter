// ================================================================================
// IMPORTS
// ================================================================================
import {useState} from 'react'
import {Box, Container, Fab, Stack, Typography} from "@mui/material"
import {Add} from "@mui/icons-material"
import {Counter} from "./Counter"
import {DeleteCounterDialog, EditCounterDialog, ResetCounterDialog} from "./Dialogs"
import {useLocalStorage} from "./Helpers"

// TODO: https://mui.com/material-ui/react-button/#material-you-version


// List of Counters
function CounterList() {
  // ================================================================================
  // STATE AND HELPER FUNCTIONS
  // ================================================================================
  // --------------------------------------------------------------------------------
  // Counters list
  // --------------------------------------------------------------------------------
  // State
  // NOTE: We're using local storage hook so data persists on reload
  const [counters, setCounters] = useLocalStorage(
    'counters',
    [
      {
        name: 'Counter 0',
        value: 0,
        resetValue: 0,
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
      resetValue: 0,
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
  // Reset dialog
  // --------------------------------------------------------------------------------
  const [resetDialog, setResetDialog] = useState(
    {
      open: false,
      target: null,
    }
  )

  // Open reset confirmation dialog
  function handleResetButtonClick(i) {
    return () => {
      // Set reset dialog target and open confirmation
      setResetDialog({open: true, target: i})
    }
  }

  // Confirm button click
  function handleResetConfirmButtonClick() {
    if (resetDialog.target !== null) {
      // Reset the target counter
      const newCounters = [...counters]
      newCounters[resetDialog.target].value = newCounters[resetDialog.target].resetValue
      setCounters(newCounters)
    }
    // Clear reset target and close dialog
    handleResetCloseButtonClick()
  }

  // Close button click
  function handleResetCloseButtonClick() {
    // Clear reset target and close dialog
    setResetDialog({open: false, target: null})
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
        resetValue: '',
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
        resetValue: '',
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
          resetValue={counters[i].resetValue}
          decrementBy={counters[i].decrementBy}
          incrementBy={counters[i].incrementBy}
          color={counters[i].color}
          incrementOnClick={() => handleCounterButtonClick(i, counters[i].incrementBy)}
          decrementOnClick={() => handleCounterButtonClick(i, -1 * counters[i].decrementBy)}
          editOnClick={handleEditButtonClick(i)}
          resetOnClick={handleResetButtonClick(i)}
          deleteOnClick={handleDeleteButtonClick(i)}
        />
      </Box>
    )
  })
  // Message to display if no counters are listed
  const noCountersMessage = (
    <Box sx={{
      textAlign: 'center',
      color: 'text.disabled',
    }}>
      <Typography variant="subtitle1"><i>No counters to display.</i></Typography>
    </Box>
  )

  return (
    <Box>
      <Stack spacing={2}>{counterList.length > 0 ? counterList : noCountersMessage}</Stack>
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
      <ResetCounterDialog
        open={resetDialog.open}
        targetName={resetDialog.target !== null ? counters[resetDialog.target].name : ''}
        resetValue={resetDialog.target !== null ? counters[resetDialog.target].resetValue : ''}
        confirmOnClick={handleResetConfirmButtonClick}
        closeOnClick={handleResetCloseButtonClick}
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
