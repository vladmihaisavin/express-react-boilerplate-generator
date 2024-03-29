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
      return <BulkUpdateEditor data={{ projectDetails, setProjectDetails, setNextDisabledFor }}/>
    case 6:
      return <ResourcesEditor data={{ projectDetails, setProjectDetails, setNextDisabledFor }}/>
    case 7:
    default:
      return
  }
}

function displayActionFeedback(actionStatus) {
  switch(actionStatus) {
    case true:
      return <DoneIcon color="primary" />
    case false:
      return <ClearIcon color="secondary" />
    default:
      return ''
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

  return (
    <FormControl className={classes.formControl}>
      <TextField id="host" label="Host" value={dbCredentials.host || ""} onChange={(e) => setDbCredentials({ ...dbCredentials, host: e.target.value})}/>
      <TextField id="port" label="Port" value={dbCredentials.port || ""} onChange={(e) => setDbCredentials({ ...dbCredentials, port: e.target.value})}/>
      <TextField id="user" label="User" value={dbCredentials.user || ""} onChange={(e) => setDbCredentials({ ...dbCredentials, user: e.target.value})}/>
      <TextField id="password" label="Password" type="password" onChange={(e) => setDbCredentials({ ...dbCredentials, password: e.target.value})}/>
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
          displayActionFeedback(connectionStatus)
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
  const resourceTables = projectDetails.resources.map(resource => resource.tableName)

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="auth-resource-select-label">Table name</InputLabel>
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

function BulkUpdateEditor(props) {
  const { projectDetails, setProjectDetails, setNextDisabledFor } = props.data
  const [bulkUpdateFieldsString, setBulkUpdateFieldsString] = useState(JSON.stringify(generateBulkUpdateObjectStub(projectDetails.resources), undefined, 2))
  const [isValidJsonFormat, setIsValidJsonFormat] = useState(true)
  const editorClasses = makeStyles((theme) => ({
    jsonEditor: {
      width: '50ch'
    },
    button: {
      marginTop: theme.spacing(2),
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    }
  }))()

  useEffect(() => {
    setNextDisabledFor((prevValues) => {
      const nextDisabledFor = new Set(prevValues.values())
      if (isValidJsonFormat === false) {
        nextDisabledFor.add(5)
      } else {
        nextDisabledFor.delete(5)
      }
      return nextDisabledFor
    })
  }, [isValidJsonFormat, setNextDisabledFor])

  return (
    <FormControl className={editorClasses.formControl}>
      <TextField
        className={editorClasses.jsonEditor}
        id="bulk-update-fields-editor"
        label="Bulk Update Fields JSON"
        multiline
        rows={30}
        defaultValue={bulkUpdateFieldsString}
        variant="filled"
        onChange={(e) => setBulkUpdateFieldsString(e.target.value)}
        onKeyDown={(e) => { if (e.keyCode === 9) e.preventDefault() }}
      />
      <div className={editorClasses.button}>
        <Button variant="contained"  color="primary" onClick={saveJsonFile}>Validate JSON</Button>
        {
          displayActionFeedback(isValidJsonFormat)
        }
      </div>
    </FormControl>
  )

  function saveJsonFile() {
    try {
      const bulkUpdateFieldsObject = JSON.parse(bulkUpdateFieldsString)
      setProjectDetails({
        ...projectDetails,
        resources: generateResources(projectDetails.resources, bulkUpdateFieldsObject)
      })
      setIsValidJsonFormat(true)
    } catch (err) {
      if(err.name === 'SyntaxError') {
        console.log('could not parse JSON file')
        setIsValidJsonFormat(false)
      }
    }
  }

  function generateResources (originalResources, bulkUpdateFieldsObject) {
    return originalResources.map(originalResource => ({
      ...originalResource,
      bulkUpdateFields: bulkUpdateFieldsObject.hasOwnProperty(originalResource.tableName) ? bulkUpdateFieldsObject[originalResource.tableName] : []
    }))
  }

  function generateBulkUpdateObjectStub (resources) {
    return resources.reduce((acc, resource) => {
      acc[resource.tableName] = [
        {
          field: 'fieldName',
          defaultValue: 'defaultValue'
        }
      ]
      return acc
    }, {})
  }
}

function ResourcesEditor(props) {
  const { projectDetails, setProjectDetails, setNextDisabledFor } = props.data
  const [resourcesString, setResourcesString] = useState(JSON.stringify(projectDetails.resources, undefined, 2))
  const [isValidJsonFormat, setIsValidJsonFormat] = useState(true)
  const editorClasses = makeStyles((theme) => ({
    jsonEditor: {
      width: '50ch'
    },
    button: {
      marginTop: theme.spacing(2),
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    }
  }))()

  useEffect(() => {
    setNextDisabledFor((prevValues) => {
      const nextDisabledFor = new Set(prevValues.values())
      if (isValidJsonFormat === false) {
        nextDisabledFor.add(6)
      } else {
        nextDisabledFor.delete(6)
      }
      return nextDisabledFor
    })
  }, [isValidJsonFormat, setNextDisabledFor])

  const saveJsonFile = () => {
    try {
      const resourcesObject = JSON.parse(resourcesString)
      setProjectDetails({
        ...projectDetails,
        resources: resourcesObject
      })
      setIsValidJsonFormat(true)
    } catch (err) {
      if(err.name === 'SyntaxError') {
        console.log('could not parse JSON file')
        setIsValidJsonFormat(false)
      }
    }
  }
  return (
    <FormControl className={editorClasses.formControl}>
      <TextField
        className={editorClasses.jsonEditor}
        id="resources-editor"
        label="Resources JSON"
        multiline
        rows={30}
        defaultValue={resourcesString}
        variant="filled"
        onChange={(e) => setResourcesString(e.target.value)}
        onKeyDown={(e) => { if (e.keyCode === 9) e.preventDefault() }}
      />
      <div className={editorClasses.button}>
        <Button variant="contained"  color="primary" onClick={saveJsonFile}>Validate JSON</Button>
        {
          displayActionFeedback(isValidJsonFormat)
        }
      </div>
    </FormControl>
  )
}