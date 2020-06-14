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
import { Description, WizardTitle, getStepDescription } from './DescriptionHelpers'
import { getStepForm } from './FormHelpers'
import { useEffect } from 'react'

function getSteps() {
  return ['Project Name', 'Authentication', 'Database Type', 'Database Credentials', 'Auth Resource Table', 'Resources', 'Generate']
}

function Dashboard(props) {
  const { classes } = props
  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set())
  const [optionalSteps] = React.useState([1, 2])
  const [projectDetails, setProjectDetails] = React.useState({
    projectName: 'output',
    authentication: 'none',
    databaseType: 'none',
    databaseCredentials: {
      host: '127.0.0.1',
      port: '3307',
      user: 'myUser',
      password: 'asd123',
      database: 'test_db'
    },
    authenticableResourceTable: 'users',
    resources: []
  })
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

  useEffect(() => {
    console.log(projectDetails)
  }, [projectDetails])

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
                      <Typography color="textSecondary" className={classes.instructions}>{getStepDescription(activeStep)}</Typography>
                      <div className={classes.form}>
                        {getStepForm(activeStep, projectDetails, setProjectDetails)}
                      </div>
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