import { IMiddleware, Req, EndpointInfo, Request, Inject, Middleware } from "@tsed/common";
import { JWTHelper, JWT } from "../services/JWTHelper";
import { ApiError } from "../core/ApiError";
import { JWTPayload } from "../core/JWTPayload";
import { CONNECTION, DBService } from "../services/DBService";

@Middleware()
export class AuthMiddleware implements IMiddleware {

    @Inject(JWT)
    private jwt: JWTHelper

    @Inject(CONNECTION)
    private db: DBService

    public async use(@Req() request: Request, @EndpointInfo() endpoint: EndpointInfo) {

        const token = request.headers['authorization']
        const options = endpoint.get(AuthMiddleware) ?? {}

        try {
            const { id, expiry } = await this.jwt.decode<JWTPayload>(token)
            if (expiry < +new Date()) { throw "" }
            const user = await this.db.users.findByPk(id)
            if (!user) { throw "" }
            request['user'] = user
        }
        catch {
            throw new ApiError(401, "invalid or unavailable token")
        }

        if (request['user']['role'] !== options.role) {
            throw new ApiError(403, "access forbidden")
        }

    }
}