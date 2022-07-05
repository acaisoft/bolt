# Copyright (c) 2022 Acaisoft
#
# Permission is hereby granted, free of charge, to any person obtaining a copy of
# this software and associated documentation files (the "Software"), to deal in
# the Software without restriction, including without limitation the rights to
# use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
# the Software, and to permit persons to whom the Software is furnished to do so,
# subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
# FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
# COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
# IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
# CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

from multiprocessing.pool import ThreadPool
import matplotlib.dates as mdates
import matplotlib.pyplot as plt
import matplotlib.ticker as mtick
from dateutil import parser
import pandas as pd
from plots.plot_configs import *
from reporting.reporting_utils import svg_path
charts = {
    'rabbit_count_1': 'FaceStreamInfo count',
    'rabbit_count_2': 'FaceStreaming count',
    'rabbit_rate_1': 'FaceStreamInfo rate',
    'rabbit_rate_2': 'FaceStreaming rate',

}


def rotate_ticks(axis):
    for ax in axis:
        for t in ax.get_xminorticklabels():
            t.set_rotation(45)
        for t in ax.get_xmajorticklabels():
            t.set_rotation(45)


def get_metrics_data(metrics_data, charts_to_perform):
    total = []
    m_pool = ThreadPool()
    for metric in metrics_data:
        m_pool.apply_async(func=metrics_in_thread, args=(metric, charts_to_perform, total))
    m_pool.close()
    m_pool.join()
    return total


def metrics_in_thread(metric, charts_to_perform, container):
    for m_name, values in metric['data']['data'].items():
        tmp = [{'timestamp': parser.parse(metric['data']['timestamp']), 'name': entry['name'],
                'value': entry['value'],
                'type': m_name} for entry in values if
               (m_name in charts_to_perform.keys()) and (entry['name'] in charts_to_perform[m_name] or 'ALL' in charts_to_perform[m_name])]
        container.extend(tmp)


def format_chart_to_title(chart_name):
    try:
        return charts[chart_name]
    except KeyError:
        return chart_name.replace('_', ' ').title()


def metrics_svg_plots(metrics_data, metrics_meta_data, charts_to_perform):
    print('Started Metrics SVG creation.')
    data = get_metrics_data(metrics_data, charts_to_perform)
    fig, axis = plt.subplots(len(charts_to_perform))
    if len(charts_to_perform) == 1:
        axis = [axis]
    fig.set_size_inches(11, 15)
    formate_axis_threads(axis)
    axis_index = 0
    plots_pool = ThreadPool()
    for chart in charts_to_perform:
        plots_pool.apply_async(func=plot_in_thread, args=(axis, axis_index, chart, metrics_meta_data, data))
        axis_index += 1
    plots_pool.close()
    plots_pool.join()
    rotate_ticks(axis)
    fig.tight_layout(pad=3.0)
    svg = svg_path()
    plt.savefig(svg, format="svg")
    plt.clf()
    plt.cla()
    print('Ended Metrics SVG creation.')
    return svg


def plot_in_thread(axis, axis_index, chart, metrics_meta_data, data):
    print(f'Started chart: {chart} preparing')
    axis[axis_index].set_title(label=format_chart_to_title(chart), fontdict=TITLE_STYLE,
                               loc='left')
    metadata = list(filter(lambda x: x['node_name'] == chart, metrics_meta_data['charts']))[0]
    chart_type = metadata['type']
    if 'percent' in metadata['y_format']:
        axis[axis_index].yaxis.set_major_formatter(mtick.PercentFormatter(xmax=1))
    if 'stacked' in chart_type:
        chart_type = 'area'
    f_d = list(filter(lambda x: x['type'] == chart, data))
    names = list(set(x['name'] for x in f_d))
    values = {n: [float(f['value']) for f in f_d if f['name'] == n] for n in names}
    t = [f['timestamp'] for f in f_d if f['name'] == names[0]]
    df = pd.DataFrame(data=values, index=[f['timestamp'] for f in f_d if f['name'] == names[0]])
    df.plot(kind=chart_type, ax=axis[axis_index], stacked='area' in chart_type)
    axis[axis_index].legend(frameon=False)
    print(f'Ended chart: {chart} preparing')


def single_execution_plots_svg(ex_data):
    print('Started Execution SVG creation.')
    data_to_frame = {'timestamp': [parser.parse(e['timestamp']) for e in ex_data],
                     'number_of_successes': [e['number_of_successes'] for e in ex_data],
                     'number_of_fails': [e['number_of_fails'] for e in ex_data],
                     'total': [e['number_of_fails'] + e['number_of_successes'] for e in ex_data],
                     'number_of_users': [e['number_of_users'] for e in ex_data],
                     'average_response_time': [e['average_response_time'] for e in ex_data],
                     'success_ratio': [(e['number_of_successes'] / (e['number_of_fails'] + e['number_of_successes'])
                                        if e['number_of_fails'] + e['number_of_successes'] > 0 else 0) * 100
                                       for e in ex_data]
                     }
    df = pd.DataFrame(data_to_frame)
    fig, axis = plt.subplots(4)
    formate_axis_threads(axis, data_to_frame)
    ax1 = axis[0]
    ax2 = axis[1]
    ax3 = axis[2]
    ax4 = axis[3]
    fig.set_size_inches(11, 15)
    ax1.set_title(label='Requests/second', fontdict=TITLE_STYLE, loc='left')
    ax2.set_title(label='Users', fontdict=TITLE_STYLE, loc='left')
    ax3.set_title(label='Avg. response time (ms)', fontdict=TITLE_STYLE, loc='left')
    ax4.set_title(label='Success ratio', fontdict=TITLE_STYLE, loc='left')
    df.plot(kind='line', x='timestamp', y='number_of_successes', color=GREEN, ax=ax1, label='Success')
    df.plot(kind='line', x='timestamp', y='number_of_fails', color=RED, ax=ax1, label='Fails')
    df.plot(kind='line', x='timestamp', y='number_of_users', color=BLUE, ax=ax2)
    df.plot(kind='line', x='timestamp', y='average_response_time', color=BLUE, ax=ax3)
    df.plot(kind='line', x='timestamp', y='success_ratio', color=BLUE, ax=ax4)
    ax1.legend(frameon=False)
    ax2.get_legend().remove()
    ax3.get_legend().remove()
    ax4.get_legend().remove()
    ax4.yaxis.set_major_formatter(mtick.PercentFormatter())
    rotate_ticks(axis)
    fig.tight_layout(pad=3.0)
    svg = svg_path()
    plt.savefig(svg, format="svg")
    plt.clf()
    plt.cla()
    print('Ended Execution SVG creation.')
    return svg


def formate_axis_threads(axis, data_to_frame=None):
    tpool = ThreadPool()
    for a in axis:
        tpool.apply_async(func=formate_ax, args=(a, data_to_frame))
    tpool.close()
    tpool.join()


def formate_ax(a, data_to_frame=None):
    a.xaxis.axis_date()
    a.xaxis.set_major_formatter(mdates.DateFormatter('%H:%M:%S'))
    a.xaxis.set_minor_formatter(mdates.DateFormatter('%M:%S'))
    a.xaxis.set_major_locator(mdates.SecondLocator(interval=45))
    a.xaxis.set_minor_locator(mdates.SecondLocator(interval=15))
    a.tick_params(**X_AXIS_DATE_FORMATTER_MAJOR)
    a.tick_params(**X_AXIS_DATE_FORMATTER_MINOR)
    a.tick_params(**Y_AXIS_STYLE)
    a.xaxis.label.set_visible(False)
    if data_to_frame is not None:
        a.set(xlim=(data_to_frame['timestamp'][0], data_to_frame['timestamp'][-1]))
    a.set_facecolor('whitesmoke')
    a.patch.set_alpha(0.5)
    a.spines['top'].set_visible(False)
    a.spines['right'].set_visible(False)
    a.spines['left'].set_visible(False)
    a.grid(axis='y')


def request_success_ratio_svg(req_data):
    plot_data = [req_data['num_requests'] - req_data['num_failures'], req_data['num_failures']]
    fig, ax = plt.subplots()
    wedges, text, autotext = ax.pie(plot_data, colors=[GREEN, RED],
                                    labels=['Success', 'Fail'], autopct='%1.1f%%')
    plt.setp(wedges, width=0.75)
    ax.set_aspect("equal")
    svg = svg_path()
    plt.savefig(svg, format="svg", transparent=True)
    plt.clf()
    plt.cla()
    return svg


def request_distribution_svg(req_data):
    data = [req_data['distribution']['p50'],
            req_data['distribution']['p66'],
            req_data['distribution']['p75'],
            req_data['distribution']['p80'],
            req_data['distribution']['p90'],
            req_data['distribution']['p95'],
            req_data['distribution']['p98'],
            req_data['distribution']['p99'],
            req_data['distribution']['p100']
            ]
    labels = ['50%', '66%', '75%', '80%', '90%', '95%', '98%', '99%', '100%']
    fig, ax = plt.subplots()
    new_x = [4 * i for i in (range(len(labels)))]
    ax.bar(new_x, data, align='center', width=2, tick_label=labels, color=BLUE)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_visible(False)
    ax.margins(y=.1)
    svg = svg_path()
    plt.savefig(svg, format="svg", transparent=True)
    plt.clf()
    plt.cla()
    return svg
