
const executeQuery=(query,object)=>{
    return new Promise((resolve,reject)=>{
        if(query && object){
            object.query(query, function (err, result) {
                if (err) {
                    let error = [];
                    error.push(err);
                    reject(error);
                }
                else {
                    resolve(result);
                }
              });
        }
    })
  
}

module.exports = { executeQuery };