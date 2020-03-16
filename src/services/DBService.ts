import { registerProvider } from "@tsed/di";
import { Model, Sequelize, DataTypes } from "sequelize";

class User extends Model {}
class Address extends Model {}
class Product extends Model {}

export const CONNECTION = Symbol.for("CONNECTION")

export class DBService {

    public users = User
    public addresses = Address

    async init() {
        const sequelize = new Sequelize("sqlite::memory", { logging: false })
        await sequelize.authenticate()

        User.init({
            role: { type: DataTypes.STRING },
            name: { type: DataTypes.STRING },
            email: { type: DataTypes.STRING },
            password: { type: DataTypes.STRING }
        }, { sequelize, modelName: 'user' })

        Address.init({
            street: { type: DataTypes.STRING },
            number: { type: DataTypes.STRING },
            city: { type: DataTypes.STRING },
            state: { type: DataTypes.STRING },
            postal_code: { type: DataTypes.STRING }
        }, { sequelize, modelName: 'address' })

        User.hasOne(Address)

        Product.init({
            name: { type: DataTypes.STRING },
            price: { type: DataTypes.NUMBER },
            currency: { type: DataTypes.STRING },
        }, { sequelize, modelName: 'product' })

        await sequelize.sync()
    }
}

registerProvider({
    provide: CONNECTION,
    async useAsyncFactory() {
        const db = new DBService()
        await db.init()
        return db
    }
})