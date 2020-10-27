# published [![](https://img.shields.io/badge/source--000000.svg?logo=github&style=social)](https://github.com/fiverr/published) [![](https://img.shields.io/npm/v/published.svg)](https://www.npmjs.com/package/published) [![](https://circleci.com/gh/fiverr/published.svg?style=svg&circle-token=c887f45cd0a168ce3a1a304923f92bff11cccd81)](https://circleci.com/gh/fiverr/workflows/published/tree/master)

## 📦 Opinionated NPM publish program <svg xmlns="http://www.w3.org/2000/svg" viewBox="20 20 60 60" width="100" height="100" style="display:block; margin:0 auto"><ellipse cx="40.625" cy="55.678" rx="1.875" ry="2.812"/><ellipse cx="59.375" cy="55.678" rx="1.875" ry="2.812"/><path d="M57.5 65.053h-15a.937.937 0 1 0 0 1.876h15a.937.937 0 1 0 0-1.876z"/><path d="M75.312 42.687v-.011c0-.048-.021-.092-.027-.137-.011-.072-.011-.145-.04-.214L69.51 28.143c-.002-.002-.004-.003-.004-.005a.923.923 0 0 0-.687-.544c-.057-.013-.111-.035-.17-.035l-.009-.002H31.359l-.011.002c-.044 0-.084.019-.126.025a.935.935 0 0 0-.729.553c0 .002-.002.003-.004.005l-5.735 14.182c-.027.069-.029.139-.038.209-.009.049-.029.091-.029.143v31.7c0 .518.419.938.938.938h48.75a.937.937 0 0 0 .938-.938V42.694l-.001-.007zm-25.015 2.122c-.037-.013-.075-.005-.112-.013a.777.777 0 0 0-.363-.001c-.038.007-.078.001-.119.015l-3.066 1.023v-2.219h6.727v2.219l-3.067-1.024zM31.993 29.432h14.104l-1.23 12.307h-17.85l4.976-12.307zm17.069 12.306H46.75l1.23-12.307h1.082v12.307zm1.876-12.306h1.082l1.23 12.307h-2.312V29.432zm4.195 12.306l-1.23-12.307h14.104l4.977 12.307H55.133zm18.305 31.7H26.562V43.613h18.199v3.52c0 .051.02.095.029.143.007.051.002.103.018.154.004.009.014.013.017.022.061.165.167.3.303.406.027.022.053.037.084.057a.923.923 0 0 0 .487.156.926.926 0 0 0 .296-.048L50 46.688l4.005 1.335a.926.926 0 0 0 .296.048.908.908 0 0 0 .487-.156c.031-.02.057-.035.084-.057a.915.915 0 0 0 .303-.406c.003-.009.013-.013.017-.022.016-.051.011-.103.018-.154.01-.048.029-.092.029-.143v-3.52h18.199v29.825z"/></svg>

published helps streamline a git based workflow with package publishing through continues delivery. Developers control their branch and version strategies, and published takes care of logical conditioning of when to publish stable versions and/or release candidates.

### Run using npm exec
```sh
npm exec published --yes
```

### Options

| option | Description | Example
| - | - | -
| testing | Dry run | `npm exec published --yes -- --testing`
| slack.webhook | Notify on Slack | `npm exec published --yes -- --slack.webhook $SLACK_WEBHOOK`
| slack.channel | Change Slack webhook channel | `npm exec published --yes -- --slack.webhook $SLACK_WEBHOOK --slack.channel "#publish"`
| quiet | Silent outputs and notifications | `npm exec published --yes -- --quiet`
| git-tag | Push a tag to git, Only from `master`(latest-branch) or `latest` branch | `npm exec published --yes -- --git-tag`
| on-publish | Execute shell command after a publish event | `npm exec published --yes -- --on-publish bash\ ./do-more.sh`
| on-&lt;tag&gt; | Execute shell command after a publish event with this tag (executes after on-publish) | `npm exec published --yes -- --on-latest 'echo "Published!"'`
| latest-branch | Branch that is considered latest (default is 'master') | `npm exec published --yes -- --latest-branch stable`
| tag-name | Tag name to be used regardless of config. If performed from a branch other than `master`, needs to be used in conjunction with `latest-branch` option | `npm exec published --yes -- --tag-name next --latest-branch next`
| no-sha | Disables the commit's SHA suffix for RC versions | `npm exec published --yes -- --no-sha`

## TL;DR
| Branch type | action |
| --- | --- |
| **Feature branch** | Release RC versions on tag by branch name. |
| **Master (latest) branch** | Release clean semver on "latest" tag. |

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
- Unless the `--no-sha` flag was passed, branch versions get a suffix that matches the commit ID, so you can re install the same tag and get updates
- Tags are named after the branch name

#### "master" branch

- Only publish clean semver versions, no pre-release
- Publish versions to tag "latest" (or publishConfig.tag from package.json)

> \* using `latest-branch` option will switch its behaviour with master

#### "latest" branch
- Same as master, but will ignore publishConfig.tag setting.<br>Use this if your master branch points to "next" through publishConfig.tag

### Examples

| branch | version | publish | tag | w/o sha
| - | - | - | - | -
| `my_feature_branch`, `next` | `1.3.0` | nothing | N/A | -
| `my_feature_branch`, `next` | `1.3.1-alpha` | nothing | N/A | -
| `my_feature_branch`, `next` | `1.3.1-rc` | `1.3.1-rc` | `my_feature_branch`, `next` | ✓
| `my_feature_branch`, `next` | `1.3.1-rc.1` | `1.3.1-rc.1` | `my_feature_branch`, `next` | ✓
| `my_feature_branch`, `next` | `1.3.1-rc` | `1.3.1-rc-c447f6a` | `my_feature_branch`, `next` | ✕
| `my_feature_branch`, `next` | `1.3.1-rc.1` | `1.3.1-rc.1-c447f6a` | `my_feature_branch`, `next` | ✕
| `master`, `latest` | `1.3.0` | `1.3.0` | `latest` | -
| `master`, `latest` | `1.3.0-beta` | Throws Error | N/A | -
| `master`, `latest` | `1.3.0-rc` | Throws Error | N/A | -

> \* using `latest-branch` option will switch its behaviour with master

Package icon by Julien Deveaux from the Noun Project
