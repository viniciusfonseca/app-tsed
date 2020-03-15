import { describe } from "mocha";
import * as SuperTest from 'supertest'
import { Server } from "../Server";
import { TestContext } from "@tsed/testing";
import { ExpressApplication } from "@tsed/common";
import { CONNECTION, DBService } from "../services/DBService";
import { BCRYPT, BCryptHelper } from "../services/BCryptHelper";
import { assert } from "chai";
import { RootController } from "./RootController";

describe('root controller', () => {

    let request: SuperTest.SuperTest<SuperTest.Test>;

    before(TestContext.bootstrap(Server))
    before(TestContext.inject([ ExpressApplication ], (app: ExpressApplication) => {
        request = SuperTest(app)
    }))
    after(TestContext.reset)

    it('register', TestContext.inject([ CONNECTION, BCRYPT ], async (db: DBService, bcrypt: BCryptHelper) => {

        await request.post('/register').send({
            email: 'vfonseca@example.com',
            password: '1234',
            confirm_password: '1234'
        })
        .expect(200)

        const user = await db.users.findOne({ where: { email: 'vfonseca@example.com' } })
        assert(user)
    }))

    it('login', TestContext.inject([ CONNECTION, BCRYPT ], async (db: DBService, bcrypt: BCryptHelper) => {

        const rootController: RootController = await TestContext.invoke(
            RootController, [
                { token: CONNECTION, use: db },
                { token: BCRYPT, use: bcrypt }
            ]
        )

        await rootController.register({
            email: 'vfonseca1@example.com',
            password: '1234',
            confirm_password: '1234'
        })

        const { body } = await request.post('/login').send({
            email: 'vfonseca1@example.com',
            password: '1234'
        })
        .expect(200)

        assert.notEqual(body.token.length, 0)
    }))
})