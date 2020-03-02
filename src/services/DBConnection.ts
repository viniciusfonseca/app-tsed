import { registerProvider, Configuration } from "@tsed/di"

export const connection = Symbol.for("CONNECTION")

registerProvider({
    provide: connection,
    deps: [Configuration],
    async useAsyncFactory(settings: Configuration) {
        
    }
})