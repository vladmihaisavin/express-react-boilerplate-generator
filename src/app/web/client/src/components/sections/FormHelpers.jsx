import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

export function getStepForm(step, projectDetails, setProjectDetails) {
  switch (step) {
    case 0:
      return <ProjectNameInput data={{ projectDetails, setProjectDetails }}/>
    case 1:
      return <AuthenticationSelect data={{ projectDetails, setProjectDetails }}/>
    case 2:
      return
    case 3:
      return
    case 4:
      return
    case 5:
      return
    case 6:
      return
    default:
      return
  }
}

function ProjectNameInput(props) {
  const { projectDetails, setProjectDetails } = props.data
  return (
    <TextField id="projectName" label="Project Name" value={projectDetails.projectName || ""} onChange={(e) => setProjectDetails({ ...projectDetails, projectName: e.target.value })} />
  )
}

function AuthenticationSelect(props) {
  const { projectDetails, setProjectDetails } = props.data
  const classes = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    }
  }))()

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="authentication-select-label">Authentication Type</InputLabel>
      <Select
        labelId="authentication-select-label"
        id="authentication"
        value={projectDetails.authentication}
        onChange={(e) => setProjectDetails({ ...projectDetails, authentication: e.target.value })}
      >
        <MenuItem value={'none'}>None</MenuItem>
        <MenuItem value={'passport.js with jwt'}>Passport.js with JWT</MenuItem>
      </Select>
    </FormControl>
  )
}