create_package:
	python3 setup.py sdist bdist_wheel

run_tests:
	@PYTHONPATH='.' pytest \
		--cov-report term-missing \
		--cov=apps \
		--cov=services unittests \
		--junitxml="unit_tests_results.xml"\
		-W ignore::DeprecationWarning \
		-W ignore::pytest.PytestCollectionWarning

hasura_migration_mac:
	kubectl port-forward $(shell kubectl get svc -A -o name | grep bolt-api) 5000:80 &
	docker-compose -f docker-compose-migration-mac.yaml up

hasura_migration_linux:
	kubectl port-forward $(shell kubectl get svc -A -o name | grep bolt-api) 5000:80 &
	docker-compose -f docker-compose-migration.yaml up