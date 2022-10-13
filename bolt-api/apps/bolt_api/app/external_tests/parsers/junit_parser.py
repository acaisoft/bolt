import uuid
from .base_parser import BaseXMLParser

from services.logger import setup_custom_logger
logger = setup_custom_logger(__file__)


class JunitParser(BaseXMLParser):

    def get_test_cases(self, test_case):
        name = test_case.attrib.get("name")
        if not (etc := self.existing_test_cases_dict.get(name)):
            test_case_obj = {
                "id": str(uuid.uuid4()),
                "name_from_file": name,
                "group_id": self.get_group(test_case).get("id"),
            }
            self.test_cases_objects.append(test_case_obj)
            return test_case_obj
        return etc

    def get_test_result(self, test_case, test_case_id, test_run_id):
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
        self.test_result_objects.append({
            "id": str(uuid.uuid4()),
            "test_case_id": test_case_id,
            "result": result,
            "message": message,
            "duration": test_case.attrib.get("time"),
            "test_run_id": test_run_id,
        })

    def get_group(self, test_case):
        group_name = test_case.attrib.get("classname").split(".")[-1]
        if not self.existing_groups_dict.get(group_name):
            if group_name not in self.groups_objects.keys():
                group_object = {
                    "id": str(uuid.uuid4()),
                    "name": group_name
                }
                self.groups_objects[group_name] = group_object
                return group_object
            else:
                return self.groups_objects.get(group_name)
        else:
            return self.existing_groups_dict[group_name]

    def get_custom_fields(self, custom_fields, test_run_id):
        custom_fields_list = []
        for field in custom_fields:
            custom_fields_list.append({
                "id": str(uuid.uuid4()),
                "name": field,
                "value": custom_fields[field],
                "test_run_id": test_run_id,
            })
        return custom_fields_list

    def process_xml(self):
        for test_siute in self.root.find("."):
            test_run_id = str(uuid.uuid4())
            attrib = test_siute.attrib
            test_run_object = {
                "id": test_run_id,
                "duration": attrib.get("time"),
                "scenario_id": self.scenario_id,
                "timestamp": attrib.get("timestamp"),
                "successes": int(attrib.get("successes", 0)),
                "failures": int(attrib.get("failures", 0)),
                "skipped": int(attrib.get("skipped", 0)),
                "errors": int(attrib.get("errors", 0)),
                "total": int(attrib.get("tests", 0)),
            }
            for test_case in test_siute.findall("testcase"):
                self.get_test_result(
                    test_case, self.get_test_cases(test_case).get("id"), test_run_id
                )
            result = {
                "test_run": test_run_object,
                "results": self.test_result_objects,
                "test_cases": self.test_cases_objects,
                "groups": list(self.groups_objects.values()),
                "custom_fields": self.get_custom_fields(self.custom_fields, test_run_id)
            }

            self.loader.bulk_insert_all(result)
            return result
