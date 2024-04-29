/*The purpose of asyncHandler is to wrap around 
asynchronous route handlers (such as those used in Express.js)
 and automatically handle any errors that occur during their 
 execution. This helps to avoid repetitive error handling code
  in each route handler and promotes cleaner and more 
  maintainable code. */

const asyncHandler= (requestHandler) =>{
    return async (request, response, next)=>{
        try {
           await requestHandler(request,response, next)
            
        } catch (error) {

            response.status(error.code||500).json({
                success:false,
                message:error.message
            })
        }

    }
}
export default asyncHandler;