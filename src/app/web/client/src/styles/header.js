const lightColor = 'rgba(255, 255, 255, 0.7)'

export default theme => ({
  secondaryBar: {
    zIndex: 0,
  },
  menuButton: {
    marginLeft: -theme.spacing(1),
  },
  link: {
    textDecoration: 'none',
    color: lightColor,
    '&:hover': {
      color: theme.palette.common.white,
      textDecoration: 'none'
    },
  },
  button: {
    borderColor: lightColor,
  }
})