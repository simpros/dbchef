# DBChef

## The Database UI that finally fits your usecase.

Are you tired of searching for the correct data within database with dozens of tables? So was I. Thats why I build DBChef - a reuseable and unopinionated Admin-UI. Connect your resource and build views that fit your usecase.

### Development

This application is build with bun and sveltekit.
Before you can start you have to setup the sqlite db file with `bunx drizzle-kit push:sqlite`. This will create a dbchef.sqlite file - thats all you need for DBChef!

To start the devserver run `bun --bun run dev`.
