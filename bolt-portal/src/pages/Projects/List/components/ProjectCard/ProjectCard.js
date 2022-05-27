/**
 * Copyright (c) 2022 Acaisoft
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React from 'react'
import PropTypes from 'prop-types'

import {
  CardHeader,
  IconButton,
  Chip,
  CardContent,
  Typography,
  CardActions,
  MenuItem,
} from '@material-ui/core'
import { Button, PopoverMenu } from 'components'

import { MoreHoriz, ChevronRight } from '@material-ui/icons'

import useStyles from './ProjectCard.styles'
import { useTheme } from '@material-ui/styles'

function ProjectCard({ project, onEdit }) {
  const theme = useTheme()

  const { num_scenarios = 0, num_sources = 0 } = project

  const classes = useStyles()

  return (
    <React.Fragment>
      <CardHeader
        className={classes.header}
        action={
          <PopoverMenu
            id={`project-${project.id}`}
            closeOnClick
            trigger={
              <IconButton aria-label="Project Menu">
                <MoreHoriz />
              </IconButton>
            }
          >
            <MenuItem onClick={() => onEdit(project)}>Edit project</MenuItem>
          </PopoverMenu>
        }
        title={project.name}
        titleTypographyProps={{
          component: 'p',
          paragraph: true,
          style: { fontWeight: 'bold', fontSize: theme.typography.body1.fontSize },
        }}
        subheader={
          <div className={classes.chips}>
            <Chip
              label={`${num_scenarios} Test Scenario${
                num_scenarios !== 1 ? 's' : ''
              }`}
              className={classes.chip}
            />
            <Chip
              label={`${num_sources} Test Source${num_sources !== 1 ? 's' : ''}`}
              className={classes.chip}
            />
          </div>
        }
      />
      <CardContent className={classes.grow}>
        {project.description && (
          <Typography
            color="textSecondary"
            component="p"
            variant="body1"
            gutterBottom
          >
            {project.description.length > 200
              ? `${project.description.slice(0, 200)}...`
              : project.description}
          </Typography>
        )}
      </CardContent>
      <CardActions className={classes.actions}>
        <Button
          variant="contained"
          color="primary"
          href={`${project.id}/configs`}
          icon={ChevronRight}
        >
          More
        </Button>
      </CardActions>
    </React.Fragment>
  )
}
ProjectCard.propTypes = {
  onEdit: PropTypes.func.isRequired,
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    progress: PropTypes.number,
  }).isRequired,
}

export default ProjectCard
