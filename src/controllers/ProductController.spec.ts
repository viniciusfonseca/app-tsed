import * as SuperTest from 'supertest'
import { TestContext } from '@tsed/testing';
import { Server } from '../Server';
import { ExpressApplication } from '@tsed/common';
import { CONNECTION, DBService } from '../services/DBService';
import { BCRYPT, BCryptHelper } from '../services/BCryptHelper';
import { JWT, JWTHelper } from '../services/JWTHelper';
import { createAdminToken } from '../tests/createAdminToken';

describe('customer crud', () => {

    let request: SuperTest.SuperTest<SuperTest.Test>;
    let Authorization: string

    before(TestContext.bootstrap(Server))
    before(TestContext.inject(
        [ ExpressApplication, CONNECTION, BCRYPT, JWT ],
        async (app: ExpressApplication, db: DBService, bcrypt: BCryptHelper, jwt: JWTHelper) => {

        request = SuperTest(app)
        Authorization = await createAdminToken(db, bcrypt, jwt)
    }))
    after(TestContext.reset)

    it('list', TestContext.inject([ CONNECTION ], async (db: DBService) => {

        

    }))

})