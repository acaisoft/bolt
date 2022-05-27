# Hasura root

Holds migrations and hasura-cli tool configuration.

#### Modifying schema

##### Prerequisites

* git
* hasura cli
* running instance of hasura (preferably local, worst case in dev env)

In order modify schema (or permisisons or upstreams, etc) and have the changes
recorded, changes must be made through `hasura-cli` wrapper tool, install it 
from [hasura website](https://docs.hasura.io/1.0/graphql/manual/hasura-cli/install-hasura-cli.html).

Knowledge of git is assumed.

##### Steps

Pull or clone the repo: 
```
git clone git@bitbucket.org:acaisoft/bolt-api.git
```

Enter hasura-cli configuration folder:
```
cd bolt-api/hasura
```

Start the tool and point it for example to dev env:

```
hasura console --endpoint https://hasura.bolt.acaisoft.io --access-key <XXX>
```

Leave it running. Open browser window and point it 
to [local console](http://localhost:9695/api-explorer)

Any changes made to schema, permissions or events will be recorded in `bolt-api/hasura/migrations`.

Once the changes are satisfactory:

```
git add hasura/migrations
git commit -m "change schema XXX"
git push
```