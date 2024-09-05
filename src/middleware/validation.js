const method= ["body","query","headers","params","file","files"]

const validation= (Schema) =>{
    return async (req,res,next)=>{
        const array=[]
        method.forEach((key)=>{
            if (Schema[key]){
                const {erorr}= Schema[key].validate(req[key],{abortEarly:false})
                if (erorr?.details)
                    erorr.details.forEach((err)=>{
                array.push(err.message)
                })
            }
        })
        if(array.length){
            return res.json({message: "validation error",errors:array})
        }
        next()
    }
}

export default validation