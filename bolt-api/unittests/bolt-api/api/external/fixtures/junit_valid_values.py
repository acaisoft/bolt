EXPECTED_RESPONSE = {
    'data': {
        'custom_fields': [],
        'groups': [
            {
                'id': 'b373d93b-d5d2-44d5-b076-969a3e003db2',
                'name': 'SampleClass'
            },
            {
                'id': 'f0dd2a7b-91b7-4f02-9445-91e82b8b8885',
                'name': 'AnotherSampleClass'
            }
        ],
        'results': [
            {
                'duration': '1.234',
                'id': '960cdac2-f58b-4b36-ae88-4d48f3d8b837',
                'message': None,
                'result': 'success',
                'test_case_id': 'c70a8df4-a5fd-455e-976d-73d672155cc9',
                'test_run_id': 'bea05e03-aa11-43ea-a390-a2ea774a4b5d'
            },
            {
                'duration': '1.234',
                'id': 'b24398ea-d41a-488f-88b7-173851472583',
                'message': None,
                'result': 'success',
                'test_case_id': '6a32907e-781f-4f2f-a25d-72089d62377e',
                'test_run_id': 'bea05e03-aa11-43ea-a390-a2ea774a4b5d'
            },
            {
                'duration': '1.234',
                'id': 'aa7d6883-f281-4e54-a779-50ddf4c68277',
                'message': None,
                'result': 'failure',
                'test_case_id': 'beb23af0-c798-407c-a289-0082d314e462',
                'test_run_id': 'bea05e03-aa11-43ea-a390-a2ea774a4b5d'
            }
        ],
        'test_cases': [
            {
                'group_id': 'b373d93b-d5d2-44d5-b076-969a3e003db2',
                'id': 'c70a8df4-a5fd-455e-976d-73d672155cc9',
                'name_from_file': 'test_one_thing'
            },
            {
                'group_id': 'b373d93b-d5d2-44d5-b076-969a3e003db2',
                'id': '6a32907e-781f-4f2f-a25d-72089d62377e',
                'name_from_file': 'test_another_thing'
            },
            {
                'group_id': 'f0dd2a7b-91b7-4f02-9445-91e82b8b8885',
                'id': 'beb23af0-c798-407c-a289-0082d314e462',
                'name_from_file': 'test_that_thing_that_never_works'
            }
        ],
        'test_run': {
            'duration': '6.068',
            'errors': 0,
            'failures': 1,
            'id': 'bea05e03-aa11-43ea-a390-a2ea774a4b5d',
            'scenario_id': 'd66341eb-099a-4138-817a-24a4c589377d',
            'skipped': 0,
            'successes': 2,
            'timestamp': '2022-11-28T18:16:03.830428',
            'total': 3
        }
    }
}