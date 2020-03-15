import { Controller, Get, Post, BodyParams, Inject } from "@tsed/common";
import { CONNECTION, DBService } from "../services/DBService";
import { ApiError } from "../core/ApiError";
import { BCRYPT, BCryptHelper } from "../services/BCryptHelper";
import { JWTHelper, JWT } from "../services/JWTHelper";

@Controller("/")
export class RootController {

    @Inject(CONNECTION)
    private db: DBService

    @Inject(BCRYPT)
    private bcrypt: BCryptHelper

    @Inject(JWT)
    private jwt: JWTHelper

    @Get()
    status() { return "OK" }

    @Post("/login")
    async login(
        @BodyParams() payload: {
            email: string,
            password: string
        }) : Promise<{ token: string }> {

        const user = await this.db.users.findOne({
            where: { email: payload.email }
        })
        if (!user) { throw new ApiError(401, "invalid email or password") }
        
        const hashedPassword = await this.bcrypt.hash(payload.password)
        try {
            await this.bcrypt.verify(hashedPassword, user['password'])
            const token = await this.jwt.sign({
                id: user['id'],
                expiry: +new Date() + 3 * 60 * 60 * 1000
            })
            return { token }
        }
        catch { throw new ApiError(401, "invalid email or password") }

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