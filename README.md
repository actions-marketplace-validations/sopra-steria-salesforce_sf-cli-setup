# sf cli setup

[![Check dist/](https://github.com/sopra-steria-salesforce/sf-cli-setup/actions/workflows/check-dist.yml/badge.svg)](https://github.com/sopra-steria-salesforce/sf-cli-setup/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/sopra-steria-salesforce/sf-cli-setup/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/sopra-steria-salesforce/sf-cli-setup/actions/workflows/codeql-analysis.yml)

This action allows to use the Salesforce cli from GitHub Actions, and easily authenticate an org.

# Inputs

## Required or Optional

Every input (except `sf-cli-version`) is optional. If no authentication details are added, only the cli is installed
without any authentication.

## General

| Variable                    | Default | Description                                                                                                           |
| --------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------- |
| `sf-cli-version` (required) | None    | Use [npm version numbers](https://www.npmjs.com/package/@salesforce/cli?activeTab=versions) like `2.33.3` or `latest` |
| `use-cache`                 | `true`  | Use cached version of the sf cli files, see [Cache](#cache)                                                           |
| `set-default-dev-hub`       | `false` | Use `sf` commands without specifying the DevHub (`--target-dev-hub` not needed)                                       |
| `set-default-org`           | `false` | Use `sf` commands without specifying the org (`--target-org` not needed)                                              |
| `alias`                     | Empty   | Useful to keep track of multiple orgs                                                                                 |

## jwt authentication

See
[jwt documentation](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth_jwt_flow.htm).
Allows authenticating the DevHub org using `username` of a dedicated integration user, and `client-id` and `private-key`
of a connected app. You'll also need the `client-secret` to create a scratch org using the jwt flow, but it's not needed
in the plugin. The benefit of authenticating the DevHub using jwt is that you can re-authenticate any active scratch org
without knowing any information about it (except the username and instance url). Also useful because the information
needed to re-authenticate a created scratch org is not secret information. Actual secrets (like an access token) cannot
easily be transferred from job to job in Github Actions. See example below.

| Variable       | Example                                            | Description                                                                                                |
| -------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `username`     | `sf.integration.user@my_org.com`                   | Username of the user in the org                                                                            |
| `client-id`    | `${{ secrets.CLIENT_ID }}`                         | Client ID of the Connected App created in the org (see docs above)                                         |
| `private-key`  | `${{ secrets.PRIVATE_KEY }}`                       | Private Key created for the Connected App (see docs above). Must include `--BEGIN/END PRIVATE KEY--`.      |
| `instance-url` | `https://pecan-pie-7507.scratch.my.salesforce.com` | This is only used when authenticating a scratch org created from a jwt authenticated DevHub (see examples) |

## access-token authentication

See
[access-token documentation](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference_org_commands_unified.htm#cli_reference_org_login_access-token_unified).
Practical for authenticating orgs when you can always get the access-token. However, it'll only last a few hours.

| Variable       | Example                           | Description                                                                          |
| -------------- | --------------------------------- | ------------------------------------------------------------------------------------ |
| `access-token` | `00D09000004gTs0!AQE...nCn`       | Short-lived access token from an org already authenticated by other means (see docs) |
| `instance-url` | `https://MyOrg.my.salesforce.com` | The url of the org being authenticated                                               |

## auth-url authentication

See
[sfdx-url documentation](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference_org_commands_unified.htm#cli_reference_org_login_sfdx-url_unified).
The easiest way to get a DevHub started and to create scratch orgs. However, to get going, you need to login once with a
password for a dedicated user using a web flow to get a token in the sfdx-url flow. If working in a team, this could be
annoying to maintain. And logging in again using the web flow will reset the sfdx-url token.

| Variable   | Example                                                  | Description                                                                            |
| ---------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `auth-url` | `force://PlatformCLI::5Aep.....@MyOrg.my.salesforce.com` | Access token generated using `sf org:display --verbose --target-org my_org` (see docs) |

# Cache

To improve loading time of the plugin, caching of the installed sf cli is added to plugin. This is useful when doing a
PR validation with many separate jobs for each task, and when the sf cli is needed for all jobs. It also caches across
different workflows, as longs as the version number is same for alle usages.

This plugin uses about 33 MB of cache storage (from 10 GB allocated by GitHub). It will use 33 MB for each sf cli
version number used. So if all jobs using this plugin uses the same version, storage should not be an issue. Each branch
have separate cache, but if this script is run on the main branch, every branch will have access to the cache and won't
re-cache it.

Time savings will be from around 30-40 seconds to 4 seconds. If using the plugin many times in different jobs but in the
same workflow, the total time savings will be notable and worth the storage.

Should you run out of storage, GitHub will automatically delete the oldest caches (across all cache types, not just sf
cli).

# Example usage

## jwt

```yaml
name: Validation
on:
  pull_request:
    types:
      - opened
      - synchronize
jobs:
  create:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: sopra-steria-salesforce/sf-cli-setup@v1
        with:
          sf-cli-version: latest
          username: ${{ secrets.USERNAME }}
          client-id: ${{ secrets.CLIENT_ID }}
          private-key: ${{ secrets.PRIVATE_KEY }}
          set-default-dev-hub: true

      - run: |
          echo '${{ secrets.CLIENT_SECRET }}' | sf org:create:scratch --client-id ${{ secrets.CLIENT_ID }} --definition-file config/project-scratch-dev.json --wait 20 --alias scratch-org

      - run: |
          echo "username=$(sf org:display --target-org scratch-org --json | jq -r '.result.username')" >> $GITHUB_OUTPUT
          echo "instance-url=$(sf org:display --target-org scratch-org --json | jq -r '.result.instanceUrl')" >> $GITHUB_OUTPUT
        id: scratch-org

    outputs:
      username: ${{ steps.scratch-org.outputs.username }}
      instance-url: ${{ steps.scratch-org.outputs.instance-url }}

  deploy:
    runs-on: ubuntu-latest
    needs: create
    steps:
      - uses: actions/checkout@v4
      # this run using the plugin will be around 5 seconds, compared to the previous job of 40 seconds, due to built-in caching
      - uses: sopra-steria-salesforce/sf-cli-setup@v1
        with:
          sf-cli-version: latest
          username: ${{ needs.create.outputs.username }}
          instance-url: ${{ needs.create.outputs.instance-url }}
          client-id: ${{ secrets.CLIENT_ID }}
          private-key: ${{ secrets.PRIVATE_KEY }}
          set-default-org: true

      - run: sf project:deploy:start --source-dir ./force-app

  run-tests:
    runs-on: ubuntu-latest
    needs: [create, deploy]
    steps:
      - uses: actions/checkout@v4
      - uses: sopra-steria-salesforce/sf-cli-setup@v1
        with:
          sf-cli-version: latest
          username: ${{ needs.create.outputs.username }}
          instance-url: ${{ needs.create.outputs.instance-url }}
          client-id: ${{ secrets.CLIENT_ID }}
          private-key: ${{ secrets.PRIVATE_KEY }}
          set-default-org: true

      - run: sf apex test run -l RunLocalTests -w 30
```

## auth-url

```yaml
name: SF Test Run on Push
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: sopra-steria-salesforce/sf-cli-setup@v1
        with:
          sf-cli-version: 2.27.6
          auth-url: ${{ secrets.YOUR_SECRET }}
          set-default-dev-hub: true
      - run: sf org:create:scratch --definition-file config/project-scratch-dev.json --wait 20 --alias scratch-org
```

## no auth

```yaml
name: SF Test Run on Push
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: sopra-steria-salesforce/sf-cli-setup@v1
        with:
          sf-cli-version: 2.27.6
          use-cache: false
      - run: sf --version
```
