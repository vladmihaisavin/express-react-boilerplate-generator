import React from 'react'
import Typography from '@material-ui/core/Typography'
import ContentSimple from '../structure/ContentSimple.jsx'

function Content() {
  return (
    <Typography color="textSecondary" align="center">
      This project was generated using Vlad-Mihai Savin's dissertation project.
    </Typography>
  )
}

function Dashboard() {
  return (
    <ContentSimple content={Content} />
  )
}

export default Dashboard