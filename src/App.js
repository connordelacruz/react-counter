import { useState } from 'react'
import {Box, Button, Container, Divider, Stack, Typography} from "@mui/material";
import {AddCircleOutline, RemoveCircleOutline} from "@mui/icons-material";


function Counter({ value, decrementOnClick, incrementOnClick }) {
  return (
    <Box>
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
      >
        <Button
          variant="outlined"
          fullWidth
          onClick={decrementOnClick}
        >
          <RemoveCircleOutline/>
        </Button>
        <Box
          sx={{
            width: 1,
          }}
        >
          <Typography
            variant="h4"
            sx={{ textAlign: 'center' }}
          >
            {value}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          fullWidth
          onClick={incrementOnClick}
        >
          <AddCircleOutline/>
        </Button>
      </Stack>
    </Box>
  )
}


function CounterList() {
  const [counters, setCounters] = useState([{ value: 0}])

  function handleCounterButtonClick(i, amountToAdd) {
    const newCounters = [...counters]
    newCounters[i].value = newCounters[i].value + amountToAdd
    setCounters(newCounters)
  }

  function renderCounter(i) {
    return (
      <Counter
        value={counters[i].value}
        incrementOnClick={() => handleCounterButtonClick(i, 1)}
        decrementOnClick={() => handleCounterButtonClick(i, -1)}
      />
    )
  }

  function handleNewCounterButtonClick() {
    const newCounter = {
      value: 0,
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
