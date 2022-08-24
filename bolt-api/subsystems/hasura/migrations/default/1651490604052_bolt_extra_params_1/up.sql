INSERT INTO parameter (name, param_name, param_type, slug_name, default_value) VALUES
    ('file name', '-f', 'str', 'load_tests_file_name', 'load_tests.py'),
    ('repository branch', '-b', 'str', 'load_tests_repository_branch', 'master'),
    ('users/worker', 'n/a', 'int',  'load_tests_users_per_worker', '1000');
