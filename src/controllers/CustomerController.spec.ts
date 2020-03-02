import { describe, it } from 'mocha'
import { TestContext} from '@tsed/testing'
import { CustomerController } from './CustomerController'
import { Server } from '../Server'
import { CONNECTION, DBService } from '../services/DBService'

describe('customer crud', () => {

    before(TestContext.bootstrap(Server))
    before(TestContext.inject([ CONNECTION ], (db: DBService) => db.init()))
    after(TestContext.reset)

    it('list', async () => {
        const customerCtrl: CustomerController = await TestContext.invoke(CustomerController, [])

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

        
    })
})