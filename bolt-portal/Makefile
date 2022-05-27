build:
	docker build \
    --build-arg auth_service=${BOLT_AUTH_SERVICE} \
    --build-arg auth_service_url=${BOLT_AUTH_SERVICE_BASE_URL} \
    --build-arg auth_keycloak_url=${BOLT_KEYCLOAK_URL} \
    --build-arg hasura_ws_url=${BOLT_HASURA_WS_URL} \
    --build-arg hasura_api_url=${BOLT_HASURA_API_URL} \
    -t bolt-portal-local:latest \
    .
