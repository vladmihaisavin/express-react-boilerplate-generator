import React, { useState } from 'react'
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
import Preloader from '../reusable/Preloader.jsx'
import httpClient from '../../services/httpClient'

function getSteps() {
  return ['Project Name', 'Authentication', 'Database Type', 'Database Credentials', 'Auth Resource Table', 'Bulk Updates Setup', 'Resources', 'Generate']
}

const DEFAULT_PROJECT_DETAILS = {
  projectName: 'output',
  authentication: 'none',
  databaseType: 'mysql',
  databaseCredentials: {
    host: '127.0.0.1',
    port: '3307',
    user: 'myUser',
    password: 'asd123',
    database: 'test_db'
  },
  authenticableResourceTable: 'users',
  resources: []
}

function Dashboard(props) {
  const { classes } = props
  const [activeStep, setActiveStep] = useState(0)
  const [generating, setGenerating] = useState(false)
  const [skipped, setSkipped] = useState(new Set())
  const [nextDisabledFor, setNextDisabledFor] = useState(new Set([3]))
  const [optionalSteps] = useState([1, 2])
  const [projectDetails, setProjectDetails] = useState(DEFAULT_PROJECT_DETAILS)
  const steps = getSteps()

  const isStepOptional = (step) => {
    return optionalSteps.includes(step)
  }

  const isStepSkipped = (step) => {
    return skipped.has(step)
  }
  
  const isNextDisabledForStep = (step) => {
    return nextDisabledFor.has(step)
  }

  const handleNext = async () => {
    if (
      (activeStep === 1 && projectDetails.authentication === 'none')
      || (activeStep === 2 && projectDetails.databaseType === 'none')
    ) {
      handleSkip()
    } else {
      let newSkipped = skipped
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values())
        newSkipped.delete(activeStep)
      }
      if (activeStep === steps.length - 1) {
        setGenerating(true)
        let projectGenerated = false
        try {
          await httpClient.post('/generate', projectDetails)
          const download = await httpClient.get(`/boilerplates/${projectDetails.projectName}`, { responseType: 'blob'})
          const url = window.URL.createObjectURL(new Blob([download.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', `${projectDetails.projectName}.zip`)
          document.body.appendChild(link)
          link.click()
          projectGenerated = true
        } catch (err) {
          console.log(err)
          projectGenerated = false
        }
        setGenerating(false)
        if (projectGenerated) {
          setActiveStep((prevActiveStep) => prevActiveStep + 1)
        }
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
      }
      setSkipped(newSkipped)
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => {
      if (isStepSkipped(2) && activeStep > 2) {
        return 2
      }
      return prevActiveStep - 1
    })
  }

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.")
    }
    const authSelectionSkipped = activeStep === 1
    const dbSelectionSkipped = activeStep === 2

    if (authSelectionSkipped) {
      setProjectDetails({
        ...projectDetails,
        authentication: 'none'
      })
    }
    if (dbSelectionSkipped) {
      setProjectDetails({
        ...projectDetails,
        databaseType: 'none',
        databaseCredentials: DEFAULT_PROJECT_DETAILS.databaseCredentials,
        authenticableResourceTable: DEFAULT_PROJECT_DETAILS.authenticableResourceTable
      })
    }

    setActiveStep((prevActiveStep) => {
      if (dbSelectionSkipped) {
        return steps.length - 1
      }
      return prevActiveStep + 1
    })
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values())
      newSkipped.add(activeStep)
      if (dbSelectionSkipped) {
        newSkipped.add(3).add(4).add(5).add(6)
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
                      <Typography color="textSecondary" className={classes.instructions}>{getStepDescription(activeStep)}</Typography>
                      <div className={classes.form}>
                        {getStepForm(activeStep, projectDetails, setProjectDetails, setNextDisabledFor)}
                      </div>
                      <div className={classes.buttonsWrapper}>
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
                        {
                          !isNextDisabledForStep(activeStep)
                            ? 
                              generating
                                ? <Preloader className={classes.button}/>
                                : (
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                    className={classes.button}
                                  >
                                    {activeStep === steps.length - 1 ? 'Generate' : 'Next'}
                                  </Button>
                                )
                          : ''
                        }
                      </div>
                    </StepContent>
                  </Step>
                )
              })}
            </Stepper>
            <div>
              {activeStep === steps.length && (
                <div className={classes.startAgain}>
                  <Typography className={classes.instructions}>
                    All steps completed - you're finished
                  </Typography>
                  <Button onClick={handleReset} className={classes.button} variant="contained" color="primary">
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