# published [![](https://img.shields.io/badge/source--000000.svg?logo=github&style=social)](https://github.com/fiverr/published) [![](https://img.shields.io/npm/v/published.svg)](https://www.npmjs.com/package/published) [![](https://circleci.com/gh/fiverr/published.svg?style=svg&circle-token=c887f45cd0a168ce3a1a304923f92bff11cccd81)](https://circleci.com/gh/fiverr/published)

## Opinionated NPM publish program


### Run using npx
```sh
npx published
```
### Options

| option | Example
| - | -
| Dry run | `npx published testing`
| Notify on Slack | `npx published --slack.webhook $SLACK_WEBHOOK`
| Change Slack webhook channel | `npx published --slack.webhook $SLACK_WEBHOOK --slack.channel "#publish"`
| Silent outputs and notifications | `npx published --quiet`

## TL;DR
| Branch type | action |
| --- | --- |
| **Feature branch** | Release RC versions on tag by branch name. |
| **Master branch** | Release clean semver on "latest" tag. |

<details>
<summary>NPM Permissions</summary>
In order to publish an NPM package as a privileged user, create an NPM configuration file. One way to do it is to hide the token in an environment variable and add this preceding step:

```sh
echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" >> ~/.npmrc
```
</details>

## Flow

#### Feature branch

- Publish only versions with a pre-release section containing `rc` string
- Branch versions get a suffix that matches the commit ID, so you can re install the same tag and get updates
- Tags are named after the branch name

#### "master" branch

- Only publish clean semver versions, no pre-release
- Publish versions to tag "latest" (or publishConfig.tag from package.json)

#### "latest" branch
- Same as master, but will ignore publishConfig.tag setting.<br>Use this if your master branch points to "next" through publishConfig.tag

### Examples

| branch | version | publish | tag
| - | - | - | -
| `my_feature_branch`, `next` | `1.3.0` | nothing | N/A
| `my_feature_branch`, `next` | `1.3.1-alpha` | nothing | N/A
| `my_feature_branch`, `next` | `1.3.1-rc` | `1.3.1-rc-c447f6a` | `my_feature_branch`, `next`
| `my_feature_branch`, `next` | `1.3.1-rc.1` | `1.3.1-rc.1-c447f6a` | `my_feature_branch`, `next`
| `master`, `latest` | `1.3.0` | `1.3.0` | `latest`
| `master`, `latest` | `1.3.0-beta` | Throws Error | N/A
| `master`, `latest` | `1.3.0-rc` | Throws Error | N/A
