import db from '../configs/database';

/*
"accessToken": "boN_WloY5YQyKfcAlOP-4A",
"client": "7yacEt-hInV8AuXGh6wpPw",
"email": "nico1@gmial.com",
"id": 62,
"name": "Nicolas Alarcon",
"uid": "nico1@gmial.com",
*/

export default class User {
    constructor( id, email = '', accessToken = '', client = '', uid = '' ) {
        this.id = id
        this.email = email,
        this.accessToken = accessToken,
        this.client = client,
        this.uid = uid
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
    }

    getEmail() {
        return this.email;
    }

    setEmail(email) {
        this.email = email;
    }

    getAccessToken() {
        return this.accessToken;
    }

    setAccessToken(accessToken) {
        this.accessToken = accessToken;
    }

    getClient() {
        return this.client;
    }

    setClient(client) {
        this.client = client;
    }

    getUid() {
        return this.uid;
    }

    setUid(uid) {
        this.uid = uid;
    }

    async getUser(id) {
        return new Promise((resolve, reject) => {
            db.transaction( tx => {
                tx.executeSql(
                    'select * from users where id = ?',
                    [id],
                    (trn, results) => {
                        console.log(results.rows._array[0])
                        resolve(results.rows._array[0]);
                    },
                    (trn, error) => {
                        reject(error);
                    }    
                )
            })
    
        })
    }

    async save() {
        return new Promise((resolve, reject) => {
            db.transaction( tx => {
                tx.executeSql(
                    'insert into users ( id, email, accessToken, client, uid ) values (?, ?, ?, ?, ?)',
                    [this.id, this.email, this.accessToken, this.client, this.uid],
                    (trn, results) => {
                        console.log('Saved', results.rowsAffected)
                        resolve(results.rowsAffected);
                    },
                    (trn, error) => {
                        console.log(error)
                        reject(error);
                    }
                )
            })
        })
    }

    async update() {
        return new Promise( (resolve, reject) => {
            db.transaction( tx => 
                tx.executeSql(
                    'update users set accessToken = ?, client = ?, uid = ? where id = ?',
                    [this.accessToken, this.client, this.uid, this.id],
                    (trn, results) => {
                        console.log('Saved', results.rowsAffected)
                        resolve(results.rowsAffected);
                    },
                    (trn, error) => {
                        reject(error)
                    }
                )
            )
        });
    }

    async changeVoiceReproduce() {
        return new Promise( (resolve, reject) => {
            db.transaction( tx => 
                tx.executeSql(
                    'update users set voice = ? where id = ?',
                    [this.id, !this.voice],
                    (trn, results) => {
                        resolve(true)
                    },
                    (trn, error) => {
                        reject(error)
                    }
                )
            )
        });
    }
}
