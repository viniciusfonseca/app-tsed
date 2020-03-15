import { IMiddleware, Req, EndpointInfo, Request, Inject } from "@tsed/common";
import { JWTHelper, JWT } from "../services/JWTHelper";
import { ApiError } from "../core/ApiError";
import { JWTPayload } from "../core/JWTPayload";
import { CONNECTION, DBService } from "../services/DBService";

export class AuthMiddleware implements IMiddleware {

    @Inject(JWT)
    private jwt: JWTHelper

    @Inject(CONNECTION)
    private db: DBService

    public async use(@Req() request: Request, @EndpointInfo() endpoint: EndpointInfo) {

        const token = request.headers['authorization']

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

    }
}