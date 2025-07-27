Here's a backup of the database used for the app.
To quickly create it, use one of these commands:

### Create database in one command
```
psql -U username -d vue_portfolio -f vue_portfolio.sql
```

### Create database and run the SQL file
```
psql -U username -d vue_portfolio
\i backup.sql
```

This backup was made using the following pg_dump command:

```
pg_dump -U username vue_portfolio > vue_portfolio.sql
```