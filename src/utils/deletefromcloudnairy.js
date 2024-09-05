import cloudinary from "./cloudnairy.js"


export const deletefromcloudinary = async (req, res , next ) =>{
    if (req?.filepath) {
        await cloudinary.api.delete_resources_by_prefix(req.filepath)
        await cloudinary.api.delete_folder(req.filepath)
        next()
        
    }
}