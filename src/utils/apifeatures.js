export class apifeatures{
    constructor(mongooseQuery,Querystring){
        this.mongooseQuery = mongooseQuery;
        this.Querystring = Querystring;
    }
    
    pagination(){
        let page = this.Querystring.page * 1 || 1
        if (page < 1) {
            page = 1
            
        }
        let limit = 2
        let skip = (page - 1) * limit
        this.mongooseQuery.find().skip(skip).limit(limit)
        this.page = page
        return this
    }
    filter(){
        let cutQuery = ["page", "sort", "select", "search"]
        let filter = {...this.Querystring}
        cutQuery.forEach(e => delete filter [e])
        filter = JSON.parse(JSON.stringify(filter).replace(/(gt|lt|gte|lte|eq)/,(match)=>`$${match}`))
        this.mongooseQuery.find(filter)
        return this
    }
    sort(){
        if (this.Querystring.sort){
            this.mongooseQuery.sort(this.Querystring.sort.replaceAll(",",""))
        }
        return this
    }
    select(){
        if (this.Querystring.select){
            this.mongooseQuery.select(this.Querystring.select.replaceAll(",",""))
            }
            return this
}
    search() {
        if (this.Querystring.search) {
            this.mongooseQuery.find({
                $or: [
                    { title: { $regex: this.Querystring.search, $options: 'i' }},
                    {description:{$regex: this.Querystring.search, $options:"i"}},
                ]
            })
    }
    return this
}
}
