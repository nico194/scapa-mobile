import db from '../configs/database'

export default class Category {
    constructor(id, description, custom) {
        this.id = id;
        this.description = description;
        this.custom = custom
    }

    async save() {
        return new Promise((resolve, reject) => {
            db.transaction( tx => {
                tx.executeSql(
                    'insert into categories (id, description, custom) values (?, ?, ?)',
                    [this.id, this.description, this.custom],
                    () => resolve(true),
                    (error) => reject(error)
                )
            })
        })
    }

    
}