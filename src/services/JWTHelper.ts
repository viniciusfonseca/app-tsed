import * as jwt from 'jsonwebtoken'
import { registerProvider } from '@tsed/di'

export const JWT = Symbol.for("JWT")

export class JWTHelper {

    private key = "APP_TSED_KEY"

    sign(payload: string | object) : Promise<string> {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, this.key, (err, token) =>
                err ? reject(err) : resolve(token)
            )
        })
    }

    decode<T = object>(payload: string) : Promise<T> {
        return new Promise((resolve, reject) => {
            jwt.verify(payload, this.key, (err, decoded: unknown) =>
                err ? reject(err) : resolve(decoded as T)
            )
        })
    }
}

registerProvider({
    provide: JWT,
    useFactory() {
        return new JWTHelper()
    }
})