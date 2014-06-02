
/*
 * GET users listing.
 */

exports.login = function(req, res){
  db.open(function(err, db) {
    if(!err){
        db.collection('userdata', function(err, collection) {
            collection.insert(user);
            db.close();
        });//end db collection
    }//end if no error db open
    else{
    console.log(err);
    }
    });//end connect db	
};
