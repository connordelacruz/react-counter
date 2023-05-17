// ================================================================================
// IMPORTS
// ================================================================================
import {Box, Container, Typography} from "@mui/material"
import {CounterList} from "./CounterList"

// TODO: https://mui.com/material-ui/react-button/#material-you-version


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
