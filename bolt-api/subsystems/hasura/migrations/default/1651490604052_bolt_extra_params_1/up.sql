INSERT INTO parameter (name, param_name, param_type, slug_name, default_value, tooltip) VALUES
    ('file name', '-f', 'str', 'load_tests_file_name', 'load_tests.py', 'Name of the file containing defined locust tests.'),
    ('repository branch', '-b', 'str', 'load_tests_repository_branch', 'master', 'Branch of your test repository to be used.'),
    ('users/worker', 'n/a', 'int',  'load_tests_users_per_worker', '1000', 'Amount of users to be spawned on a single worker node.');
