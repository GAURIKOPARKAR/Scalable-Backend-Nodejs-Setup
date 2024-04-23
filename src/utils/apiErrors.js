class apiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        errors=[],
        stack=""
    ){
        super(message)
        this.data=data
        this.statusCode=statusCode
        this.errors=errors
        this.message=message
        this.success=false
        if(stack)
        {
            this.stack=stack
        }
        else
        {
           Error.captureStackTrace(this, this.constructor)
        }
    }
}
export default apiError