import { Controller, Get, Inject, Post, BodyParams, PathParams, Put, Delete } from "@tsed/common";
import { CONNECTION, DBService } from "../services/DBService";

@Controller("/customers")
export class CustomerController {

    @Inject(CONNECTION)
    private db: DBService

    @Get()
    async list() {
        const customers = await this.db.users.findAll({})
        return customers
    }

    @Get("/:id")
    async get(
        @PathParams('id') id: string
    ) {
        const customer = await this.db.users.findByPk(+id)
        return customer
    }

    @Post()
    async create(
        @BodyParams() { name, email }: App.Models.Customer
    ) {
        const newCustomer = await this.db.users.create({ name, email })
        return newCustomer
    }

    @Put("/:id")
    async update(
        @PathParams('id') id: string,
        @BodyParams() { name, email }: Partial<App.Models.Customer>
    ) {
        const customer = await this.db.users.findByPk(+id)
        await customer.update({ name, email })
        return customer
    }

    @Delete("/:id")
    async delete(
        @PathParams('id') id: string
    ) {
        await this.db.users.destroy({ where: { id: +id } })
    }

}