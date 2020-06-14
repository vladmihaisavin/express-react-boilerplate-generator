import React from 'react'
import Typography from '@material-ui/core/Typography'

export function Description() {
  return (
    <React.Fragment>
      <Typography color="textPrimary" align="center">
        Project description
      </Typography>
      <Typography color="textSecondary" align="center">
        This project was generated using the E.R.B (express-react-boilerplate) generator.<br />
        It is used as an interface to interact with the generator.
      </Typography>
    </React.Fragment>
  )
}

export function WizardTitle() {
  return (
    <Typography color="textPrimary" align="center">
      Follow this setup wizard to create your own boilerplate
    </Typography>
  )
}


export function getStepDescription(step) {
  switch (step) {
    case 0:
      return 'Please input the project name:'
    case 1:
      return 'Please select the authentication type:'
    case 2:
      return 'Please select the database type:'
    case 3:
      return 'Please set the database credentials:'
    case 4:
      return 'Please input the database table name for the authenticable resource:'
    case 5:
      return 'Please update the resources as you seem fit:'
    case 6:
      return 'Start generating the boilerplate'
    default:
      return 'Unknown step'
  }
}