// Counter Component
import {AppBar, Box, Button, ButtonGroup, IconButton, Stack, Toolbar, Typography} from "@mui/material";
import {AddCircleOutline, Clear, DragIndicator, Edit, RemoveCircleOutline, RestartAlt} from "@mui/icons-material"
import {useDrag, useDrop} from "react-dnd"
import {useRef} from "react"

export function Counter({
                          value, name, decrementBy, incrementBy, color, resetValue, index,
                          decrementOnClick, incrementOnClick,
                          editOnClick, deleteOnClick, resetOnClick,
                          moveCounter
                        }) {
  // TODO: official example looks a lil different for the setup, prob re-work a bit: https://codesandbox.io/s/github/react-dnd/react-dnd/tree/gh-pages/examples_js/04-sortable/simple?from-embed=&file=/src/Card.js
  // TODO: implement handle/preview
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
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) return

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      // Get pixels to the top
      const hoverActualY = clientOffset.y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      if (dragIndex < hoverIndex && hoverActualY < hoverMiddleY) return
      // When dragging upwards, only move when the cursor is above 50%
      if (dragIndex > hoverIndex && hoverActualY > hoverMiddleY) return

      // Move the item and update the index
      moveCounter(dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
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
          <IconButton
            color="inherit"
            edge="start"
            sx={{cursor: 'move'}}
          >
            <DragIndicator/>
          </IconButton>
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
