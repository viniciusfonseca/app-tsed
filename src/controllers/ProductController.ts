import { Controller, Get, Inject, QueryParams, Post, BodyParams } from "@tsed/common";
import { CONNECTION, DBService } from "../services/DBService";

@Controller("/products")
export class ProductController {

    @Inject(CONNECTION)
    private db: DBService

    @Get()
    async list(
        @QueryParams('count') count: any,
        @QueryParams('page') page: any
    ) {



    }

    @Post()
    async create(
        @BodyParams() product
    ) {
        
    }
}