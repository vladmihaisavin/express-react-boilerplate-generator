import React from 'react'
import PropTypes from 'prop-types'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import { makeStyles } from '@material-ui/core/styles'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}))

function CustomizedSnackbar(props) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(true)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  return (
    <div className={classes.root}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={props.severity}>
          { props.message }
        </Alert>
      </Snackbar>
    </div>
  )
}

CustomizedSnackbar.propTypes = {
  message: PropTypes.node,
  severity: PropTypes.oneOf(["success", "warning", "error", "info"]).isRequired
}

export default CustomizedSnackbar