### Phase 1: (Working Condition backend_Backup_01)
1. Model creation (bus, driver, stops, and user)
2. Controllers (bus, driver, stops, and user)
3. Middleware (bus, driver, stops, and user) // only created file (no code)
4. Routes (bus, driver, stops, and user)
5. Config (db.js)
6. app.js
7. server.js
8. .env, .gitignore
9. readme

### Phase 2: (Working Condition backend_Backup_02)
1. install socket.io
2. update server.js

### Phase 3: (Working Condition backend_Backup_03/04)
1. Implementing Analytics Dashboard
    1. Active Buses: Counts buses currently active in the system.
    2. Most-Used Routes: Groups buses by route and sorts them by usage count.
    3. Driver Performance: Aggregates driver data to calculate trip counts per driver.
2. Backup & Restore Data
    1. Backup: Retrieves all bus, stop, and driver data and returns it as JSON.
    2. Restore: Replaces the database content with provided backup data.

### Phase 3: (Working Condition backend_Backup_05)
1. Incident Reporting 
2. Geofencing (pending)







<!-- usefull commands -->
Run Backend: npx nodemon src/server.js
Run Client: npm run dev


<!-- installation -->
npm create vite@latest frontend --template react
cd frontend
npm install

install required packages
npm install axios react-router-dom jwt-decode
