import xml.etree.ElementTree as ET


class BaseXMLParser:
    def __init__(self, file, data):
        self.project_id = data["scenario_id"]
        self.scenario_id = data["scenario_id"]
        self.custom_fields = data["custom_fields"]
        self.report_format = data["report_format"]
        self.root = ET.parse(file).getroot()
        self.groups = []
        self.test_cases = []
        self.test_result = []

