import * as SuperTest from 'supertest'
import { TestContext } from '@tsed/testing';
import { Server } from '../Server';
import { ExpressApplication } from '@tsed/common';
import { CONNECTION, DBService } from '../services/DBService';
import { BCRYPT, BCryptHelper } from '../services/BCryptHelper';
import { JWT, JWTHelper } from '../services/JWTHelper';
import { createAdminToken } from '../tests/createAdminToken';
import { ProductController } from './ProductController';
import { assert } from 'chai';

describe('product crud', () => {

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

        const productCtrl: ProductController = await TestContext.invoke(
            ProductController,
            [{ token: CONNECTION, use: db }]
        )

        await productCtrl.create({
            name: 'PRODUCT 0',
            price: 1000,
            currency: 'BRL'
        })

        const { body: products } = await request.get(`/products`)
            .set({ Authorization })
            .expect(200)

        assert(Array.isArray(products))
        assert(products.find(({ name }) => name === 'PRODUCT 0'))

    }))

    it('create', TestContext.inject([ CONNECTION ], async (db: DBService) => {

        const { body: product } = await request.post(`/products`)
            .send({
                name: 'PRODUCT 1',
                price: 1000,
                currency: 'BRL'
            })
            .set({ Authorization })
            .expect(200)

        const newProduct = await db.products.findByPk(product.id)
        assert(newProduct)
    }))


    it('get by id', TestContext.inject([ CONNECTION ], async (db: DBService) => {

        const productCtrl: ProductController = await TestContext.invoke(
            ProductController,
            [{ token: CONNECTION, use: db }]
        )

        const product = await productCtrl.create({
            name: 'PRODUCT 2',
            price: 1000,
            currency: 'BRL'
        })

        const { body: newProduct } = await request.get(`/products/${product['id']}`)
            .set({ Authorization })
            .expect(200)

        assert(newProduct)

    }))

    it('update', TestContext.inject([ CONNECTION ], async (db: DBService) => {

        
    }))

    it('delete', TestContext.inject([ CONNECTION ], async (db: DBService) => {

    }))

})