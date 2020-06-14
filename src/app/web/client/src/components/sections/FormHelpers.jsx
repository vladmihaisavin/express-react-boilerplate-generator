import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import Preloader from '../reusable/Preloader.jsx'
import DoneIcon from '@material-ui/icons/Done'
import ClearIcon from '@material-ui/icons/Clear'
import httpClient from '../../services/httpClient'

export function getStepForm(step, projectDetails, setProjectDetails, setNextDisabledFor) {
  switch (step) {
    case 0:
      return <ProjectNameInput data={{ projectDetails, setProjectDetails }}/>
    case 1:
      return <AuthenticationSelect data={{ projectDetails, setProjectDetails }}/>
    case 2:
      return <DatabaseSelect data={{ projectDetails, setProjectDetails }}/>
    case 3:
      return <DatabaseCredentials data={{ projectDetails, setProjectDetails, setNextDisabledFor }}/>
    case 4:
      return <AuthenticableResourceTableSelect data={{ projectDetails, setProjectDetails }}/>
    case 5:
      return <ResourcesEditor data={{ projectDetails, setProjectDetails }}/>
    case 6:
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
      minWidth: 200
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

function DatabaseSelect(props) {
  const { projectDetails, setProjectDetails } = props.data
  const classes = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 150
    }
  }))()

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="database-select-label">Database Type</InputLabel>
      <Select
        labelId="database-select-label"
        id="databaseType"
        value={projectDetails.databaseType}
        onChange={(e) => setProjectDetails({ ...projectDetails, databaseType: e.target.value })}
      >
        <MenuItem value={'none'}>None</MenuItem>
        <MenuItem value={'mysql'}>MySQL</MenuItem>
      </Select>
    </FormControl>
  )
}

function DatabaseCredentials(props) {
  const { projectDetails, setProjectDetails, setNextDisabledFor } = props.data
  const [dbCredentials, setDbCredentials] = useState(projectDetails.databaseCredentials)
  const [loading, setLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState(null)
  const classes = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
    button: {
      marginTop: theme.spacing(2),
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    }
  }))()

  const testDbConnection = async () => {
    setConnectionStatus(null)
    setLoading(true)
    let connectionStatus
    try {
      const response = await httpClient.post('/resources', { ...dbCredentials, databaseType: projectDetails.databaseType })
      if (response.status === 200) {
        setProjectDetails({
          ...projectDetails,
          resources: response.data
        })
        connectionStatus = true
      } else {
        connectionStatus = false
      }
    } catch (err) {
      connectionStatus = false
    }
    
    setNextDisabledFor((prevValues) => {
      const nextDisabledFor = new Set(prevValues.values())
      if ([null, false].includes(connectionStatus)) {
        nextDisabledFor.add(3)
      } else {
        nextDisabledFor.delete(3)
      }
      return nextDisabledFor
    })
    setConnectionStatus(connectionStatus)
    setLoading(false)
  }

  const displayConnectionStatus = (connectionStatus) => {
    switch(connectionStatus) {
      case true:
        return <DoneIcon color="primary" />
      case false:
        return <ClearIcon color="secondary" />
      default:
        return ''
    }
  }

  return (
    <FormControl className={classes.formControl}>
      <TextField id="host" label="Host" value={dbCredentials.host || ""} onChange={(e) => setDbCredentials({ ...dbCredentials, host: e.target.value})}/>
      <TextField id="port" label="Port" value={dbCredentials.port || ""} onChange={(e) => setDbCredentials({ ...dbCredentials, port: e.target.value})}/>
      <TextField id="user" label="User" value={dbCredentials.user || ""} onChange={(e) => setDbCredentials({ ...dbCredentials, user: e.target.value})}/>
      <TextField id="password" label="Password" value={""} type="password" onChange={(e) => setDbCredentials({ ...dbCredentials, password: e.target.value})}/>
      <TextField id="database" label="Database Name" value={dbCredentials.database || ""} onChange={(e) => setDbCredentials({ ...dbCredentials, database: e.target.value})}/>
      <div className={classes.button}>
        {
          loading
            ? <Preloader />
            : (
              <Button variant="contained" onClick={testDbConnection}>Test connection</Button>
            )
        }
        {
          displayConnectionStatus(connectionStatus)
        }
      </div>
      
    </FormControl>
  )
}


function AuthenticableResourceTableSelect(props) {
  const { projectDetails, setProjectDetails } = props.data
  const classes = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 150
    }
  }))()
  const resourceTables = ['users']

  useEffect(() => {
    console.log(projectDetails)
  }, [projectDetails])

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="auth-resource-select-label">Database Type</InputLabel>
      <Select
        labelId="auth-resource-select-label"
        id="authenticableResourceTable"
        value={projectDetails.authenticableResourceTable || ""}
        onChange={(e) => setProjectDetails({ ...projectDetails, authenticableResourceTable: e.target.value })}
      >
        {resourceTables.map(item => (
          <MenuItem value={item} key={item}>{item}</MenuItem>))
        }
      </Select>
    </FormControl>
  )
}

function ResourcesEditor(props) {
  const { projectDetails, setProjectDetails } = props.data
  const [resourcesString, setResourcesString] = useState(JSON.stringify(projectDetails.resources, undefined, 2))
  const classes = makeStyles((theme) => ({
    jsonEditor: {
      width: '50ch'
    },
    button: {
      marginTop: theme.spacing(2)
    }
  }))()
  const saveJsonFile = () => {
    try {
      const resourcesObject = JSON.parse(resourcesString)
      setProjectDetails({
        ...projectDetails,
        resources: resourcesObject
      })
    } catch (err) {
      if(err.name === 'SyntaxError') {
        console.log('could not parse JSON file')
      }
    }
  }
  return (
    <FormControl className={classes.formControl}>
      <TextField
        className={classes.jsonEditor}
        id="resources-editor"
        label="Resources JSON"
        multiline
        rows={30}
        defaultValue={resourcesString}
        variant="filled"
        onChange={(e) => setResourcesString(e.target.value)}
        onKeyDown={(e) => { if (e.keyCode === 9) e.preventDefault() }}
      />
      <Button className={classes.button} variant="contained"  color="primary" onClick={saveJsonFile}>Save JSON file</Button>
    </FormControl>
  )
}