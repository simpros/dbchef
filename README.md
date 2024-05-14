# DBChef

## The Database UI that finally fits your usecase.

Are you tired of searching for the correct data within database with dozens of tables? So was I. Thats why I build DBChef - a reuseable and unopinionated Admin-UI. Connect your resource and build views that fit your usecase.

# Supported Databases

- [x] Postgres

## Usage

DBChef is structured into 4 layers.

### Resource

A Resource is basically a DB Connection.<br />**Currently no passwords are stored in DBChef, you will have to reenter the password after every restart of DBChef**

### Workspace

A workspace is a use-case specific set of views on a resource. For example a Movie Application could have a Workspace based on Genres and a Workspace based on Actors.

#### Workspace Elements

A Workspace Element is actually a database select that allows to do pick a reusable value. This value can be used by other Workspace Elements or views through the `{WORKSPACE_ELEMENT_NAME}` placeholder.

### View

A view is the actual representation of database rows. Workspace-Elements can be used to dynamically set query-elements through the `{WORKSPACE_ELEMENT_NAME}` placeholder.

You can also specify a **Detail Query** which will allow you to display details based on a `{{item}}` placeholder. The item is currently determinded by the first column specified in the **View Query**!
If you also want to enable modifying the data, you have to specify an **UPDATE** Query - its required to have a `{{values}}` placeholder in it, which will be replaced with comma sepeated list of the values from the form.

## Example

Image you want to build an Movie-Recommendation-Service. Therefor you have to build a Movie Database.

First of all we want to create the resource that connects to the database.

Next we can create a "Genre" Workspace on that resource to work with the database on a per Genre level. To achive that we can add an Element to the Workspace with a query like this:

```sql
Select id as value, genre as label from genres;
```

This will add a dropdown-selection that displays all of the genres.

The next step would be to create a view that makes use of the Workspace Element.
The query could look like this:

```sql
Select * from movies where genre_id = {Genre}
```

### Development

This application is build with bun and sveltekit.
Before you can start you have to setup the sqlite db file with `bunx drizzle-kit push:sqlite`. This will create a dbchef.sqlite file - thats all you need for DBChef!

To start the devserver run `bun --bun run dev`.
