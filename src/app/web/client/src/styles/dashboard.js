export default theme => ({
  paper: {
    maxWidth: 936,
    margin: '10px auto',
    overflow: 'hidden',
  },
  searchBar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  searchInput: {
    fontSize: theme.typography.fontSize,
  },
  block: {
    display: 'block',
  },
  addButton: {
    marginRight: theme.spacing(1),
  },
  contentWrapper: {
    margin: '40px 16px',
  },
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '50vh'
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  form: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  buttonsWrapper: {
    display: 'flex'
  },
  startAgain: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  }
})