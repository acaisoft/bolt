# Bolt Workflow Termination

Simple (nano) service for terminating argo's workflows.

# Usage

```
/workflow-termination [POST]

Body:
{
    "workflow_name": "wrkflw-abc-123"
}
```