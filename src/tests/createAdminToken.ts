import { RootController } from "../controllers/RootController"
import { TestContext } from "@tsed/testing"
import { CONNECTION, DBService } from "../services/DBService"
import { JWT, JWTHelper } from "../services/JWTHelper"
import { BCRYPT, BCryptHelper } from "../services/BCryptHelper"

export async function createAdminToken(
    db: DBService,
    bcrypt: BCryptHelper,
    jwt: JWTHelper
) : Promise<string> {

    const password = await bcrypt.hash('1234')

    const adminUser = await db.users.create({
        role: "ADMIN",
        email: "admin@example.com",
        name: "admin",
        password
    })

    const rootController: RootController = await TestContext.invoke(RootController, [
        { token: CONNECTION, use: db },
        { token: JWT, use: jwt },
        { token: BCRYPT, use: bcrypt }
    ])

    const result = await rootController.login({
        email: adminUser['email'],
        password: adminUser['password']
    })

    return result.token
}