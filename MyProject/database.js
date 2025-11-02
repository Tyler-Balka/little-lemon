import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseAsync('little_lemon');

const createTable = async () => {
    try {
        await (await db).execAsync(
        `CREATE TABLE IF NOT EXISTS menu (
            id INTEGER PRIMARY KEY NOT NULL,
            name TEXT,
            description TEXT,
            price REAL,
            image TEXT,
            category TEXT
        );`
    );
    } catch (error) {
        console.error("Error creating table:", error);
    }
}

const fetchMenuData = async () => {
    try {
        // if no data in table, fetch from API and store
        const result = await (await db).getAllAsync('SELECT COUNT(*) as count FROM menu;');
        const count = result[0].count;
        if (count === 0) {
            const response = await fetch('https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json');
            const data = await response.json();
            const menuItems = data.menu;

            // insert menu items into the database
            for (const item of menuItems) {
                await (await db).runAsync(
                    `INSERT INTO menu (name, description, price, image, category) VALUES (?, ?, ?, ?, ?);`,
                    [item.name, item.description, item.price, item.image, item.category]
                );
            }
        }
    } catch (error) {
        console.error("Error fetching menu data:", error);
    }
}

const getMenuFromDB = async () => {
    try {
        const result = await (await db).getAllAsync('SELECT * FROM menu;');
        return result;
    } catch (error) {
        console.error("Error retrieving menu from database:", error);
        return [];
    }
}

const getCategory = async (category) => {
    try {
        const result = await ((await db).getAllAsync('SELECT * FROM menu WHERE category = ?;', [category]));
        return result;
    } catch (error) {
        console.error("Error retrieving category from database:", error);
        return [];
    }
}

const filterMenuByName = async (name, categories = []) => {
    try {
        let query = `SELECT * FROM menu WHERE name LIKE ?;`;
        let params = [`%${name}%`];
        if (categories.length > 0) {
            query += ` AND category IN (${categories.map(() => '?').join(',')});`;
            params.push(...categories);
        }
        const result = await (await db).getAllAsync(query, params);
        return result;
    } catch (error) {
        console.error("Error filtering menu by name:", error);
        return [];
    }
}

export { createTable, fetchMenuData, getMenuFromDB, getCategory, filterMenuByName };