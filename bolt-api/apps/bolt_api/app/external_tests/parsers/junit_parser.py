from .base_parser import BaseXMLParser

from services.logger import setup_custom_logger
logger = setup_custom_logger(__file__)


class JunitParser(BaseXMLParser):

    def get_test_cases(self, test_case):
        self.test_cases.append({
            "name": test_case.attrib.get("name"),
            "group": self.get_group(test_case),
            "project": self.project_id,
        })

    def get_test_result(self, test_case):
        if (reason := test_case.find('failure')) is not None:
            result = reason.tag
            message = reason.attrib.get("message")
        elif (reason := test_case.find('error')) is not None:
            result = reason.tag
            message = reason.attrib.get("message")
        elif (reason := test_case.find('skipped')) is not None:
            result = reason.tag
            message = reason.attrib.get("message")
        else:
            result = 'success'
            message = None
        self.test_result.append({
            "test_case": 'id of test_case object',
            "result": result,
            "message": message,
            "duration": test_case.attrib.get("time"),
        })

    def get_group(self, test_case):
        if (group_name := test_case.attrib.get("classname").split(".")[-1]) not in self.groups:
            self.groups.append(group_name)
        # db_client.get_or_create_groups_object(group_name)
        return group_name

    def process_xml(self):
        for test_siute in self.root.find("."):
            for test_case in test_siute.findall("testcase"):
                self.get_test_cases(test_case)
                self.get_test_result(test_case)
        return {
            "test_result": self.test_result,
            "test_cases": self.test_cases,
            "groups": self.groups,
            "custom_fields": self.custom_fields
        }
        # db_client.bulk_create_groups()
        # db_client.bulk_create_testcases()
        # db_client.bulk_create_testresults()

