import db from '../configs/database';

/*
"accessToken": "boN_WloY5YQyKfcAlOP-4A",
"client": "7yacEt-hInV8AuXGh6wpPw",
"email": "nico1@gmial.com",
"id": 62,
"name": "Nicolas Alarcon",
"uid": "nico1@gmial.com",
*/

export class User {
    constructor({ id, email, name, accessToken, client, uid, voice = true }) {
        this.id = id
        this.email = email,
        this.name = name,
        this.accessToken = accessToken,
        this.client = client,
        this.uid = uid,
        this.voice = voice
    }

    async getUser(id) {
        return new Promise((resolve, reject) => {
            db.transaction( tx => {
                tx.executeSql(
                    'select * from users where id = ?',
                    [id],
                    (trn, results) => {
                        resolve(results.rows._array);
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
                    'insert into users ( id, email, accessToken, client, uid, voice ) values (?, ?, ?, ?, ?, ?, ?)',
                    [this.id, this.email, this.accessToken, this.client, this.uid, this.voice],
                    (trn, results) => {
                        console.log('seee', results)
                        resolve(results.rows._array);
                    },
                    (trn, error) => {
                        reject(error);
                    }
                )
            })
        })
    }

    async changeVoiceReproduce() {
        return new Promise( (resolve, reject) => {
            db.transaction( tx => 
                tx.executeSql(
                    'update set voice = ? where id = ?',
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
