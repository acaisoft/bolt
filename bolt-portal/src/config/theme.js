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

import { ExpandMore } from '@material-ui/icons'

const palette = {
  type: 'dark',
  action: {
    selected: '#816DFE',
    hover: '#F76F40',
  },
  background: {
    default: '#24223B',
    paper: '#302F4C',
    striped: {
      odd: 'rgba(106, 104, 140, 0.24)',
      even: 'trasparent',
    },
  },
  border: '#A7A7C5',
  button: {
    cancel: {
      hover: '#434267',
    },
  },
  chart: {
    gridLine: {
      color: '#535273',
      dash: '5 5',
    },
    font: {
      color: '#CFCFEA',
      fill: '#CFCFEA', // Some components use 'fill', some use 'color'...
      fontFamily: 'Montserrat',
      fontSize: 15,
    },
    tooltip: {
      fill: '#42405E',
      color: '#CFCFEA',
      fontFamily: 'Montserrat',
      fontSize: 15,
    },
    slider: {
      border: '#4E4D6E',
      background: '#3E3D5A',
    },
    color: {
      area: {
        success: '#1EB1B1',
        error: '#FF5EA1',
        primary: '#735DFC',
        secondary: '#EB8967',
      },
      line: {
        success: '#1EB1B1',
        error: '#FF5EA1',
        primary: '#7297FF',
      },
      heatmap: {
        bool: {
          inactive: '#1EB1B1',
          active: '#1EB1B1',
        },
      },
    },
    graph: {
      line: {
        default: '#4E4D6E',
        pending: '#4E4D6E',
        completed: '#1EB1B1',
        failed: '#FF5EA1',
      },
    },
  },
  primary: {
    light: '#302F4C',
    dark: '#F76F40',
    main: '#735DFC',
  },
  secondary: {
    main: '#1EB1B1',
    contrastText: '#FFFFFF',
  },
  success: {
    contrastText: '#FFFFFF',
    main: '#1EB1B1',
  },
  warning: {
    contrastText: '#FFFFFF',
    main: '#F76F40',
    secondary: '#f79c40',
  },
  error: {
    contrastText: '#FFFFFF',
    main: '#EB6767',
  },
  info: {
    contrastText: '#FFFFFF',
    main: '#7297FF',
  },
  divider: '#343252',
  text: {
    primary: '#FFFFFF',
    secondary: '#CFCFEA',
    error: '#FF748D',
    success: '#1EB1B1',
    warning: '#EB8967',
    icon: '#A7A7C5',
    hint: '#CFCFEA',
    caret: '#A192FF',
  },
  dropdown: {
    main: '#434267',
    hover: '#56557D',
    fontSize: 15,
  },
}

export default {
  palette,
  typography: {
    fontSize: 15,
    fontFamily: 'Montserrat, Arial, sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 'bold',
    },
  },
  overrides: {
    MuiCardHeader: {
      action: {
        position: 'absolute',
        right: 6,
        top: 0,
      },
    },
    MuiChip: {
      label: {
        color: palette.text.secondary,
      },
    },
    MuiIconButton: {
      root: {
        color: palette.text.icon,
      },
    },
    MuiMenu: {
      paper: {
        background: palette.dropdown.main,
      },
    },
    MuiMenuItem: {
      root: {
        fontSize: palette.dropdown.fontSize,
      },
    },
    MuiListItem: {
      root: {
        background: palette.dropdown.main,
        '&$selected': {
          background: palette.dropdown.hover,
          color: palette.text.primary,
        },
      },
      button: {
        color: palette.text.secondary,
        '&:hover': {
          backgroundColor: palette.dropdown.hover,
        },
      },
    },
    MuiButton: {
      root: {
        padding: '10px 20px',
      },
      contained: {
        backgroundColor: palette.background.paper,
        color: palette.text.primary,
        boxShadow: 'none',
      },
      outlined: {
        borderColor: palette.text.secondary,
      },
    },
    MuiFormLabel: {
      root: {
        '&$focused': {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
    },
    MuiInputBase: {
      input: {
        '&::placeholder': {
          color: palette.text.hint,
        },
        caretColor: palette.text.caret,
      },
    },
    MuiListItemIcon: {
      root: {
        minWidth: 40,
      },
    },
    MuiListItemText: {
      primary: {
        fontSize: 15,
      },
    },
    MuiFilledInput: {
      root: {
        backgroundColor: palette.background.paper,
      },
      underline: {
        '&:after': {
          borderBottomColor: '#A192FF',
        },
        '&:before': {
          borderBottomColor: 'transparent',
        },
        '&:hover:before, &:focus-within:before': {
          borderBottomColor: '#A192FF',
          borderBottomWidth: 2,
        },
      },
    },
    MuiSelect: {
      select: {
        paddingRight: 32,
      },
      icon: {
        top: 'calc(50% - 10px)',
        right: 5,
        color: palette.text.icon,
        fontSize: '1.4rem',
      },
      selectMenu: {
        fontSize: palette.dropdown.fontSize,
      },
    },
    MuiTooltip: {
      popper: {
        opacity: 1,
      },
    },
    MuiTableCell: {
      root: {
        borderBottom: 'none',
        paddingTop: 4,
        paddingBottom: 4,
      },
      head: {
        color: palette.text.primary,
        fontWeight: 'bold',
      },
      footer: {
        color: palette.text.primary,
        fontWeight: 'bold',
      },
      body: {
        color: palette.text.secondary,
      },
    },
  },
  props: {
    MuiButtonBase: {
      // disableRipple: true, // No more ripple, on the whole application!
    },
    MuiTextField: {
      SelectProps: {
        IconComponent: ExpandMore,
      },
    },
    DataTable: {
      striped: true,
    },
    MuiPaper: {
      elevation: 0,
    },
    MuiInputBase: {
      autoComplete: 'off',
    },
  },
}
