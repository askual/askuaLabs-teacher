var express = require('express');
var app = express();
var hbs = require('hbs');
var Datastore = require('nedb');
var fs = require('fs');
var fileUpload = require('express-fileupload');
app.use(fileUpload());

app.locals.title = 'AskuaLabs';


//treat html files as hbs files
app.set('view engine', 'html');
app.engine('html', hbs.__express);

app.use(express.static('public'));

//partials
hbs.registerPartials(__dirname + '/views/partials' );
//hbs helpers
hbs.registerHelper('json', function (content) {
    return JSON.stringify(content);
});

//connection to the simulations collection
var simulation = new Datastore({ filename: 'db/simulation.db', autoload: true });
simulation.loadDatabase();
//connection to the subjects collection
var subject = new Datastore({ filename: 'db/subject.db', autoload: true });
subject.loadDatabase();
//connection to the teachers collection
var teacher = new Datastore({ filename: 'db/teacher.db', autoload: true });
teacher.loadDatabase();
//connection to the sessions collection
var sessions = new Datastore({ filename: 'db/sessions.db', autoload: true });
sessions.loadDatabase();
//connection to the Quiz collection
var quiz = new Datastore({ filename: 'db/quiz.db', autoload: true });
quiz.loadDatabase();
//connection to the QuizAnswer  collection
var quizAns = new Datastore({ filename: 'db/quizAns.db', autoload: true });
quizAns.loadDatabase();










app.get('/', function (req, res) {
    res.render('index',{class:"user-view-hm",welcome:"AskuaLabs Instructor"});
});
app.get('/index.html', function (req, res) {
    res.render('index',{class:"user-view-hm",welcome:"AskuaLabs Instructor"});
});


app.get('/explore', function (req, res) {
    simulation.find({}, function (err, doc) {
        res.render('explore',{
            data:doc,class:"user-view-hm",welcome:"Explore"
        });
    });
});
app.get('/9phy', function (req, res) {
    var sim;
    simulation.find({ grade: "9", subject: "physics"}, function (err, doc) {
        sim = doc;
        subject.find({grade: "9", name: "physics"}, function (err, docs) {
            console.log("ddd",docs,sim);
            res.render('subj',{
                data:docs,sims:sim,class:"user-view-g9p",welcome:"Grade 9 Physics",selectClass:"phybg",
                simss : encodeURIComponent(JSON.stringify(sim))
            });
        })
    });
});
app.get('/9che', function (req, res) {
    var sim;
    simulation.find({ grade: "9", subject: "chemistry"}, function (err, doc) {
        sim = doc;
        subject.find({grade: "9", name: "chemistry"}, function (err, docs) {
            console.log("ddd",docs,sim);
            res.render('subj',{
                data:docs,sims:sim,class:"user-view-g9c",welcome:"Grade 9 Chemistry",selectClass:"chmbg",
                simss : encodeURIComponent(JSON.stringify(sim))
            });
        })
    });
});
app.get('/9bio', function (req, res) {
    var sim;
    simulation.find({ grade: "9", subject: "biology"}, function (err, doc) {
        sim = doc;
        subject.find({grade: "9", name: "biology"}, function (err, docs) {
            console.log("ddd",docs,sim);
            res.render('subj',{
                data:docs,sims:sim,class:"user-view-g9b",welcome:"Grade 9 Biology",selectClass:"biobg",
                simss : encodeURIComponent(JSON.stringify(sim))
            });
        })
    });
});

app.get('/sim:sim_id', function(req, res, next) {
    var sim_id = req.params.sim_id;
    sim_id = sim_id.slice(1, sim_id.length);
    simulation.find({_id:sim_id}, function (err, docs) {
          res.render('simulation',{data:docs,parent:sim_id,class:"user-view-hm",welcome:"",});
      });
  });

// gotosim
app.get('/real:sim_id', function(req, res, next) {
    var sim_id = req.params.sim_id;
    sim_id = sim_id.slice(1, sim_id.length)+".js";
    res.render('real',{link:sim_id});
});

app.get('/help', function (req, res) {
    res.render('help',{class:"user-view-hm",welcome:"Help"});
});
app.get('/about', function (req, res) {
    res.render('about',{class:"user-view-hm",welcome:"About"});
});




///////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/upload', function(req, res) {

    });


app.get('/login', function (req, res) {
    res.render('login');
});
app.get('/loginS', function (req, res) {
    var response = {
        name:req.query.name,
        email:req.query.email,
        password:req.query.password,
        quiz:[]
        };
    teacher.find({ email: response.email}, function (err, doc) {
        if(doc.length==0){
            //correct
            teacher.insert(response, function (err, newDoc) {
                teacher.find({ email: response.email}, function (err, docx) {
                    var teacher_id = {
                        "id": docx[0]._id
                    }
                    console.log("hehe",teacher_id.id);
                    //correct
                    sessions.insert(teacher_id, function (err, newDoc) {
                        res.render("teacher_x");
                    });
                });
            });
        }else{
            //nope
            res.send("Email already taken");
        }
    });
});
app.get('/loginL', function (req, res) {
    var response = {
        email:req.query.email,
        password:req.query.password
    };
    teacher.find({ email: response.email, password: response.password}, function (err, doc) {
        if(doc.length==0){
            //nope
            res.send("Please create account");

        }else{
            var teacher_id = {
                "id": doc[0]._id
            }
            //correct
            sessions.insert(teacher_id, function (err, newDoc) {
                res.render("teacher_x");
            });
        }
    });
});

app.get('/loginP', function (req, res) {
    response = {
        grade:req.query.grade,
        rollno:req.query.rollno,
        section:req.query.section,
        password:req.query.password
        };
    users.find({ grade: response.grade , rollno: response.rollno, section:response.section}, function (err, doc) {
        if(doc.length==0){
            res.send("Please Sign Up");
        }else if(doc[0].password!=response.password){
            res.send("Wrong Password");
        }else{
            res.send("Correct");
            console.log(doc);
        }
    });

})

app.get('/teacher_quiz', function (req, res) {
    sessions.find({}, function (err, doc) {
        var t_id = doc[doc.length-1].id;
        teacher.find({ _id: t_id}, function (err, tt) {
            quiz.find({ by: t_id}, function (err, docs) {
                res.render('teacher_quiz',{data:docs,teacher:tt[0]});
            });
        });
    });
});
app.get('/teacher_quizP', function (req, res,next) {
    console.log("Marlalade",req.query);
    var thisIsIt ={};
    thisIsIt.title = req.query.title;
    thisIsIt.timeAllowed = req.query.timeAllowed;
    thisIsIt.questions = [];
    thisIsIt.answers = [];
    for(var i=0;i<parseInt(req.query.total);i++){
        eval("var q = req.query.q"+(i+1)+";");
        eval("var a = req.query.q"+(i+1)+"a;");
        eval("var b = req.query.q"+(i+1)+"b;");
        eval("var c = req.query.q"+(i+1)+"c;");
        eval("var d = req.query.q"+(i+1)+"d;");
        var x = {"Q":q,"A":a,"B":b,"C":c,"D":d};
        thisIsIt.questions.push(x);
    }
    var v = req.query.answers;
    for(var i=0;i<v.length;i++){
        if(v[i]!=","){
            thisIsIt.answers.push(v[i]);
        }
    }

    sessions.find({}, function (err, doc) {
        var t_id = doc[doc.length-1].id;
        thisIsIt.by = t_id;
        quiz.insert(thisIsIt, function (err, docs) {
            var v = docs._id+".json";
            fs.openSync(__dirname + "/public/quiz/"+v, 'w');
            fs.writeFile(__dirname + "/public/quiz/"+v, JSON.stringify(thisIsIt), (err) => {
                if (err) throw err;
                console.log('Data saved!');
                //next();
                res.send("Data Saved");
            });
        });
    });
    /*
    db.remove({ _id: 'id2' }, {}, function (err, numRemoved) {
    // numRemoved = 1
    });
    */


});
app.get('/deleteQuiz:quiz_id', function(req, res) {
    console.log("yea!!");
    var quiz_id = req.params.quiz_id;
    quiz_id = quiz_id.slice(1, quiz_id.length);
    quiz.remove({_id:quiz_id}, function (err, numRemoved) {
        fs.unlink(__dirname + "/public/quiz/"+quiz_id+".json", (err) => {
            if (err) throw err;
            console.log('Data Deleted!');
            res.send("Data Deleted");
        });
    });
  });
app.get('/downloadQuiz:quiz_id', function(req, res) {
    //console.log("yea!!");
    var quiz_id = req.params.quiz_id;
    var file = __dirname+ "/public/quiz/" + quiz_id.slice(1, quiz_id.length)+".json";
    res.download(file);

  });
app.get('/analysisQuiz:quiz_id', function(req, res) {
    var quiz_id = req.params.quiz_id.slice(1, req.params.quiz_id.length);
    var filepath = __dirname+ "/public/quiz/" + quiz_id+".json";
    var encoding = 'utf8';
    var file = fs.readFileSync(filepath,encoding);
    var final = JSON.parse(file);

    var answers = final.answers;

    console.log(final.answers);


    sessions.find({}, function (err, docs) {
        var t_id = docs[docs.length-1].id;
        teacher.find({ _id: t_id}, function (err, tt) {
            quizAns.find({qid:quiz_id}, function (err, doc) {
                console.log(doc,"doc");
                res.render("analysisQuiz",{answers:answers,title:final.title,data:doc,teacher:tt[0]});
            });
        });
    });
  });

  app.post('/analysis_quiz_upload', function(req, res) {
      //if (!req.files)
          //return res.status(400).send('No files were uploaded.');
          console.log("????");
          res.send("heyyy"+req.file.name);

      /*var d = __dirname+'/public/temp/h.json';
      var sampleFile = req.files.sampleFile;
      sampleFile.mv(d, function(err) {
        if (err)
          return res.status(500).send(err);
        fs.readFile(d, (err, data) => {
            if (err) throw err;
            var v = JSON.parse(data.toString());
            quiz.insert(v, function (err, Doc) {
              console.log(v.title);
              res.send(v.title);
            });
          });
      });
      */
    });








app.get('/isubject9', function (req, res) {
    var ans = req.query.ans;
    var an = JSON.parse(ans);
    var response = {
        "qid" : an.qid,
        "student": an.student,
        "answer": an.answer
    }
    quiz.find({_id:response.qid}, function (err, doc) {
        var v = doc[0].answers;
        var vv = {
            "correct" : 0,
            "wrong" : 0,
            "unanswered" : 0
        }
        for(var i=0;i<v.length;i++){
            if(response.answer[i]==""){
                vv.unanswered++;
            }else if(response.answer[i]==v[i]){
                vv.correct++;
            }else {
                vv.wrong++;
            }
        }
        response.result = vv;
        quizAns.insert(response, function (err, docs) {
            res.send("yeap!!");
        });
    });

 });





































app.get('/q', function (req, res) {
    res.render('question');
});
app.get('/qq', function (req, res) {
    response = {
        name:req.query.name,
        grade:req.query.grade,
        rollno:req.query.rollno,
        section:req.query.section,
        password:req.query.password
     };
});


app.get('/signup', function (req, res) {
    res.render('signup');
});
app.get('/signupP', function (req, res) {
    response = {
        name:req.query.name,
        grade:req.query.grade,
        rollno:req.query.rollno,
        section:req.query.section,
        password:req.query.password
     };
    users.find({ grade: response.grade, rollno: response.rollno, section:response.section}, function (err, doc) {
        if(doc.length>0){
            console.log("What???");
            res.end(JSON.stringify(response));
        }else{
            users.insert(response, function (err, newDoc) {
            });
            res.end(JSON.stringify(response));
        }
    });

});














app.get('/process_get', function (req, res) {
    response = {
       first_name:req.query.first_name,
       last_name:req.query.last_name
    };
    users.insert(response, function (err, newDoc) {
     });

    res.end(JSON.stringify(response));
 });


app.get('/insert', function (req, res) {
    res.render('insert');
    //fs.openSync(__dirname + "/public/sims/hello.html", 'w');
    /*
    let lyrics = 'But still I\'m having memories of high speeds when the cops crashed\n' +
    'As I laugh, pushin the gas while my Glocks blast\n' +
    'We was young and we was dumb but we had heart';

    // write to a new file named 2pac.txt
    fs.writeFile('2pac.txt', lyrics, (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log('Lyric saved!');
    });
    */
});
app.get('/isubject3', function (req, res) {
    response = {
        title:req.query.title,
        grade:req.query.grade,
        subject:req.query.subject,
        unit:req.query.unit,
        pic:req.query.pic,
        description:req.query.description,
        theory:req.query.theory,
        isbuiltin:true
     };
     //res.end(JSON.stringify(response));
    simulation.insert(response, function (err, newDoc) {
    });
 });
 app.get('/isubject2', function (req, res) {
    response1 = {
        name:req.query.name,
        grade:req.query.grade
     };
     response2 = {
        unit:req.query.unit,
        title:req.query.title
     };

    subject.update({ name: response1.name ,grade: response1.grade}, { $push: { units: response2 } }, {}, function () {
        // Now the fruits array is ['apple', 'orange', 'pear', 'banana']
      });
 });
 app.get('/isubject', function (req, res) {
    response = {
       name:req.query.name,
       grade:req.query.grade
    };
    subject.insert(response, function (err, newDoc) {
     });
 });
 app.get('/isubject7', function (req, res) {
    var v = "hell.js";
    fs.openSync(__dirname + "/public/sims/"+v, 'w');
    response = {
       sim:req.query.sim
    };

    fs.writeFile(__dirname + "/public/sims/"+v, response.sim, (err) => {
        if (err) throw err;
        console.log('Lyric saved!');
    });
 });






















var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)

})















/*
var express = require('express');
var app = express();

// This responds with "Hello World" on the homepage
app.get('/', function (req, res) {
   console.log("Got a GET request for the homepage");
   res.send('Hello GET');
})

// This responds a POST request for the homepage
app.post('/', function (req, res) {
   console.log("Got a POST request for the homepage");
   res.send('Hello POST');
})

// This responds a DELETE request for the /del_user page.
app.delete('/del_user', function (req, res) {
   console.log("Got a DELETE request for /del_user");
   res.send('Hello DELETE');
})

// This responds a GET request for the /list_user page.
app.get('/list_user', function (req, res) {
   console.log("Got a GET request for /list_user");
   res.send('Page Listing');
})

// This responds a GET request for abcd, abxcd, ab123cd, and so on
app.get('/ab*cd', function(req, res) {
   console.log("Got a GET request for /ab*cd");
   res.send('Page Pattern Match');
})

var server = app.listen(8081, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})
*/
