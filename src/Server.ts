import { GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings, OnInit } from "@tsed/common";
import * as bodyParser from "body-parser";
import * as compress from "compression";
import * as cookieParser from "cookie-parser";
import * as methodOverride from "method-override";

const rootDir = __dirname;

@ServerSettings({
    rootDir,
    mount: {
        "/": `${rootDir}/controllers/**/*.ts`
    },
    acceptMimes: ["application/json"]
})
export class Server extends ServerLoader {

    public $beforeRoutesInit() {
        this.use(GlobalAcceptMimesMiddleware)
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }));
    }
}