import uuid
from .base_parser import BaseXMLParser

from services.logger import setup_custom_logger
logger = setup_custom_logger(__file__)


class JunitParser(BaseXMLParser):

    def get_test_cases(self, test_case):
        test_case_obj = {
            "id": str(uuid.uuid4()),
            "name_from_file": test_case.attrib.get("name"),
            "group_id": self.get_group(test_case).get("id"),
            # "project": self.project_id,
        }
        self.test_cases_objects.append(test_case_obj)
        return test_case_obj

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
        if (group_name := test_case.attrib.get("classname")) not in self.groups_objects.keys():
            group_object = {
                "id": str(uuid.uuid4()),
                "name": group_name.split(".")[-1]
            }
            self.groups_objects[group_name] = group_object
            return group_object
        else:
            return self.groups_objects.get(group_name)

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
            test_run_object = {
                "id": test_run_id,
                "duration": test_siute.attrib.get("time"),
                "external_scenario_id": self.scenario_id,
                "timestamp": test_siute.attrib.get("timestamp")
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
            logger.info(f">>>>>>>>>>>>>>>>>>>>>>>>>> {result}")
            self.loader.bulk_insert_all(result)
            return result
