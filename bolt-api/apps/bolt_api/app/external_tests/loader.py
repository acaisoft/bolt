from flask import current_app
from services.hasura import hce, hce_with_user


class ExternalTestsLoader:

    def bulk_insert_all(self, objects):
        query = '''
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
                '''
        # TODO add error handling
        hce(current_app.config, query, variable_values=objects)
