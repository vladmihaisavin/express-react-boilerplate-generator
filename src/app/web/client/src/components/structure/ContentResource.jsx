import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import RefreshIcon from '@material-ui/icons/Refresh'
import ContentResourceStyles from '../../styles/contentResource'
import EmptyResourceTable from './EmptyResourceTable.jsx'
import Preloader from '../reusable/Preloader.jsx'
import ResourceTable from './ResourceTable.jsx'
import Search from '../reusable/Search'

function Content(props) {
  const { classes, customProps, resources, preloader } = props

  return (
    <Paper className={classes.paper}>
      <AppBar className={classes.searchBar} position="static" color="default" elevation={0}>
        <Toolbar>
          <Grid container spacing={2} alignItems="center">
            <Search classes={classes} searchAction={customProps.actions.search} listProperties={customProps.listProperties} />
            <Grid item>
              <Link to={`/${customProps.resourceUrl}/new`} style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary" className={classes.addButton}>
                  { `Add ${customProps.resourceName}` }
                </Button>
              </Link>
              <Tooltip title="Reload" onClick={customProps.actions.reload}>
                <IconButton>
                  <RefreshIcon className={classes.block} color="inherit" />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <div className={preloader ? classes.contentWrapper : classes.tableContentWrapper}>
        {
          preloader
          ? (
            <Preloader />
          )
          : resources.length > 0
            ? (
              <ResourceTable 
                data={resources}
                listProperties={customProps.listProperties}
                resourceUrl={customProps.resourceUrl}
                delete={customProps.actions.delete}
              />
            )
            : (
              <EmptyResourceTable resourceName={ customProps.resourceName }/>
            )
        }
      </div>
    </Paper>
  )
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(ContentResourceStyles)(Content)