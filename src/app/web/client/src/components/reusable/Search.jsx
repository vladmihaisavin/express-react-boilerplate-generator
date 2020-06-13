import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import SearchIcon from '@material-ui/icons/Search'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

export default function Search (props) {
  const { classes, listProperties, searchAction } = props
  const [filter, setFilter] = useState('name')

  return (
    <React.Fragment>
      <Grid item>
        <SearchIcon className={classes.block} color="inherit" />
      </Grid>
      <Grid item xs={2}>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Filter</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {
              listProperties.map((item) => (
                <MenuItem key={ item.id } value={ item.id }>{ item.label }</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs>
        <TextField
          fullWidth
          placeholder="Search..."
          InputProps={{
            disableUnderline: true,
            className: classes.searchInput
          }}
          onChange={(e) => searchAction(e.target.value, filter)}
        />
      </Grid>
    </React.Fragment>
  )
} 