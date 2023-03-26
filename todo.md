## TODOS

## Login Page

- [x] - Create login credentials for Github
- [x] - Create a login button
- [x] - create oauth-redirect page in routes folder to extract token and login with Oauth Provider
- [x] - create methods to post to Github Oauth and Github get user
- [x] - get user with email/provider info
- [x] - create session in lib folder
- [x] - route to Scavenger-Hunt page
  - [x] - require auth
  - [x] - logout action
- [x] - forward to `scavenger-hunts` from home page if logged.

## Scavenger Hunts List

- [x] - get user's scavenger hunts list
- [ ] - link to Scavenger Hunt page
- [ ] - actions to add/update/invalidate scavenger hunt lists
- [ ] -

## Edit Page

- [ ] - fetch details from database (ScavengerHunt and HuntItems)
  - could do a join to get all details, or could fetch separately
- [ ] - action to post new item, invalidate existing list of items (refetch details)

## Improvements

- [ ] - Loading transitions between pages?
  - maybe a component
