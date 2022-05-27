Workflow Creator
----------------

Workflow Creator is a microservice that is in charge of creating Argo's Workflows and submitting it to a cluster.

It exposes single endpoint (`/workflows [POST]`) which will create a workflow and submit it to a cluster.


# Development

Install `pre-commit`.

# Run service locally

When service is ran, it will try to connect to Kubernetes. It will use local `~/.kube/config` if present.

To start service execute

```sh
gunicorn -b 0.0.0.0:5000 'src.app:serve_app()'
```
