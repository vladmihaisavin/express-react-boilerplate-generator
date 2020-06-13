import React from 'react'
import Typography from '@material-ui/core/Typography'
import ContentSimple from '../structure/ContentSimple.jsx'
import Paper from '@material-ui/core/Paper'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import DashboardStyles from '../../styles/dashboard'

function Description() {
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

function WizardTitle() {
  return (
    <Typography color="textPrimary" align="center">
      Follow this setup wizard to create your own boilerplate
    </Typography>
  )
}

function getSteps() {
  return ['Project Name', 'Authentication', 'Database Type', 'Database Credentials', 'Auth Resource Table', 'Resources', 'Generate']
}

function getStepContent(step) {
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

function Dashboard(props) {
  const { classes } = props
  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set())
  const [optionalSteps] = React.useState([1, 2])
  const steps = getSteps()

  const isStepOptional = (step) => {
    return optionalSteps.includes(step)
  }

  const isStepSkipped = (step) => {
    return skipped.has(step)
  }

  const handleNext = () => {
    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped(newSkipped)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.")
    }
    let dbSelectionSkipped = activeStep === 2

    setActiveStep((prevActiveStep) => {
      if (dbSelectionSkipped) {
        return 6
      }
      return prevActiveStep + 1
    })
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values())
      newSkipped.add(activeStep)
      if (dbSelectionSkipped) {
        newSkipped.add(3).add(4).add(5)
      }
      return newSkipped
    })
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  return (
    <React.Fragment>
      <ContentSimple content={Description} />
      <Paper className={classes.paper}>
        <div className={classes.contentWrapper}>
          <WizardTitle />
          <div className={classes.root}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, index) => {
                const stepProps = {}
                const labelProps = {}
                if (isStepOptional(index)) {
                  labelProps.optional = <Typography variant="caption">Optional</Typography>
                }
                if (isStepSkipped(index)) {
                  stepProps.completed = false
                }
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                    <StepContent>
                      <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                      <div>
                        <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                          Back
                        </Button>
                        {isStepOptional(activeStep) && (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSkip}
                            className={classes.button}
                          >
                            Skip
                          </Button>
                        )}

                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleNext}
                          className={classes.button}
                        >
                          {activeStep === steps.length - 1 ? 'Generate' : 'Next'}
                        </Button>
                      </div>
                    </StepContent>
                  </Step>
                )
              })}
            </Stepper>
            <div>
              {activeStep === steps.length && (
                <div>
                  <Typography className={classes.instructions}>
                    All steps completed - you&aposre finished
                  </Typography>
                  <Button onClick={handleReset} className={classes.button}>
                    Start again
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Paper>
    </React.Fragment>
  )
}

export default withStyles(DashboardStyles)(Dashboard)