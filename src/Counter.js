// Counter Component
import {AppBar, Box, Button, ButtonGroup, IconButton, Stack, Toolbar, Typography} from "@mui/material";
import {AddCircleOutline, Clear, Edit, RemoveCircleOutline, RestartAlt} from "@mui/icons-material";
import {useDrag, useDrop} from "react-dnd"
import {useRef} from "react"

export function Counter({
                          value, name, decrementBy, incrementBy, color, resetValue, index,
                          decrementOnClick, incrementOnClick,
                          editOnClick, deleteOnClick, resetOnClick,
                          moveCounter
                        }) {
  // Setup counters to be draggable
  const [{ isDragging }, dragRef] = useDrag({
    type: 'counter',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  })

  // Setup counters to be drop targets
  const [spec, dropRef] = useDrop({
    accept: 'counter',
    hover: (item, monitor) => {
      const dragIndex = item.index
      const hoverIndex = index
      // TODO: document, probable re-work to utilize handles? and make drop target stuff smoother
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const hoverActualY = monitor.getClientOffset().y - hoverBoundingRect.top

      // if dragging down, continue only when hover is smaller than middle Y
      if (dragIndex < hoverIndex && hoverActualY < hoverMiddleY) return
      // if dragging up, continue only when hover is bigger than middle Y
      if (dragIndex > hoverIndex && hoverActualY > hoverMiddleY) return

      // Move the item and update the index
      moveCounter(dragIndex, hoverIndex)
      item.index = hoverIndex
    }
  })

  // Setup ref so this is both draggable and target
  const ref = useRef(null)
  const dragDropRef = dragRef(dropRef(ref))

  // Make items being dragged transparent
  const opacity = isDragging ? 0.25 : 1

  return (
    <Box
      ref={dragDropRef}
      sx={{
        border: 2,
        borderColor: `${color}.main`,
        borderRadius: '4px',
        opacity: opacity,
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