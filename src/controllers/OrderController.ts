import { Controller, Get, Inject } from "@tsed/common";
import { CONNECTION, DBService } from "../services/DBService";

@Controller("/orders")
export class OrderController {

    @Inject(CONNECTION)
    private db: DBService

    @Get()
    async list() {
        
    }

}