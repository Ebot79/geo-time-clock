//routes/index.js
//requires
var  qs = require('querystring')
    ,http = require('http');


    /**
 * Set up application.
 */


//index
exports.index = function(req, res, next){
    res.render('index');
}

exports.signUp = function(req, res, next){
  res.render('signUp');
}

//security
exports.secure = function(req,res,next){
    if(req.session.loggedIn){
        next();
    }else{
        res.redirect('index');//not authorized
    }
}

//login processing route
exports.logIn = function(req, res, next){
    console.log('log in request from '+req.body.name);
    User.findOne({name:req.body.name}, function(err, user, next){

        if(err) return next(err);
        if(!user) return res.end();

//check password
        user.comparePassword(req.body.password, function(err, isMatch){
            if(err) res.send('failed to find user');
            console.log(""+isMatch);
            if(isMatch){
                console.log(user._id.toString()+' user loggd in');
                //set session cookie
                req.session.loggedIn = user._id.toString();
                console.log('after login req.session.loggedIn set to :'+req.session.loggedIn );
                 res.send(user);

            }else {
               res.send('User not found try again');
            }

        });
    });

    }
//POST new user
exports.addUser = function(req, res, next){
    console.log('addUser POST route');
    console.log( req.body.user);

    }


//logout route
exports.signOut = function(req, res, next){
    console.log('signOut route session data will be lost session variable:'+req.session.loggedIn );
    req.session.loggedIn = null;
    res.end();
    }

//GET open jobs
exports.getJobs = function(req, res, next){
    console.log('get jobs')
    console.log('getjobs session variable:'+req.session.loggedIn)
  connection.query('Select * FROM jobs', function(err, rows, fields){
    if(!err){
        console.log(rows);
        res.send(rows);

    }else consol.log(err);
        res.end();
  });
}

//add a job to queue
exports.newJob = function(req, res, next){

     connection.query('INSERT INTO jobs VALUES ( '+req.body.id+
                                                ','+req.body.name
                                                +','+ req.body.street_number
                                                +','+req.body.street
                                                +','+req.body.city
                                                +','+req.body.state
                                                +','+req.body.zip
                                                +','+req.body.floor
                                                +','+req.body.room+')', function (err, info){
        if (err) console.log(err);
        console.log(' - job created -- ');
        });
  app.jobs.insert(req.body.job, function(err, doc){
    if(err) console.log(err);
    res.redirect('/jobs');
  });
}

//clockIn
exports.clockIn = function(req, res, next){
    console.log('clocking in '+req.session.loggedIn);

    connection.query('INSERT INTO job_times VALUES (DEFAULT,"'+req.body.appUser+'","'+ req.body.job_id+'",'+ req.body.time+', NULL, NULL,NULL)'
        , function (err, info){
            if (err) {console.log(err);
                res.writeHead(503, { "Content-Type": "text/plain" });
                res.end();
            }else
            console.log(' --clock_in complete \n');
                res.end();
            });

}

//clockOut
exports.clockOut = function(req, res, next){
    console.log('clocking out session variable '+ req.session.loggedIn);

    connection.query('UPDATE job_times SET  out_time = ? WHERE ID = ?', [ req.body.time, req.body.jobId]
                    ,function(err, info){
                        if(err){
                            res.writeHead(503, { "Content-Type": "text/plain" });
                            res.end();
                            next(err);
                        }else{
                            console.log('clocked out clock out is being called'+ info);
                            res.send(info);
                            res.end();
                        }
                    });


}
// clock status
exports.clockStatus = function(req, res, next){
    console.log('clock status user id=' +req.body.id);
    console.log('Status route, session variable '+req.session.loggedIn);
    if (req.body.id&& !req.session.loggedIn || req.session.loggedIn=='undefined'){
        req.session.loggedIn =req.body.id;
    }
    if(req.session.loggedIn){
       var sql = 'SELECT * FROM job_times'
            , data;
        console.log('making query "SELECT * FROM job_times"');
        connection.query(sql, function(err, rows){
            if (err) {
                console.log(err);
                res.writeHead(503, { "Content-Type": "text/plain" });
                res.end();
            }
            console.log('rows returned '+rows.length);
            if (rows.length<1){ //new user no rows in db
                console.log('No rows returned. You are clocked out');
                data = {'rows': []};
                res.send(data); //clocked out
            }else if(!rows[0].out_time){ //out_time is null user is clocked in!!
                console.log('rows returned with clockout null clocked in @'+rows[0].in_time);
                data = {"rows":rows};
                res.send(data); //send back clock info for timer and job


            }else{                  //else clocked out.
                console.log('status clocked out row returned '+ rows[0].out_time);
                data = {rows: []};
                res.send(data);

            }
        });
    }else{                  //else clocked out.
                console.log('no Id clocked out');

                res.send({in_time: 'never'});

    }

}
