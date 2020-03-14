import { Controller, Get, Post, BodyParams, Inject } from "@tsed/common";
import { CONNECTION, DBService } from "../services/DBService";
import { ApiError } from "../core/ApiError";
import { BCRYPT, BCryptHelper } from "../services/BCryptHelper";

@Controller("/")
export class RootController {

    @Inject(CONNECTION)
    private db: DBService

    @Inject(BCRYPT)
    private bcrypt: BCryptHelper

    @Get()
    status() { return "OK" }

    @Post("/login")
    async login() : Promise<{ token: string }> {
        return { token: "" }
    }

    @Post("/register")
    async register(
        @BodyParams() payload: {
            email: string,
            password: string,
            confirm_password: string
        }) : Promise<void> {
        
        if (payload.password !== payload.confirm_password) {
            throw new ApiError(400, 'passwords must match')
        }

        const user = await this.db.users.findOne({ where: { email: payload.email } })
        if (user) {
            throw new ApiError(400, 'email already registered')
        }

        const password = await this.bcrypt.hash(payload.password)

        await this.db.users.create({ email: payload.email, password })
    }
}