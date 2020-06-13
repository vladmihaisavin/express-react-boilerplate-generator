import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Preloader from '../reusable/Preloader.jsx'
import ResourceFormStyles from '../../styles/resourceForm'

function generateDefaultResourceObject(formFields, resourceObject = {}) {
  const defaultResourceObject = {}
  for (const field of formFields) {
    defaultResourceObject[field] = resourceObject[field] || ''
  }
  return defaultResourceObject
}

function ResourceForm(props) {
  const { customProps, classes, oldResource, loading } = props
  const [resource, setResource] = useState(generateDefaultResourceObject(customProps.formFields, oldResource))

  useEffect(() => {
    setResource(generateDefaultResourceObject(customProps.formFields, oldResource))
  }, [customProps, oldResource])

  return (
    <Paper className={classes.paper}>
      {
        props.action === 'update' && loading
          ? (
            <div className={classes.preloaderWrapper}>
              <Preloader />
            </div>
          )
          : (
          <React.Fragment>
            <Grid className={classes.grid} container alignItems="center">
              <Grid item xs={12}>
                {
                  customProps.formProperties.map(property => (
                    <TextField
                      key={property.id}
                      name={property.id}
                      value={resource[property.id]}
                      type={property.type || 'text'}
                      label={property.label}
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      className={classes.textField}
                      size={"small"}
                      fullWidth
                      margin="normal"
                      onChange={(e) => setResource({ ...resource, [property.id]: e.target.value })}
                    />
                  ))
                }
              </Grid>
            </Grid>
            <Grid className={classes.actions} container spacing={2} direction="row" alignItems="center" justify="flex-end" item xs={12}>
              <Grid item>
                <Button color="secondary" onClick={customProps.actions.cancelButtonClicked}>Cancel</Button>
              </Grid>
              <Grid item>
              <Button variant="contained" color="primary" onClick={() => customProps.actions.saveButtonClicked(resource)}>Save {customProps.resourceName}</Button>
              </Grid>
            </Grid>
          </React.Fragment>
        )
      }
    </Paper>
  )
}

ResourceForm.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(ResourceFormStyles)(ResourceForm)