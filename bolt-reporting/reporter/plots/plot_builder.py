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
from datetime import datetime
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


def get_epoch(timestamp):
    return datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%S.%f%z").timestamp()


def get_hms(epoch):
    return datetime.fromtimestamp(epoch).strftime('%H:%M:%S')


def get_metrics_data(metrics_data):
    total = []
    m_pool = ThreadPool()
    for metric in metrics_data:
        m_pool.apply_async(func=metrics_in_thread, args=(metric, total))
    m_pool.close()
    m_pool.join()
    return total


def metrics_in_thread(metric, container):
    full = metric['monitoring_metrics'][0]['metric_value']
    full_length = len(full)
    for point in metric['monitoring_metrics'][1:]:
        if len(point['metric_value']) > full_length:
            full = point
            full_length = len(point)
    # finding the key fields
    candidates = list(full[0]['metric'].items())
    positive = []
    for item in full[1:]:
        for key in list(item['metric'].items()):
            if key not in candidates:
                positive.append(key)
    positive = list(dict.fromkeys(item[0] for item in positive))
    frame = {'timestamp': [], 'names': [], 'query': metric['query'], 'unit': metric['unit']}
    # building the frame
    for point in metric['monitoring_metrics']:
        frame['timestamp'].append(get_hms(get_epoch(point['timestamp'])))
        for combined in point['metric_value']:
            name = ', '.join((': '.join([e, combined['metric'][e]]) for e in positive)).upper()
            if name not in frame:
                frame['names'].append(name)
                frame[name] = []
            frame[name].append(float(combined['value'][1]))
    container.append(frame)


def metrics_svg_plots(metrics_data):
    print('Started Metrics SVG creation.')
    data = get_metrics_data(metrics_data)
    svgs = []
    for item in data:
        names = item.pop('names')
        unit = item.pop('unit')
        query = item.pop('query').replace('_', ' ').upper()
        df = pd.DataFrame(item)
        fig, ax = plt.subplots(1)
        fig.set_size_inches(11, 5)
        formate_axis_threads([ax], item)
        apply_style_to_axes([ax])
        ax.set_title(label=query, fontdict=TITLE_STYLE, loc='left')
        df.plot.line(
            x='timestamp',
            y=names,
            ax=ax,
            label=names,
            alpha=0.9
        )
        ax.legend(frameon=False, labelcolor=CALM_WHITE)
        ax.yaxis.set_major_formatter(mtick.StrMethodFormatter(f'{{x}}{unit}'))
        rotate_ticks([ax])
        apply_y_grid([ax])
        remove_gaol_spines([ax])
        fig.tight_layout(pad=3.0)
        svg = svg_path()
        plt.savefig(svg, format="svg", transparent=True)
        plt.clf()
        plt.cla()
        svgs.append(svg)
    print('Ended Metrics SVG creation.')
    return svgs


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
    apply_style_to_axes(axis)
    ax1 = axis[0]
    ax2 = axis[1]
    ax3 = axis[2]
    ax4 = axis[3]
    fig.set_size_inches(11, 15)
    ax1.set_title(label='Requests/second', fontdict=TITLE_STYLE, loc='left')
    ax2.set_title(label='Users', fontdict=TITLE_STYLE, loc='left')
    ax3.set_title(label='Avg. response time (ms)', fontdict=TITLE_STYLE, loc='left')
    ax4.set_title(label='Success ratio', fontdict=TITLE_STYLE, loc='left')
    df.plot.area(
        x='timestamp',
        y=['number_of_fails', 'number_of_successes'],
        color=[RED, GREEN],
        ax=ax1,
        label=['Fails', 'Success'],
        alpha=0.9
    )
    plt.grid(linestyle='dashed')
    df.plot(kind='line', x='timestamp', y='number_of_users', color=BLUE, ax=ax2)
    df.plot(kind='line', x='timestamp', y='average_response_time', color=BLUE, ax=ax3)
    df.plot(kind='line', x='timestamp', y='success_ratio', color=BLUE, ax=ax4)
    ax1.legend(frameon=False, labelcolor=CALM_WHITE)
    ax2.get_legend().remove()
    ax3.get_legend().remove()
    ax4.get_legend().remove()
    ax4.yaxis.set_major_formatter(mtick.PercentFormatter())
    rotate_ticks(axis)
    apply_y_grid(axis)
    remove_gaol_spines(axis)
    fig.tight_layout(pad=3.0)
    svg = svg_path()
    plt.savefig(svg, format="svg", transparent=True)
    plt.clf()
    plt.cla()
    print('Ended Execution SVG creation.')
    return svg


def endpoint_details_svg(data):
    print('Started Endpoint Details SVG creation.')
    errors_kinds = list(set([e['exception_data'] for e in data['errors']]))
    timestamps = list(set([e['timestamp'] for e in data['detailed']]))
    raw_timestamps = sorted(list(map(
        lambda millis: get_epoch(millis),
        timestamps
    )))
    timestamps = list(map(lambda epoch: get_hms(epoch), raw_timestamps))

    data_to_frame = {
        'timestamp': timestamps,
        'Min response time': [],
        'Max response time': [],
        'Average response time': [],
        'Response size': []
    }

    # Convert all timestamps to epoch for easier ordering
    for e in data['errors']:
        e['timestamp'] = get_epoch(e['timestamp'])
    for e in data['detailed']:
        e['timestamp'] = get_epoch(e['timestamp'])

    num_requests = []
    for timestamp in raw_timestamps:
        for detail in data['detailed']:
            if detail['timestamp'] == timestamp:
                num_requests.append(detail['num_requests'])
                data_to_frame['Min response time'].append(detail['min_response_time'])
                data_to_frame['Max response time'].append(detail['max_response_time'])
                data_to_frame['Average response time'].append(detail['average_response_time'])
                data_to_frame['Response size'].append(detail['total_content_length'])

    for kind in errors_kinds:
        data_to_frame[kind] = []
        for i in range(0, len(raw_timestamps)):
            found_match = False
            for er in data['errors']:
                if er['timestamp'] == raw_timestamps[i] and er['exception_data'] == kind:
                    data_to_frame[kind].append(er['number_of_occurrences'])
                    num_requests[i] -= er['number_of_occurrences']
                    found_match = True
                    break
            if not found_match:
                data_to_frame[kind].append(0)
        diff = len(data_to_frame['timestamp']) - len(data_to_frame[kind])
        for i in range(0, diff):
            data_to_frame[kind].append(0)

    data_to_frame['Successes'] = num_requests
    df = pd.DataFrame(data_to_frame)
    fig, axis = plt.subplots(3)
    formate_axis_threads(axis, data_to_frame)
    apply_style_to_axes(axis)
    ax1 = axis[0]
    ax2 = axis[1]
    ax3 = axis[2]
    fig.set_size_inches(11, 15)
    ax1.set_title(label='Error occurrences', fontdict=TITLE_STYLE, loc='left')
    ax2.set_title(label='Response times', fontdict=TITLE_STYLE, loc='left')
    ax3.set_title(label='Content size', fontdict=TITLE_STYLE, loc='left')

    # Create a set of colors for all errors and amount of successes (dark to red gradient topped with one light green)
    colors = [((x / 7) % 1.0, 0.1, 0.2) for x in range(len(errors_kinds) + 1)]
    colors.pop(0)
    colors.append(GREEN)
    x = 'timestamp'
    df.plot(
        kind='area',
        color=colors,
        ax=ax1,
        x=x,
        y=[*errors_kinds, 'Successes'],
        alpha=0.8
    )
    df.plot.line(
        color=MIN_MAX_AVG,
        ax=ax2,
        x=x,
        y=['Min response time', 'Max response time', 'Average response time'],
        alpha=0.9
    )
    df.plot.line(
        color=[MIN_MAX_AVG[2]],
        ax=ax3,
        x=x,
        y='Response size',
        alpha=0.9
    )
    handles1, labels1 = ax1.get_legend_handles_labels()
    ax1.legend(reversed(handles1), reversed(list(f'{lbl[:50]}(...)' for lbl in labels1)),
               frameon=False, labelcolor=CALM_WHITE, loc='lower left')
    ax2.legend(frameon=False, labelcolor=CALM_WHITE, loc='upper left')
    ax3.legend(frameon=False, labelcolor=CALM_WHITE, loc='upper left')
    rotate_ticks(axis)
    apply_y_grid(axis)
    remove_gaol_spines(axis)
    for a in axis:
        a.set_facecolor((0, 0, 0, 0))
    fig.tight_layout(pad=3.0)
    svg = svg_path()
    plt.savefig(svg, format="svg", transparent=True)
    plt.clf()
    plt.cla()
    plt.close('all')
    print('Ended Endpoint Details SVG creation.')
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
    a.xaxis.set_major_locator(mdates.SecondLocator(bysecond=[0, 60], interval=60))
    a.xaxis.set_minor_locator(mdates.SecondLocator(bysecond=[0, 30], interval=15))
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
    apply_style_to_axes([ax])
    wedges, text, autotext = ax.pie(plot_data, colors=[GREEN, RED],
                                    labels=['Success', 'Fail'], autopct='%1.1f%%', textprops={'color': CALM_WHITE})
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
    apply_style_to_axes([ax])
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


def apply_style_to_axes(axes):
    for ax in axes:
        ax.xaxis.label.set_visible(False)
        ax.tick_params(color=CALM_WHITE, labelcolor=CALM_WHITE)
        for spine in ax.spines.values():
            spine.set_edgecolor(CALM_WHITE)


def apply_y_grid(axes):
    for ax in axes:
        ax.grid(linestyle='dashed', axis='y', color=BACKGROUND_ELEMENT)
        ax.set_axisbelow(True)


def remove_gaol_spines(axes):
    for ax in axes:
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
