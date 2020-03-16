import { describe, it } from 'mocha'
import { TestContext} from '@tsed/testing'
import { CustomerController } from './CustomerController'
import { Server } from '../Server'
import { CONNECTION, DBService } from '../services/DBService'
import { ExpressApplication } from '@tsed/common'
import * as SuperTest from 'supertest'
import * as assert from 'assert'
import { BCRYPT, BCryptHelper } from '../services/BCryptHelper'
import { RootController } from './RootController'
import { JWT, JWTHelper } from '../services/JWTHelper'
import { createAdminToken } from '../tests/createAdminToken'

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
        
        const customerCtrl: CustomerController = await TestContext.invoke(
            CustomerController,
            [{ token: CONNECTION, use: db }]
        )

        await customerCtrl.create({
            name: 'Vinicius',
            email: 'vfonseca@example.com',
            address: {
                street: "",
                city: "",
                number: "",
                postal_code: "",
                state: ""
            },
            password: ""
        })

        const { body: customers } = await request.get(`/customers`)
            .set({ Authorization })
            .expect(200)

        assert(Array.isArray(customers))
        assert(customers.find(({ email }) => email === 'vfonseca@example.com'))
    }))

    it('create', TestContext.inject([ CONNECTION ], async (db: DBService) => {

        const { body } = await request.post('/customers')
            .send({
                name: 'Vinicius',
                email: 'vfonseca1@example.com',
                address: {
                    street: "Sample Street",
                    city: "Foobar city",
                    number: "1222",
                    postal_code: "111",
                    state: ""
                },
                password: ""
            })
            .set({ Authorization })
            .expect(200)

        const customer = await db.users.findByPk(body.id)
        const address = await customer['getAddress']()
        assert(customer)
        assert.equal(address.street, "Sample Street")
        assert.equal(address.city, "Foobar city")
        assert.equal(address.number, "1222")
        assert.equal(address.postal_code, "111")
        assert.equal(address.state, "")

    }))

    it('get by id', TestContext.inject([ CONNECTION ], async (db: DBService) => {

        const customerCtrl: CustomerController = await TestContext.invoke(
            CustomerController,
            [{ token: CONNECTION, use: db }]
        )

        const customer = await customerCtrl.create({
            name: 'Vinicius',
            email: 'vfonseca4@example.com',
            address: {
                street: "",
                city: "",
                number: "",
                postal_code: "",
                state: ""
            },
            password: ""
        })

        const { body } = await request.get(`/customers/${customer['id']}`)
            .set({ Authorization })
            .expect(200)

        assert(body.id)
    }))

    describe('update suite', () => {

        it('update simple', TestContext.inject([ CONNECTION ], async (db: DBService) => {
    
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
                    postal_code: "",
                    state: ""
                },
                password: ""
            })
    
            const { body } = await request.put(`/customers/${customer['id']}`)
                .send({ name: 'Fulano' })
                .set({ Authorization })
                .expect(200)
            
            assert.equal(body.name, 'Fulano')
    
        }))

        it('update address', TestContext.inject([ CONNECTION ], async (db: DBService) => {

            const customerCtrl: CustomerController = await TestContext.invoke(
                CustomerController,
                [{ token: CONNECTION, use: db }]
            )
    
            const customer = await customerCtrl.create({
                name: 'Vinicius',
                email: 'vfonseca5@example.com',
                address: {
                    street: "",
                    city: "",
                    number: "",
                    postal_code: "",
                    state: ""
                },
                password: ""
            })

            const { body } = await request.put(`/customers/${customer['id']}`)
                .send({
                    address: {
                        street: "Sample Street",
                        city: "Foo City",
                        number: "1234"
                    }
                })
                .set({ Authorization })
                .expect(200)

            assert.equal(body.address.street, "Sample Street")
            assert.equal(body.address.city, "Foo City")
            assert.equal(body.address.number, "1234")
        }))
    })


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
                postal_code: "",
                state: ""
            },
            password: ""
        })

        await request.delete(`/customers/${customer['id']}`)
            .set({ Authorization })
            .expect(200)

        const customerFromDB = await db.users.findByPk(customer['id'])
        assert(!customerFromDB)
        const addressFromDB = await db.addresses.findByPk(customer['address']['id'])
        assert(!addressFromDB)
    }))
})