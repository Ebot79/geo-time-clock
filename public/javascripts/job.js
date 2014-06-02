/*jslint browser:true */
/*global $, jQuery, console*/
$(document).ready(function () {
    console.log('ready');

    var list = $('#jobs') 
        , i
        , button;
    //ajax
    console.log('looking for jobs');
    $.get('/getJobs', function (data) {
        console.log(data);
        var jobs = data;

        for (i = 0; i < jobs.length; i++){
            if (jobs[i] !== null) list.append(buildList(jobs[i]._id, jobs[i].name));
        }
    });

    function buildList(id, name) {
         button = '<button class = "job" data-id ="'+id+'" data-name ="'+name+'" >'+name+'</button>';
        
        return $(button);
    }
    
    $('#clockOut').on('click', clockOut(localStorage.jobId));
    
    list.on('click', 'button', function(){
        var jobData = {id: $(this).attr('data-id'), name: $(this).attr('data-name') ,time: new Date()} ;
        
        console.log(" name "+ jobData.name+ " id "+ jobData.id+ "time "+ jobData.time);
       
        if (localStorage.jobName !== jobData.name){
            //
            if (localStorage.jobName != null){
                
                var punchOut = confirm('Clock out of '+ localStorage.jobName +'?');
                if (punchOut==true){
                    console.log('punchingOut');
                    clockOut(localStorage.jobId);
                    setTimeout(clockIn(jobData.name, jobData.id ), 1000);
                }else{
                    event.preventDefault();
                }
            }else{
                clockIn(jobData.name, jobData.id);
            }
            
        }else{
            alert("You are already on this clock");        
        }  
    }); 
    
    function clockIn (name,id){
        console.log('clock in');
        var data = { id: id, in_out: 1 };
                    $.post("/addTime",data, function () {
                        alert("success");
                    }).done ( function () {
                        localStorage.setItem('jobName', name );
                        localStorage.setItem('id', id);
                    });
    };
    
    function clockOut (id) {
        console.log('clock out job ID: '+id);

        localStorage.removeItem('jobName');
        localStorage.removeItem('jobId');
        var data = { id: id, in_out: 0 };
        $.post("/addTime",data, function () {
            console.log("successful clock out");
           
        });
    };
    
});

