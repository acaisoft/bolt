INSERT INTO configuration_type (name, description, slug_name) VALUES
    ('Performance', 'Select this type if your repository contains performance tests', 'load_tests');


INSERT INTO parameter (name, param_name, param_type, slug_name, default_value) VALUES
    ('time', '-t', 'str', 'load_tests_duration', '10'),
    ('users/second', '-r', 'int', 'load_tests_rampup', '500'),
    ('users', '-u', 'int', 'load_tests_users', '1000'),
    ('monitoring duration', '-md', 'int', 'monitoring_duration', '10'),
    ('monitoring interval', '-mi', 'int', 'monitoring_interval', '5'),
    ('host', '-H', 'str', 'load_tests_host', '');
