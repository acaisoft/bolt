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



DEPLOYER_TIMEOUT = 10

# execution_metrics_metadata is populated with this default at testrun startup
# TODO: remove or adjust when frontend has a drag-n-drop interface ready for this
DEFAULT_CHART_CONFIGURATION = '''{  
   "charts":[  
      {  
         "x_format":"number",
         "node_name":"global_throughput",
         "x_data_key":"timestamp",
         "y_format":"number",
         "y_label":"name",
         "title":"Global throughput (events/s)",
         "type":"line",
         "y_data_key":"value"
      },
      {  
         "x_format":"number",
         "node_name":"nodes",
         "x_data_key":"timestamp",
         "y_format":"number",
         "y_label":"name",
         "title":"Nodes messages/second",
         "type":"line",
         "y_data_key":"value"
      },
      {  
         "x_format":"number",
         "node_name":"lag",
         "x_data_key":"timestamp",
         "y_format":"number",
         "y_label":"name",
         "title":"Kafka consumer lag",
         "type":"line",
         "y_data_key":"value"
      },
      {  
         "x_format":"number",
         "node_name":"kafka_messages",
         "x_data_key":"timestamp",
         "y_format":"number",
         "y_label":"name",
         "title":"Kafka messages count",
         "type":"line",
         "y_data_key":"value"
      },
      {  
         "x_format":"number",
         "node_name":"global_cpu",
         "x_data_key":"timestamp",
         "y_format":"percent",
         "y_label":"name",
         "title":"CPU usage (Apps + Server) (Striim)",
         "type":"line",
         "y_data_key":"value"
      },
      {  
         "x_format":"number",
         "node_name":"vm_cpu",
         "x_data_key":"timestamp",
         "y_format":"percent",
         "y_label":"name",
         "title":"CPU Usage (Prometheus)",
         "type":"line",
         "y_data_key":"value"
      },
      {  
         "x_format":"number",
         "node_name":"vm_ram",
         "x_data_key":"timestamp",
         "y_format":"percent",
         "y_label":"name",
         "title":"Memory usage (Prometheus)",
         "type":"line",
         "y_data_key":"value"
      },
      {  
         "x_format":"number",
         "node_name":"global_memory",
         "x_data_key":"timestamp",
         "y_format":"bytes",
         "y_label":"name",
         "title":"Memory usage (Striim)",
         "type":"line",
         "y_data_key":"value"
      },
      {  
         "x_format":"number",
         "node_name":"global_disc_data",
         "x_data_key":"timestamp",
         "y_format":"bytes",
         "y_label":"name",
         "title":"Disc space (Striim)",
         "type":"line",
         "y_data_key":"value"
      },
      {  
         "x_format":"number",
         "node_name":"vm_disc_usage",
         "x_data_key":"timestamp",
         "y_format":"percent",
         "y_label":"name",
         "title":"Disc usage (Prometheus)",
         "type":"line",
         "y_data_key":"value"
      },
      {  
         "x_format":"number",
         "node_name":"vm_disc",
         "x_data_key":"timestamp",
         "y_format":"bytes",
         "y_label":"name",
         "title":"Disc space (Prometheus)",
         "type":"line",
         "y_data_key":"value"
      },
      {  
         "x_format":"number",
         "node_name":"vm_io",
         "x_data_key":"timestamp",
         "y_format":"bytes",
         "y_label":"name",
         "title":"I/O (Prometheus)",
         "type":"line",
         "y_data_key":"value"
      },
      {  
         "x_format":"number",
         "node_name":"apps_source_input",
         "x_data_key":"timestamp",
         "y_format":"number",
         "y_label":"app_name",
         "title":"Source input per App",
         "type":"line",
         "y_data_key":"source_input"
      },
      {  
         "x_format":"number",
         "node_name":"apps_threads",
         "x_data_key":"timestamp",
         "y_format":"number",
         "y_label":"app_name",
         "title":"CPU thread per app",
         "type":"line",
         "y_data_key":"threads_num"
      },
      {  
         "x_format":"number",
         "node_name":"apps_cpu",
         "x_data_key":"timestamp",
         "y_format":"percent",
         "y_label":"app_name",
         "title":"CPU usage per App (Striim)",
         "type":"line",
         "y_data_key":"cpu"
      },
      {  
         "x_format":"number",
         "node_name":"apps_wactions",
         "x_data_key":"timestamp",
         "y_format":"number",
         "y_label":"app_name",
         "title":"WebActions per App (Striim)",
         "type":"line",
         "y_data_key":"wactions_created"
      },
      {  
         "x_format":"number",
         "node_name":"number_of_apps",
         "x_data_key":"timestamp",
         "y_format":"number",
         "y_label":"name",
         "title":"Number of running apps",
         "type":"line",
         "y_data_key":"value"
      },
      {  
         "x_format":"number",
         "node_name":"apps_latency",
         "x_data_key":"timestamp",
         "y_format":"number",
         "y_label":"app_component",
         "title":"Latency per App (ms)",
         "type":"line",
         "y_data_key":"latency"
      },
      {  
         "x_format":"number",
         "node_name":"apps_backpressed",
         "x_data_key":"timestamp",
         "y_format":"bool",
         "y_label":"app_name",
         "title":"Backpressured per App",
         "type":"heatmap",
         "y_data_key":"backpressured"
      },
      {  
         "x_format":"number",
         "node_name":"elastic_search_docs",
         "x_data_key":"timestamp",
         "y_format":"number",
         "y_label":"name",
         "title":"Number of Elastic Search Docs",
         "type":"line",
         "y_data_key":"value"
      },
      {  
         "x_format":"bytes",
         "node_name":"elastic_search_size",
         "x_data_key":"timestamp",
         "y_format":"number",
         "y_label":"name",
         "title":"Elastic Search Size",
         "type":"line",
         "y_data_key":"value"
      }
   ]
}'''

# chart conf for configuration with NFS extension
NFS_CHART_CONFIGURATION = '''{
  "charts": [
    {
      "x_format": "number",
      "node_name": "current_files",
      "x_data_key": "timestamp",
      "y_format": "number",
      "y_label": "name",
      "title": "Current files",
      "type": "line",
      "y_data_key": "value"
    },
    {
      "x_format": "number",
      "node_name": "current_bytes",
      "x_data_key": "timestamp",
      "y_format": "bytes",
      "y_label": "name",
      "title": "Current bytes",
      "type": "line",
      "y_data_key": "value"
    },
    {
      "x_format": "number",
      "node_name": "throughput",
      "x_data_key": "timestamp",
      "y_format": "number",
      "y_label": "name",
      "title": "Throughput",
      "type": "line",
      "y_data_key": "value"
    },
    {
      "x_format": "number",
      "node_name": "dedupe",
      "x_data_key": "timestamp",
      "y_format": "percent",
      "y_label": "name",
      "title": "Dedupe",
      "type": "line",
      "y_data_key": "value"
    },
    {
      "x_format": "number",
      "node_name": "compression",
      "x_data_key": "timestamp",
      "y_format": "number",
      "y_label": "name",
      "title": "Compression",
      "type": "line",
      "y_data_key": "value"
    },
    {
      "x_format": "number",
      "node_name": "total_savings",
      "x_data_key": "timestamp",
      "y_format": "percent",
      "y_label": "name",
      "title": "Total Savings",
      "type": "line",
      "y_data_key": "value"
    }
  ]
}'''
