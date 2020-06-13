import React from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider, withStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Hidden from '@material-ui/core/Hidden'
import Copyright from '../structure/Copyright.jsx'
import Header from '../structure/Header.jsx'
import Navigator from '../structure/Navigator.jsx'
import theme from '../../styles/theme'
import { MainStyles, drawerWidth } from '../../styles/main'

function Main(props) {
  const { classes } = props
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const newProps = { ...props }
  delete newProps.content

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <nav className={classes.drawer}>
          <Hidden smUp implementation="js">
            <Navigator
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
            />
          </Hidden>
          <Hidden xsDown implementation="css">
            <Navigator PaperProps={{ style: { width: drawerWidth } }} />
          </Hidden>
        </nav>
        <div className={classes.app}>
          <Header onDrawerToggle={handleDrawerToggle} />
          <main className={classes.main}>
            <props.content { ...newProps } />
          </main>
          <footer className={classes.footer}>
            <Copyright />
          </footer>
        </div>
      </div>
    </ThemeProvider>
  )
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(MainStyles)(Main)