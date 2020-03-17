import { Controller, Get, Inject, QueryParams, Post, BodyParams, UseAuth, Put, PathParams, Delete } from "@tsed/common";
import { CONNECTION, DBService } from "../services/DBService";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { ApiError } from "../core/ApiError";

@Controller("/products")
@UseAuth(AuthMiddleware, { role: "ADMIN" })
export class ProductController {

    @Inject(CONNECTION)
    private db: DBService

    @Get()
    async list(
        @QueryParams('count') count: any,
        @QueryParams('page') page: any
    ) {

        count = +count || 10
        page = +page || 1

        const products = await this.db.products.findAll({
            limit: count,
            offset: (page - 1) * count
        })

        return products.map(p => p.toJSON())

    }

    @Post()
    async create(
        @BodyParams() { name, price, currency }: App.Models.Product
    ) {
        
        const product = await this.db.products.create({
            name, price, currency
        })

        return product.toJSON()
    }

    @Get("/:id")
    async getById(@PathParams('id') id: string) {

        const product = await this.db.products.findByPk(+id)
        if (!product) { throw new ApiError(404, 'not found') }
        return product.toJSON()
    }

    @Put("/:id")
    async update(
        @PathParams('id') id: string,
        @BodyParams() { name, price, currency }: Partial<App.Models.Product>
    ) {
        const product = await this.db.products.findByPk(+id)
        if (!product) { throw new ApiError(404, 'not found') }
        await product.update({ name, price, currency })
        return product.toJSON()
    }

    @Delete("/:id")
    async delete(@PathParams('id') id: string) {
        const product = await this.db.products.findByPk(+id)
        if (!product) { throw new ApiError(404, 'not found') }
        await product.destroy()
    }
}