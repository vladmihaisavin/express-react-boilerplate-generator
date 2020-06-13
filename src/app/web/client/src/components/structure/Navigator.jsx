import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { withStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import HomeIcon from '@material-ui/icons/Home'
import NavigatorStyles from '../../styles/navigator'

const categories = [
  {
    id: 'Resources',
    children: [
    ]
  }
]

function Navigator(props) {
  const { classes, ...other } = props

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <Link to='/' style={{ textDecoration: 'none' }}>
          <ListItem className={clsx(classes.firebase, classes.item, classes.itemCategory)}>
            E.R.B-Generator
          </ListItem>
        </Link>
        <Link to='/' style={{ textDecoration: 'none' }}>
          <ListItem className={clsx(classes.item, classes.itemCategory)}>
            <ListItemIcon className={classes.itemIcon}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText
              classes={{
                primary: classes.itemPrimary,
              }}
            >
              Dashboard
            </ListItemText>
          </ListItem>
        </Link>
        {categories.map(({ id, children }) => children.length > 0 ? (
          <React.Fragment key={id}>
            <ListItem className={classes.categoryHeader}>
              <ListItemText
                classes={{
                  primary: classes.categoryHeaderPrimary,
                }}
              >
                {id}
              </ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, active, url }) => (
              <Link to={url} style={{ textDecoration: 'none' }} key={childId}>
                <ListItem
                  button
                  className={clsx(classes.item, active && classes.itemActiveItem)}
                >
                  <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
                  <ListItemText
                    classes={{
                      primary: classes.itemPrimary,
                    }}
                  >
                    {childId}
                  </ListItemText>
                </ListItem>
              </Link>
            ))}
            <Divider className={classes.divider} />
          </React.Fragment>
        ) : '')}
      </List>
    </Drawer>
  )
}

Navigator.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(NavigatorStyles)(Navigator)