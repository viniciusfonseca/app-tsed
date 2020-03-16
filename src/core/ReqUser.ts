import { IFilter, ParseService, UseFilter, ParamTypes, IParamOptions } from "@tsed/common";

export class ReqUserFilter implements IFilter {

    constructor(private parseService: ParseService) {}

    transform(expression: string, request: Express.Request, response: Express.Response) {
        return this.parseService.eval(expression, request)
    }

}

export function ReqUser(options: IParamOptions<any> = {}) : ParameterDecorator {

    const { useType, useConverter = true, useValidation = true } = options

    return UseFilter(ReqUserFilter, {
        expression: 'user',
        paramType: ParamTypes.REQUEST,
        useType,
        useConverter,
        useValidation
    })
}