import { Controller, Get, Inject, Post, BodyParams, PathParams, Put, Delete, UseAuth, QueryParams } from "@tsed/common";
import { CONNECTION, DBService } from "../services/DBService";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { ApiError } from "../core/ApiError";

@Controller("/customers")
@UseAuth(AuthMiddleware, { role: "ADMIN" })
export class CustomerController {

    @Inject(CONNECTION)
    private db: DBService

    @Get()
    async list(
        @QueryParams('count') count: any,
        @QueryParams('page') page: any
    ) {
        
        count = +count || 10
        page = +page || 1

        const customers = await this.db.users.findAll({
            limit: count,
            offset: (page - 1) * count
        })
        return customers.map(c => c.toJSON())
    }

    @Get("/:id")
    async get(
        @PathParams('id') id: string
    ) {
        const customer = await this.db.users.findByPk(+id)
        if (!customer) { throw new ApiError(404, "not found") }
        return customer.toJSON()
    }

    @Post()
    async create(
        @BodyParams() { name, email, address }: Partial<App.Models.Customer>
    ) {
        const newCustomer = await this.db.users.create({
            name,
            email
        })
        const newAddress = await this.db.addresses.create({
            street: address.street,
            number: address.number,
            city: address.city,
            state: address.state,
            postal_code: address.postal_code
        })
        await newCustomer['setAddress'](newAddress)
        newCustomer['dataValues']['address'] = newAddress
        return newCustomer.toJSON()
    }

    @Put("/:id")
    async update(
        @PathParams('id') id: string,
        @BodyParams() { name, email, address }: Partial<App.Models.Customer>
    ) {
        const customer = await this.db.users.findByPk(+id)
        if (!customer) { throw new ApiError(404, "not found") }
        const cAddress = await customer['getAddress']()
        await Promise.all([
            customer.update({ name, email }),
            address && cAddress.update({
                street: address.street,
                number: address.number,
                city: address.city,
                state: address.state,
                postal_code: address.postal_code
            })
        ])
        customer['dataValues']['address'] = cAddress
        return customer.toJSON()
    }

    @Delete("/:id")
    async delete(
        @PathParams('id') id: string
    ) {
        const customer = await this.db.users.findByPk(id)
        if (!customer) { throw new ApiError(404, "not found") }
        const address = await customer['getAddress']()
        await Promise.all([
            customer.destroy(),
            address.destroy()
        ])
    }

}