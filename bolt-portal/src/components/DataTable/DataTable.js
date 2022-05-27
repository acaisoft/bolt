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

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Table, withStyles } from '@material-ui/core'
import {
  DefaultBodyRenderer,
  DefaultFooterRenderer,
  DefaultHeaderRenderer,
} from './renderers'

import { areArraysEqual } from 'utils/collections'

import styles from './DataTable.styles'

export const Column = () => null
Column.propTypes = {
  render: PropTypes.func.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
}
Column.displayName = 'Column'

export const haveColumnsChanged = (prevColumnNodes, nextColumnNodes) => {
  const prevKeys = React.Children.map(prevColumnNodes, child => child && child.key)
  const nextKeys = React.Children.map(nextColumnNodes, child => child && child.key)

  return !areArraysEqual(prevKeys, nextKeys)
}

export const calculateColumnSettings = children =>
  React.Children.toArray(children).map(column => ({
    ...column.props,
    key: column.key,
  }))

// TODO: change this to functional component
export class DataTable extends Component {
  static Column = Column

  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    checkboxes: PropTypes.bool,
    checkboxKey: PropTypes.func,
    data: PropTypes.arrayOf(PropTypes.object.isRequired),
    hasFooter: PropTypes.bool,
    initialSelected: PropTypes.instanceOf(Set),
    isLoading: PropTypes.bool,
    multiselect: PropTypes.bool,
    // Re-renders only on children change.
    // If set to `true` the table will be re-rendered only if any of the columns change.
    // If set to `false` will re-render always (like any other component).
    pure: PropTypes.bool,
    responsive: PropTypes.bool,
    onSelect: PropTypes.func,
    rowKey: PropTypes.func,
    striped: PropTypes.bool,
    BodyRenderer: PropTypes.func,
    FooterRenderer: PropTypes.func,
    HeaderRenderer: PropTypes.func,
  }

  static defaultProps = {
    checkboxKey: row => row.id,
    hasFooter: false,
    initialSelected: new Set(),
    onSelect: () => {},
    pure: false,
    responsive: true,
    rowKey: row => row.id,
    striped: false,
    HeaderRenderer: DefaultHeaderRenderer,
    BodyRenderer: DefaultBodyRenderer,
    FooterRenderer: DefaultFooterRenderer,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const nextState = {}
    if (
      (nextProps.pure &&
        (!prevState.columnNodes ||
          haveColumnsChanged(nextProps.children, prevState.columnNodes))) ||
      !nextProps.pure
    ) {
      nextState.columnNodes = nextProps.children
      nextState.columns = calculateColumnSettings(nextProps.children)
    }

    return Object.keys(nextState).length > 0 ? nextState : null
  }

  constructor(props) {
    super(props)

    this.state = {
      columns: [],
      selected: props.initialSelected,
    }
  }

  render() {
    const { classes, responsive } = this.props

    return (
      <div
        className={classNames({ [classes.responsiveContainer]: responsive })}
        data-testid="DataTable"
      >
        <Table>
          {this.renderHeader()}
          {this.renderBody()}
          {this.renderFooter()}
        </Table>
      </div>
    )
  }

  renderHeader = () => {
    const { checkboxes, data, multiselect, HeaderRenderer } = this.props
    const { columns, selected } = this.state

    return (
      <HeaderRenderer
        checkboxes={checkboxes}
        columns={columns}
        data={data}
        multiselect={multiselect}
        selected={selected}
      />
    )
  }

  renderBody = () => {
    const {
      classes,
      checkboxes,
      checkboxKey,
      data,
      isLoading,
      rowKey,
      striped,
      BodyRenderer,
    } = this.props
    const { columns, selected } = this.state

    return (
      <BodyRenderer
        columns={columns}
        classes={classes}
        checkboxes={checkboxes}
        checkboxKey={checkboxKey}
        data={data}
        isLoading={isLoading}
        rowKey={rowKey}
        selected={selected}
        striped={striped}
      />
    )
  }

  renderFooter = () => {
    const { classes, data, hasFooter, isLoading, FooterRenderer } = this.props
    const { columns } = this.state

    if (!hasFooter) {
      return null
    }

    return (
      <FooterRenderer
        classes={classes}
        columns={columns}
        data={data}
        isLoading={isLoading}
      />
    )
  }

  handleSelectAll = () => {
    const { checkboxKey, data, onSelect } = this.props
    const { selected } = this.state

    let newSelected
    if (selected.size > 0) {
      newSelected = new Set()
    } else {
      newSelected = new Set(data.map(checkboxKey))
    }

    this.setState({ selected: newSelected })

    onSelect(newSelected)
  }

  handleSelect = id => () => {
    const { multiselect, onSelect } = this.props
    const { selected } = this.state

    let newSelected = new Set([...selected])
    if (multiselect) {
      if (newSelected.has(id)) {
        newSelected.delete(id)
      } else {
        newSelected.add(id)
      }
    } else {
      if (newSelected.size === 0) {
        newSelected.add(id)
      } else {
        if (newSelected.has(id)) {
          newSelected.delete(id)
        } else {
          newSelected.clear()
          newSelected.add(id)
        }
      }
    }

    this.setState({ selected: newSelected })

    onSelect(newSelected)
  }
}

export default withStyles(styles, { name: 'DataTable' })(DataTable)
