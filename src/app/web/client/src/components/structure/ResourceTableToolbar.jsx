import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteIcon from '@material-ui/icons/Delete'
import FilterListIcon from '@material-ui/icons/FilterList'
import ResourceTableToolbarStyles from '../../styles/resourceTableToolbar'

const ResourceTableToolbar = (props) => {
  const { selectedIds, classes } = props
  const numSelected = selectedIds.length

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color='inherit' variant='subtitle1' component='div'>
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant='h6' id='tableTitle' component='div' />
      )}

      {numSelected > 0 ? (
        <Tooltip title='Delete'>
          <IconButton aria-label='delete' onClick={() => props.delete(selectedIds)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title='Filter list'>
          <IconButton aria-label='filter list'>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}

ResourceTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedIds: PropTypes.array.isRequired
}

export default withStyles(ResourceTableToolbarStyles)(ResourceTableToolbar)