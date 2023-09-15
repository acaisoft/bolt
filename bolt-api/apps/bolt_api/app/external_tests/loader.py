from flask import current_app
from services.hasura import hce

from services.logger import setup_custom_logger
logger = setup_custom_logger(__file__)


class ExternalTestsLoader:

    def get_groups_and_test_cases_for_project(self, project_id):
        query = """
            query ($project_id: uuid) {
              group(
                where:{test_cases:{test_results:{test_run:{configuration:{project_id:{_eq: $project_id}}}}}}
                )
              {
                id
                name
              }
              test_case(
                where:{test_results:{test_run:{configuration:{project_id:{_eq: $project_id}}}}}
              )
              {
                id
                name_from_file
              }
            }
        """
        response = hce(current_app.config, query, variable_values={"project_id": project_id})
        groups_dict = {}
        test_cases_dict = {}
        for group in response.get("group"):
            groups_dict[group.get("name")] = group
        for test_case in response.get("test_case"):
            test_cases_dict[test_case.get("name_from_file")] = test_case
        return groups_dict, test_cases_dict

    def bulk_insert_all(self, objects):
        query = """
            mutation insertTestRunWithResults (
              $test_run: test_run_insert_input!
              $groups: [group_insert_input!]!
              $test_cases: [test_case_insert_input!]!
              $results: [test_result_insert_input!]!
              $custom_fields: [custom_field_insert_input!]!
            ) 
            {
              insert_test_run_one (object: $test_run) {id}
              insert_group (objects: $groups) {affected_rows}
              insert_test_case (objects: $test_cases) {affected_rows}
              insert_test_result (objects: $results) {affected_rows}
              insert_custom_field (objects: $custom_fields) {affected_rows}
            }
                """
        try:
            hce(current_app.config, query, variable_values=objects)
        except Exception as e:
            logger.error(f"Error occurred while bulk inserting: {str(e)}")
            raise e

