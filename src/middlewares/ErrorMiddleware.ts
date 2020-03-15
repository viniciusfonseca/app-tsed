import { Middleware, Err, Res, Response } from "@tsed/common";
import { ApiError } from "../core/ApiError";

@Middleware()
export class ErrorMiddleware {

    use(@Err() error: any, @Res() response: Response) {

        if (error instanceof ApiError) {
            response.status(error.status ?? 500).send(error.message ?? "")
            return
        }
    }
}