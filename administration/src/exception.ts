
type PDFGenerationError = {
    type: "pdf-generation"
}

type PDFUnexpectedUnicodeError = {
    type: "unicode"
    unsupportedChar: string
}

type ErrorData = {
    message?: string
} & (PDFGenerationError | PDFUnexpectedUnicodeError)


export class Exception extends Error {
    public data: ErrorData;
    
    constructor(error: ErrorData) {
        super()
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, Exception)
        }

        this.name = 'Exception'
        this.data = error
    }
}
