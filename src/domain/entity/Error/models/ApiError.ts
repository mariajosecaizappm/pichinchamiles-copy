import {ErrorCode, ErrorMetadataMap} from "@/domain/entity/Error/structure/error";

export class ApiError<C extends ErrorCode = ErrorCode> extends Error {
    readonly code: C
    readonly metadata?: ErrorMetadataMap[C]

    constructor(code: C, metadata?: ErrorMetadataMap[C], message?: string) {
        super(message ?? ErrorCode[code])
        this.code = code
        this.metadata = metadata

        Object.setPrototypeOf(this, new.target.prototype)
    }

    is<C extends ErrorCode>(code: C): this is ApiError<C> {
        return ErrorCode[this.code] === ErrorCode[code]
    }
}
