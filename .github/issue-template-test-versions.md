---
title: Update test infrastructure
assignees: anoff
labels: kind:housekeeping
---
Make sure devradar is tested against the latest browser and OS versions.
Update all workflows:

- [ ] Update [docker image used for cross-browser testing](https://github.com/cypress-io/cypress-docker-images/tree/master/browsers) to latest version
- [ ] Switch node version in workflows to latest [LTS release](https://nodejs.org/en/about/releases/)
- [ ] Change to [latest OS version](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idruns-on)
