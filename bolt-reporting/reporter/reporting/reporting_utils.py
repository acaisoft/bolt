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

from collections import OrderedDict
from os import makedirs, environ, getenv, remove, listdir
from os.path import dirname, join, realpath, abspath, exists
from uuid import uuid4

import jinja2
import xlsxwriter
from weasyprint import HTML, CSS

WD = dirname(__file__)
TMP_HTML = join(WD, 'tmp.html')
templateLoader = jinja2.FileSystemLoader(searchpath=abspath(WD))
templateEnv = jinja2.Environment(loader=templateLoader)
TEMPLATE_FILE = "report_layout.html"


# REGION GENERATORS
def generate_pdf_report(model):
    print('Starting generating PDF report.')
    html = generate_html_report(model)
    with open(TMP_HTML, 'w') as html_f:
        html_f.write(html)
    css = get_css()
    print('Temporary HTML file generated.')
    print('Starting saving to PDF.')
    path = pdf_report_path(model['id'])
    HTML(TMP_HTML).write_pdf(stylesheets=[css], target=path)
    print('PDF saved.')
    print('Starting clean up.')
    remove(TMP_HTML)
    remove_tmp_svg()
    print('Clean up done.')
    return path


def generate_html_report(model):
    template = templateEnv.get_template(TEMPLATE_FILE)
    return template.render(model=model)


def generate_excel_report(model):
    workbook = xlsxwriter.Workbook(excel_report_path(model['id']))
    worksheet = workbook.add_worksheet()
    row = 0
    column = 0
    distribution = model['distribution']
    key_order = ['method', 'name', 'p50', 'p66', 'p75', 'p80', 'p90', 'p95', 'p98', 'p99', 'p100']
    for item in distribution:
        item = OrderedDict(item)
        for k in key_order:
            item.move_to_end(k)
        if row == 0:
            for key in item.keys():
                worksheet.write(row, column, key)
                column += 1
            row = 1
        column = 0
        for inner_item in item.values():
            worksheet.write(row, column, inner_item)
            column += 1
        row += 1
    workbook.close()


# ENDREGION

# REGION PATH_BUILDERS

def svg_path():
    return join(WD, f'{uuid4()}.svg')


def reports_dir():
    absolute_path = abspath(realpath(join(WD, '../../files/reports/')))
    if not exists(absolute_path):
        makedirs(absolute_path)
    return absolute_path


def single_report_path():
    tst_date = getenv('TESTS_STARTED')
    if tst_date is None:
        dt = file_date()
        environ["TESTS_STARTED"] = dt
        tst_date = dt
    pth = join(reports_dir(), tst_date)
    if not exists(pth):
        makedirs(pth)
    return pth


def pdf_report_path(test_case_id):
    rp = join(single_report_path(), f"{test_case_id}.pdf")
    if exists(rp):
        rp = join(single_report_path(), f"{test_case_id}_2.pdf")
    return rp


def excel_report_path(test_case_id):
    rp = join(single_report_path(), f"{test_case_id}.xlsx")
    if exists(rp):
        rp = join(single_report_path(), f"{test_case_id}_2.xlsx")
    return rp


def stylesheet_path():
    return realpath(join(WD, 'style.css'))


# ENDREGION

# REGION UTILS
def remove_tmp_svg():
    for f in [file for file in listdir(WD) if file.endswith(".svg")]:
        remove(join(WD, f))


def get_css():
    with open(stylesheet_path(), 'r') as f:
        return CSS(string=f.read())


def file_date():
    from datetime import datetime
    return datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
# ENDREGION
