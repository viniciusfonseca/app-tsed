import { Controller, Get } from "@tsed/common";

@Controller("/customers")
export class CustomerController {

    @Get()
    async get(): Promise<App.Models.Customer[]> {
        return [];
    }


}