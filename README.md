# Camp 12 Midterm Backend

- Run the local database `docker-compose up`

After you pull a new version

- make sure you have a `.env` file with the `DATABASE_URL`
- make sure your database container is running - `docker-compose up`
- `npx prisma db push` - to sync your database with the latest schema
- `npx prisma db studio` - to view the database
