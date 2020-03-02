import { Injectable, Inject } from "@tsed/di";
import { connection } from "./DBConnection";

@Injectable()
export class DBService {
    constructor(@Inject(connection) connection: any) {
        
    }
}