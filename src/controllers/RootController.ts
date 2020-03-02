import { Controller, Get, Post } from "@tsed/common";

@Controller("/")
export class RootController {

    @Get()
    status() { return "OK" }

    @Post("/login")
    async login() : Promise<any> {

    }
}