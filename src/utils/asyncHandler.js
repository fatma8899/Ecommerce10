export const asynchandler = (fn) => {
    return async (req, res, next) => {
        fn(req, res, next).catch((err) => {
            next(err)
        })
    }
}




export const globalErrorHandling = (err, req, res, next) => {
    res.json({ msg: "error", err: err.message})
}