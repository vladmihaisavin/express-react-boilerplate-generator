import React from 'react'
import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import Link from '@material-ui/core/Link'
import MenuIcon from '@material-ui/icons/Menu'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import HeaderStyles from '../../styles/header'
import { getPageName } from '../../helpers'

function Header(props) {
  const { classes, onDrawerToggle } = props

  return (
    <React.Fragment>
      <AppBar color="primary" position="sticky" elevation={0}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Hidden smUp>
              <Grid item>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={onDrawerToggle}
                  className={classes.menuButton}
                >
                  <MenuIcon />
                </IconButton>
              </Grid>
            </Hidden>
            <Grid item xs>
              <Typography color="inherit" variant="h5" component="h1">
                { getPageName() }
              </Typography>
            </Grid>
            <Grid item xs />
            <Grid item>
              <Link className={classes.link} href="https://github.com/vladmihaisavin" variant="body2">
                Check project on Github
              </Link>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  )
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  onDrawerToggle: PropTypes.func.isRequired,
}

export default withStyles(HeaderStyles)(Header)