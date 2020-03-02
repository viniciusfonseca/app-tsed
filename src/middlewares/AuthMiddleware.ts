import { IMiddleware, Req, EndpointInfo, Request } from "@tsed/common";

export class AuthMiddleware implements IMiddleware {

    public use(@Req() request: Request, @EndpointInfo() endpoint: EndpointInfo) {

        const token = request.headers['authorization']

        
    }
}