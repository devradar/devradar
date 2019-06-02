# Setup instructions

<!-- TOC depthFrom:2 -->

- [Firebase backend](#firebase-backend)
  - [Configure Role Based Access](#configure-role-based-access)
  - [Styling](#styling)
  - [Create Accounts](#create-accounts)
  - [Deployment](#deployment)
- [Local backend](#local-backend)
  - [Build application locally](#build-application-locally)

<!-- /TOC -->

The application can either run on a serverless Google Firebase backend or without any backend.
Some of the features like _editing_ or _user authentication_ are only supported when running with a backend.

The **local file** mode is best when running a fully public - or network shielded - instance of the techradar.
In this case changes to the radars blips has to be done on file level, e.g. via pull requests in your git repository.

Choose your backend by setting the `.backend.type` property to either **firebase** or **toml** (local file) in the `src/config.js`.

## Firebase backend

Before deploying you first need to configure your instance of the techradar repository.

### Configure Role Based Access

There are two files that implement the RBAC rules:

1. [Firestore security rules](firestore.rules) control access to the Firebase backend and therefore are the most important rules to get right
    * wrong configuration can lead to exposed information you intended to keep restricted
1. [the config](src/config.js) defines which frontend elements are shown under which circumstances
    * getting these wrong will (only) result in missing/broken features

Within `src/config.js` the relevant section is **routes** and the `routes[].validator` function in specific.
This can be any javascript function that will get evaluated when rendering the web page.
As an argument the `validator` function receives a `user` object that contains a unique ID `.uid` as well as a `.roles` property.
These two properties can be used to filter access.

```javascript
routes: [ // configure name, permissions & viewports
    // do NOT change the view property as this links to the vue component and is used for lookups across the app

    // adding user => true will make it visible to anyone
    { .., validator: user => true },
    // checking for an existing .uid property requires the user to be logged in
    { .., validator: user => user.uid },
    // use the .roles object to check for (boolean) state of a specific role
    { ..,validator: user => user.uid && user.roles.admin },
```

By default the `firestore.rules` implement roles of **admin** and **editor**.
You can add more roles if you want but would have to modify the `firestore.rules` as well.
The **edit** button is shown depending on the `editPermissions` function defined also in the configuration.

> 🚨 Note that read operations are allowed to everyone by default

| role | view blips | write blips | manage roles |
|--|--|--|--|
| anyone | ✅ | ❌ | ❌ |
| editor | ✅ | ✅ | ❌ |
| admin | ✅ | ✅ | ✅ |

### Styling

The stylesheet can be modified to change the **radar colors** or the size/responsiveness.
Most of the visuals for the radar itself are kept in `src/assets/radar.scss`.

The Vue application is themed using the `.theme` property defined in `src/config.js`.
Modifying the color of header, buttons etc should happen via this property.

### Create Accounts

Hosting a firebase backed radar currently involves a couple of manual steps to leverage the full feature set.

1. [fork](https://help.github.com/articles/fork-a-repo/) this repository
1. customize devradar to your needs
1. create a [firebase project](https://firebase.google.com/)
1. (optional) create [Twitter app](https://apps.twitter.com/) and configure [firebase sign in method](https://firebase.google.com/docs/auth/web/twitter-login)
1. (optional) create [GitHub app]() and configure [firebase sign in method](https://firebase.google.com/docs/auth/web/github-auth)
1. [deploy](#deployment) it using [Travis CI](https://travis-ci.com)
1. log in using the Twitter or GitHub OAuth provider
1. access the `/roles` collection within your firebase project and set `admin: true` for your newly added account
1. from this point on you can use the user management in the radar itself to manage roles

> Note: you can not remove your own admin permissions using the UI

### Deployment

After creating a project, create a CI token and encode it for Travis CI use

```sh
# create a firebase CI token
firebase login:ci

# encrypt the token to your project
docker run --rm caktux/travis-cli encrypt "<token from firebase login:ci>" -r <github repo>
```

Log into firebase and initialize an empty **Firestore** database in locked mode.

Copy the resulting token to [the Travis CI config](.travis.yml) under `deploy / token /secure`. Modify `deploy / project` to equal your firebase **Project ID**.
One mandatory customization to the [config](src/config.js) is to set `firebase.key` and `firebase.project` to your **Web API Key** and **Project ID** respectively.

## Local backend

In local file mode authentication features are not supported.
The default `src/config.js` file allows public viewing of all devradar features, therefore no changes are necessary when using the local backend.

### Build application locally

As an alternative to the Travis CI deployment mentioned in the Firebase section you can also build the application locally.

To build the app locally you need Node.js installed.
The latest LTS release is recommended.
 
```sh
npm run ci # install dependencies
npm run build # build the application
```

The resulting `dist/` folder can be served with any webserver.
If you want to run it in the internet [GitHub pages](https://pages.github.com/) could do this job.
