import {useLocalStorage} from "./Helpers"
import {useCallback, useState} from "react"
import {DeleteCounterDialog, EditCounterDialog, ResetCounterDialog} from "./Dialogs"
import {Box} from "@mui/material"


// Top level container of the app. Contains counter lists and dialogs
export function AppContainer() {
  // ================================================================================
  // STATE AND HELPER FUNCTIONS
  // ================================================================================
  // --------------------------------------------------------------------------------
  // Counters list
  // --------------------------------------------------------------------------------
  // State with counter lists
  const [counterLists, setCounterLists] = useLocalStorage(
    'counterLists',
    [
      {
        id: 'counter-list-0',
        counters: [
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
      }
    ]
  )

  // Function to pass to each counter list so they can update the state
  function generateSetCountersFunction(counterListIndex) {
    // TODO: return func setCounters
  }

  // Currently selected counter list
  // TODO: handle case where counterLists is empty/index is invalid
  const [currentCounterListIndex, setCurrentCounterListIndex] = useLocalStorage(
    'currentCounterListIndex', 0
  )
  // Used for generating counter ids. Gets incremented each time a new counter is added
  const [currentCounterId, setCurrentCounterId] = useLocalStorage('currentCounterId', 0)
  // Used for generating counter list ids. Gets incremented each time a new counter list is added
  const [currentCounterListId, setCurrentCounterListId] = useLocalStorage('currentCounterListId', 0)

  // TODO: render
  return (
    <Box></Box>
  )
}