---
title: Update node dependencies
assignees: anoff
labels: kind:housekeeping, dependencies
---
It's time to update the project dependencies again

Best to use [ncu](https://github.com/raineorshine/npm-check-updates)

Use `npm run npm:update:safe` to ignore some base dependencies

- [ ] Update minor version on all packages `ncu --target minor -u`
- [ ] Make sure stuff still works `npm install && npm test`
- [ ] (try to) bump major on non-core packages: `npm run npm:update:safe` to see changes and `npm run npm:update:safe -- -u` to update
