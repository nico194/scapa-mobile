import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('scapa-database.db')

db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () =>
console.log('Foreign keys turned on')
);

export const dropDatabaseTablesAsync = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
        tx.executeSql(`
                drop table users;
                drop table categories,
                drop table pictograms
            `,
            [],
            (_, result) => { resolve(result) },
            (_, error) => { console.log("error dropping users table"); reject(error)
            }
        )
        })
    })
}

export const setupDatabaseAsync = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(`
                create table if not exists users (id integer primary key not null, email text, accessToken text, client text, uid text, voice integer);
                create table if not exists categories ( id integer primary key not null, desription text, custom integer );
                create table if not exists pictograms ( id integer primary key not null, desription text, category_id integer, custom integer, foreign key(category_id) references categories(id) );
            `);
        },
        (_, error) => { console.log("db error creating tables"); console.log(error); reject(error) },
        (_, success) => { resolve(success)}
        )
    })
}

export default db