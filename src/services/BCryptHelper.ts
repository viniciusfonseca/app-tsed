import * as bcrypt from 'bcrypt'
import { registerProvider } from '@tsed/di'

export const BCRYPT = Symbol.for("BCRYPT")

export class BCryptHelper {

    salt: string

    async init(saltRounds: number) {
        this.salt = await bcrypt.genSalt(saltRounds)
    }

    hash(password) {
        return bcrypt.hash(password, this.salt)
    }

    verify(password, storedPassword) {
        return bcrypt.compare(password, storedPassword)
    }
}

registerProvider({
    provide: BCRYPT,
    async useAsyncFactory() {
        const bcryptHelper = new BCryptHelper()
        await bcryptHelper.init(10)
        return bcryptHelper
    }
})