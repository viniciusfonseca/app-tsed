import { describe, it } from 'mocha'
import { TestContext} from '@tsed/testing'
import { CustomerController } from './CustomerController'
import { Server } from '../Server'
import { CONNECTION, DBService } from '../services/DBService'
import { ExpressApplication } from '@tsed/common'
import * as SuperTest from 'supertest'
import * as assert from 'assert'

describe('customer crud', () => {

    let request: SuperTest.SuperTest<SuperTest.Test>;

    before(TestContext.bootstrap(Server))
    before(TestContext.inject([ ExpressApplication ], (app: ExpressApplication) => {
        request = SuperTest(app)
    }))
    after(TestContext.reset)

    it('list', TestContext.inject([ CONNECTION ], async (db: DBService) => {
        
        const customerCtrl: CustomerController = await TestContext.invoke(
            CustomerController,
            [{ token: CONNECTION, use: db }]
        )

        const customer = await customerCtrl.create({
            name: 'Vinicius',
            email: 'vfonseca@example.com',
            address: {
                street: "",
                city: "",
                number: "",
                postalCode: "",
                state: ""
            },
            password: ""
        })

        const { body: customers } = await request.get(`/customers`).expect(200)
        assert.equal(customers[0].name, customer['name'])
        
    }))

    it('create', TestContext.inject([ CONNECTION ], async (db: DBService) => {

        const { body } = await request.post('/customers').send({
            name: 'Vinicius',
            email: 'vfonseca1@example.com',
            address: {
                street: "",
                city: "",
                number: "",
                postalCode: "",
                state: ""
            },
            password: ""
        }).expect(200)

        const customer = await db.users.findByPk(body.id)
        assert(customer)

    }))

    it('update', TestContext.inject([ CONNECTION ], async (db: DBService) => {

        const customerCtrl: CustomerController = await TestContext.invoke(
            CustomerController,
            [{ token: CONNECTION, use: db }]
        )

        const customer = await customerCtrl.create({
            name: 'Vinicius',
            email: 'vfonseca2@example.com',
            address: {
                street: "",
                city: "",
                number: "",
                postalCode: "",
                state: ""
            },
            password: ""
        })

        const { body } = await request.put(`/customers/${customer['id']}`)
            .send({ name: 'Fulano' })
            .expect(200)
        
        assert.equal(body.name, 'Fulano')

    }))

    it('delete', TestContext.inject([ CONNECTION ], async (db: DBService) => {

        const customerCtrl: CustomerController = await TestContext.invoke(
            CustomerController,
            [{ token: CONNECTION, use: db }]
        )

        const customer = await customerCtrl.create({
            name: 'Vinicius',
            email: 'vfonseca3@example.com',
            address: {
                street: "",
                city: "",
                number: "",
                postalCode: "",
                state: ""
            },
            password: ""
        })

        await request.delete(`/customers/${customer['id']}`)
            .expect(200)

        const customerFromDB = await db.users.findByPk(customer['id'])
        assert(!customerFromDB)
    }))
})