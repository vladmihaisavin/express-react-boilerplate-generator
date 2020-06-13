import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import ContentSimpleStyles from '../../styles/contentSimple'

function Content(props) {
  const { classes } = props

  return (
    <Paper className={classes.paper}>
      <div className={classes.contentWrapper}>
        <props.content />
      </div>
    </Paper>
  )
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(ContentSimpleStyles)(Content)