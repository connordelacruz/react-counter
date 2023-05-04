// Counter Component
import {AppBar, Box, Button, ButtonGroup, IconButton, Stack, Toolbar, Typography} from "@mui/material";
import {AddCircleOutline, Clear, Edit, RemoveCircleOutline, RestartAlt} from "@mui/icons-material";

export function Counter({
                          value, name, decrementBy, incrementBy, color, resetValue,
                          decrementOnClick, incrementOnClick,
                          editOnClick, deleteOnClick, resetOnClick
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
          <Typography variant="h5" component="div" sx={{flexGrow: 1}}>{name}</Typography>
          <ButtonGroup>
            <IconButton color="inherit" onClick={resetOnClick}>
              <RestartAlt/><Typography> {resetValue}</Typography>
            </IconButton>
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