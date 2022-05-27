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

import { formatScaledDuration } from 'utils/datetime'
import { formatThousands, formatPercent } from 'utils/numbers'
import filesize from 'filesize'

export const EChartsFormatterType = {
  Percentage: 'percent',
  Numeric: 'number',
  GB: 'bytes',
  KB: 'kbytes',
  ScaledDuration: 'scaledDuration',
  Heatmap: 'heatmap',
}
export class TooltipBuilder {
  html = ''

  constructor(series, { showEmpty = false } = {}) {
    this.series = series
    this.showEmpty = showEmpty
  }

  findSeriesByName(name) {
    return this.series.find(s => s.seriesName === name)
  }
  getSeriesTime() {
    return this.series[0].name
  }
  withDefaultHeader() {
    this.html += `<div style="padding: 16px;"><div>${this.getSeriesTime()}</div>`
    return this
  }
  withGBDataLine(seriesName) {
    const formatter = EChartUtils.GetFormatter(EChartsFormatterType.GB)
    const series = this.findSeriesById(seriesName)
    const value = formatter(series.data[1])
    this.html += this.getHtmlForValue(series, value)
    return this
  }
  withPercentageDataLine(seriesName) {
    const formatter = EChartUtils.GetFormatter(EChartsFormatterType.Percentage)
    const series = this.findSeriesById(seriesName)
    const value = formatter(series.data[1])
    this.html += this.getHtmlForValue(series, value)
    return this
  }
  withNumericDataLine(seriesName) {
    const formatter = EChartUtils.GetFormatter(EChartsFormatterType.Numeric)
    const series = this.findSeriesByName(seriesName)
    if (series) {
      const value = formatter(series.data)
      this.html += this.getHtmlForValue(series, value)
    }
    return this
  }
  withDurationLine(seriesName) {
    const formatter = EChartUtils.GetFormatter(EChartsFormatterType.ScaledDuration)
    const series = this.findSeriesByName(seriesName)
    const value = formatter(series.data)
    this.html += this.getHtmlForValue(series, value)
    return this
  }
  withPostfixDataLine(seriesId, postfix) {
    const series = this.findSeriesById(seriesId)
    const value = series.data[1].toString() + ' ' + postfix
    this.html += this.getHtmlForValue(series, value)
    return this
  }

  isEmptyValue(value) {
    return typeof value === 'undefined' || value === null
  }

  getHtmlForValue(series, value) {
    if (!this.showEmpty && this.isEmptyValue(value)) {
      return ''
    }

    return `
  <ul style="margin: 8px; padding: 0; list-style: none">
    <li style="margin: 0px; display: flex; flex-wrap: wrap; flex-grow: 1; flex-basis: 30%; align-items: center">
      <div style="margin-right: 4px;">${series.marker}</div>
      <div style="font-weight: bold;">${series.seriesName}</div>
      <div style="flex-basis: 100%; margin-left: 17px">${value}</div>
    </li>
  </ul>`
  }

  getTooltipForMonitoring(format) {
    const formatter = EChartUtils.GetFormatter(format)

    let series = this.series.map(serie => {
      const value =
        format === EChartsFormatterType.Heatmap ? serie.value[2] : serie.value

      return { ...serie, value }
    })

    if (!this.showEmpty) {
      series = series.filter(serie => !this.isEmptyValue(serie.value))
    }

    let htmlList = ''
    if (series.length === 0) {
      htmlList = 'No Data'
    } else {
      htmlList = `
      <ul style="margin: 8px; padding: 0; list-style: none">
        ${series
          .map((serie, index) => {
            return `
            <li style="margin: 0px; display: flex; flex-wrap: wrap; flex-grow: 1; flex-basis: 30%; align-items: center">
            <div style="margin-right: 4px;">${serie.marker}</div>
            <div style="font-weight: bold;">${serie.seriesName}</div>
            <div style="flex-basis: 100%; margin-left: 17px">
              ${formatter(serie.value)}
            </div>
            </li>
            `
          })
          .join('\n')}
      </ul>
      `
    }

    return `
  <div style="padding: 16px;">
    <div>${this.series[0].name}</div>
    ${htmlList}
  </div>
  `
  }

  getTooltipForFailuresPieChart(totalErrors) {
    return `
    <div style="padding: 16px; overflow: hidden; max-width: 400px; display: flex">
       <div style="margin-right: 4px;">${this.series.marker}</div>
       <div>
         <div style="font-weight: bold; white-space: normal; word-break: break-all">${this.series.data.name}</div>
      <div style="color: #fff; font-weight: 600;">${this.series.data.value}/${totalErrors} </div>
      <div style="color: #fff; font-weight: 600;">${this.series.percent}% </div>
       </div>

  </div>
    `
  }

  getTooltipForFailuresPieChartLegend(totalErrors) {
    return `
    <div style="padding: 16px; overflow: hidden; max-width: 400px; display: flex">
       <div>
         <div style="font-weight: bold; white-space: normal; word-break: break-all">${this.series.name}</div>

  </div>
    `
  }

  getHtml() {
    return this.html
  }
}
export class EChartUtils {
  static PercentageFormatter(value) {
    return formatPercent(value, 2)
  }
  static NumericFormatter(value) {
    return value >= 1000 ? formatThousands(value) : value
  }
  static NumericTowDecimalsFormatter(value) {
    return Number(value).toFixed(2)
  }
  static ScaledDurationFormatter(value) {
    return formatScaledDuration(value)
  }
  static GBFormatter(value) {
    return filesize(value, { round: 3 })
  }
  static KBFormatter(value) {
    return filesize(value, { round: 3 })
  }

  static GetFormatter(type) {
    switch (type) {
      case EChartsFormatterType.Percentage:
        return this.PercentageFormatter
      case EChartsFormatterType.Numeric:
        return this.NumericFormatter
      case EChartsFormatterType.NumericTowDecimals:
        return this.NumericTowDecimalsFormatter
      case EChartsFormatterType.ScaledDuration:
        return this.ScaledDurationFormatter
      case EChartsFormatterType.GB:
        return this.GBFormatter
      case EChartsFormatterType.KB:
        return this.KBFormatter
      default:
        return this.NumericFormatter
    }
  }
}
