import { useState } from 'react'
import {Box, Button, ButtonGroup, Container, Divider, IconButton, Stack, TextField, Typography} from "@mui/material";
import {AddCircleOutline, Clear, Edit, RemoveCircleOutline} from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2";


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


function CounterList() {
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

  function handleCounterButtonClick(i, amountToAdd) {
    const newCounters = [...counters]
    newCounters[i].value = newCounters[i].value + amountToAdd
    setCounters(newCounters)
  }

  function handleNameTextInputChange(i) {
    return (newName) => {
      const newCounters = [...counters]
      newCounters[i].name = newName
      setCounters(newCounters)
    }
  }

  // TODO: confirmation dialog
  function handleDeleteButtonClick(i) {
    return () => {
      const newCounters = [...counters]
      newCounters.splice(i, 1)
      setCounters(newCounters)
    }
  }

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
          variant="contained"
          fullWidth
          onClick={() => handleNewCounterButtonClick()}
        >
          Create New Counter
        </Button>
      </Box>
    </Box>
  )
}


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
