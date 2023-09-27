import {useLocalStorage} from "./Helpers"
import {useCallback, useState} from "react"
import {Box, Fab, Stack, Typography} from "@mui/material"
import {Counter} from "./Counter"
import {Add} from "@mui/icons-material"
import {DeleteCounterDialog, EditCounterDialog, ResetCounterDialog} from "./Dialogs"
import {DndProvider} from "react-dnd"
import {HTML5Backend} from "react-dnd-html5-backend"

// List of Counters
// TODO: params:
//       counters, setCounters
//      currentCounterId, setCurrentCounterId
export function CounterList() {
  // ================================================================================
  // STATE AND HELPER FUNCTIONS
  // ================================================================================
  // --------------------------------------------------------------------------------
  // Counters list
  // --------------------------------------------------------------------------------
  // State
  // TODO: CONVERT TO PROPS
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
        id: 'counter-0',
      }
    ]
  )
  // Used for generating counter ids. Gets incremented each time a new counter is added
  // TODO: CONVERT TO PROPS
  const [currentCounterId, setCurrentCounterId] = useLocalStorage(
    'currentCounterId',
    counters.length
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
      id: `counter-${currentCounterId}`,
    }
    const newCounters = [...counters, newCounter]
    setCounters(newCounters)
    // Increment counter id
    setCurrentCounterId(currentCounterId + 1)
  }

  // Callback to swap indices when dragging. Called when counters is updated
  const moveCounter = useCallback(
    (dragIndex, hoverIndex) => {
      const dragCounter = counters[dragIndex]
      const hoverCounter = counters[hoverIndex]
      setCounters(counters => {
        const newCounters = [...counters]
        newCounters[dragIndex] = hoverCounter
        newCounters[hoverIndex] = dragCounter
        return newCounters
      })
    },
    [counters]
  )

  // TODO: LIFT UP DIALOGS NEXT
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
      <Counter
        key={counters[i].id}
        index={i}
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
        moveCounter={moveCounter}
      />
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
      <Stack spacing={2}>
        <DndProvider backend={HTML5Backend}>
          {counterList.length > 0 ? counterList : noCountersMessage}
        </DndProvider>
      </Stack>
      <Box sx={{
        my: 4,
        textAlign: 'right'
      }}>
        <Fab color="success" variant="extended" size="large"
             onClick={() => handleNewCounterButtonClick()}>
          <Add sx={{mr: 1}}/>
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