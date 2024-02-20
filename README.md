# G2B-DB

> Curate and structure data from IGDB into Supabase to be used into webapp game

## Description

Small project to parse data from https://www.igdb.com/ into a supabase solution to distribute a clean API of the game informations

Made with [Supabase](https://supabase.com/docs)

## Commands

- `yarn start` to import everything
- `yarn dry` to do a dry run
- `yarn companies` to import companies
- `yarn games` to import games
- `yarn genres` to import genres
- `yarn app_games` to create/update games table used in app

## Data access

To access the data you can use the supabase API public key :

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2cGJxZHhvY2FoaXJnanF1enhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgxNzY4NTgsImV4cCI6MjAyMzc1Mjg1OH0.EFjSt3NMsjKAa6XMUxhB1jhIxIK3X1cKtql44oukcjY
```

- Project url is `https://evpbqdxocahirgjquzxm.supabase.co`
- Base api request url is `https://evpbqdxocahirgjquzxm.supabase.co/rest/v1`

### Avaible tables are

- Game
  - `id`
  - `checksum` (hash)
  - `name`
  - `first_release_date` (UNIX Timestamp)
  - `hypes`
  - `genres`
  - `publisher`
  - `developer`
- Company
  - `id`
  - `checksum` (hash)
  - `name`
  - `published`
  - `developed`
  - `country`
  - `description`
  - `websites`
- Genre
  - `id`
  - `checksum` (hash)
  - `name`
- AppGames
  - `id`
  - `checksum` (hash)
  - `name`
  - `genres`
  - `release_year`
  - `developer`
  - `unsure_developer`
  - `publisher`
  - `unsure_publisher`

### Requests examples

- Add in headers the key `apikey` with the supabase API public key
- Add in headers the authorization Bearer token with the same value as `apikey`

To get all games

```
https://evpbqdxocahirgjquzxm.supabase.co/rest/v1/games
```

To get the companies name

```
https://evpbqdxocahirgjquzxm.supabase.co/rest/v1/company?select=name
```

To get one genre by name

```
https://evpbqdxocahirgjquzxm.supabase.co/rest/v1/genre?name=eq.Strategy
```

Using curl for all games traits

```
curl 'https://evpbqdxocahirgjquzxm.supabase.co/rest/v1/Game?select=traits' \
-H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2cGJxZHhvY2FoaXJnanF1enhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgxNzY4NTgsImV4cCI6MjAyMzc1Mjg1OH0.EFjSt3NMsjKAa6XMUxhB1jhIxIK3X1cKtql44oukcjY" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2cGJxZHhvY2FoaXJnanF1enhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgxNzY4NTgsImV4cCI6MjAyMzc1Mjg1OH0.EFjSt3NMsjKAa6XMUxhB1jhIxIK3X1cKtql44oukcjY"
```

## Credits

- https://www.igdb.com/ and the wonderful community that creates the data
- [Supabase](https://supabase.com) for distributing such a simple, fast and useful tool for basically no expense at all
- [@kevinbacas](https://github.com/kevinbacas) for the base code and much help understanding supabase
