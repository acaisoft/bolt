build:
	docker build --no-cache \
    --build-arg auth_service=${BOLT_AUTH_SERVICE} \
    --build-arg api_service_url=${BOLT_API_SERVICE_BASE_URL} \
    --build-arg auth_keycloak_url=${BOLT_KEYCLOAK_URL} \
    --build-arg hasura_ws_url=${BOLT_HASURA_WS_URL} \
    --build-arg hasura_api_url=${BOLT_HASURA_API_URL} \
    --build-arg argo_url=${BOLT_ARGO_URL} \
    --build-arg auth0_domain=${BOLT_AUTH0_DOMAIN} \
    --build-arg auth0_client=${BOLT_AUTH0_CLIENT_ID} \
    --build-arg auth0_audience=${BOLT_AUTH0_AUDIENCE} \
    -t bolt-portal-local:latest \
    .
