import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

function EmptyResourceTable(props) {
  return (
    <Typography color="textSecondary" align="center">
      No {props.resourceName}s for this project yet.
    </Typography>
  )
}

EmptyResourceTable.propTypes = {
  resourceName: PropTypes.string
}

export default EmptyResourceTable