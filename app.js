
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  ,fs = require('fs')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

//数据持久化
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
//数据保存。
app.post('/saveInput', function (req, res) {

//    var tmp_path = req.files.file.path;
//    var target_path = './public/images/' + req.files.file.name;
//    fs.rename(tmp_path, target_path, function (err) {
//        if (err) throw err;
//
//    });



    var user={};
    user.name=req.body.name;
    user.templename=req.body.templename;
    user.posthumoustitle=req.body.posthumoustitle;
    user.reigntitle=req.body.reigntitle;
    user.imagepath = "";
    user.imagename = "";

    var db=new Db('test',new Server('localhost',27017,{auto_reconnect:true}, {}));
    db.open(function(){
        console.log('db opened');
        db.collection('reigntitle',function(err,collection){
            if (err) callback(err);
            collection.insert(user,{safe:true},function(err,docs){
                console.log(docs[0]._id);

                res.render('upload', {item:docs[0], title:'年号简表' });

            });
        });
    });
//    res.end();
});
//批量数据保存
app.post('/saveInputMulti', function (req, res) {

//    var tmp_path = req.files.file.path;
//    var target_path = './public/images/' + req.files.file.name;
//    fs.rename(tmp_path, target_path, function (err) {
//        if (err) throw err;
//
//    });
  var content = req.body.content;
   //

    var array =  JSON.parse(content);
//var obj = jquery(content);
    //console.log(array);


//    var user={};
//    user.name=req.body.name;
//    user.templename=req.body.templename;
//    user.posthumoustitle=req.body.posthumoustitle;
//    user.reigntitle=req.body.reigntitle;
//    user.imagepath = "";
//    user.imagename = "";

    var db=new Db('test',new Server('localhost',27017,{auto_reconnect:true}, {}));
    db.open(function(){
        console.log('db opened');
        db.collection('reigntitle',function(err,collection){
            if (err) callback(err);
            for( i = 0;i<array.length;i++){
                console.log(array[i]);
            collection.insert(array[i],{safe:true},function(err,docs){

                console.log(docs[0]._id);
                //批量添加如何转向？

            });
            }
        });
    });


//    var user={};
//    user.name=req.body.name;
//    user.templename=req.body.templename;
//    user.posthumoustitle=req.body.posthumoustitle;
//    user.reigntitle=req.body.reigntitle;
//    user.imagepath = "";
//    user.imagename = "";
//
//    var db=new Db('test',new Server('localhost',27017,{auto_reconnect:true}, {}));
//    db.open(function(){
//        console.log('db opened');
//        db.collection('reigntitle',function(err,collection){
//            if (err) callback(err);
//            collection.insert(user,{safe:true},function(err,docs){
//                console.log(docs[0]._id);
//
//                //批量添加如何转向？
//
//            });
//        });
//    });
//    res.end();
});
//头像上传并更新数据
app.post('/imageUpload', function (req, res) {

    var tmp_path = req.files.file.path;
    var target_path = './public/images/' + req.files.file.name;
    fs.rename(tmp_path, target_path, function (err) {
        if (err) throw err;

    });


    var ObjectID =  require("mongodb").ObjectID;

    var query={};
    query._id=new ObjectID(req.body._id);

    var user={};

    user.imagepath = target_path;
    user.imagename = req.files.file.name;

    var db=new Db('test',new Server('localhost',27017,{auto_reconnect:true}, {}));
    db.open(function(){
        console.log('db opened');
        db.collection('reigntitle',function(err,collection){
            if (err) callback(err);
//console.log({$set: user});
            collection.update(query,{$set: user},{safe:true},function(err,docs){

                res.redirect('list');
                res.end();
            });
        });
    });
//    res.end();
});
//进入更新页面
app.get('/update',function(req,res){
    var ObjectID =  require("mongodb").ObjectID;

    var query={};
    query._id=new ObjectID(req.query.id);
    var db=new Db('test',new Server('localhost',27017,{auto_reconnect:true}, {}));
    db.open(function(){
        console.log('db opened');
        db.collection('reigntitle',function(err,collection){
            if (err) callback(err);

//            collection.find(query,{safe:true},function(err,docs){
//console.log(docs[0]);
//                res.render('edit', {item:docs[0], title:'年号简表修改' });
//                res.end();
//            });


            collection.find(query,{}).toArray(function(err,docs){
                if (err) callback(err);
                //console.log(docs[0]);
                res.render('edit', {item:docs[0], title:'年号简表修改' });
                res.end();            //console.log(docs);

            })
        });
    });


})
//更新保存
app.post('/updateSave', function (req, res) {

    var tmp_path = req.files.file.path;
    var target_path = './public/images/' + req.files.file.name;

    if(req.files.file.name!=""){
        fs.rename(tmp_path, target_path, function (err) {
            if (err) throw err;

        });

    }


   var ObjectID =  require("mongodb").ObjectID;

    var query={};
    query._id=new ObjectID(req.body._id);


    var user={};
    user.name=req.body.name;
    user.templename=req.body.templename;
    user.posthumoustitle=req.body.posthumoustitle;
    user.reigntitle=req.body.reigntitle;
    user.imagepath = target_path;
    user.imagename = req.files.file.name;

    var db=new Db('test',new Server('localhost',27017,{auto_reconnect:true}, {}));
    db.open(function(){
        console.log('db opened');
        db.collection('reigntitle',function(err,collection){
            if (err) callback(err);

            collection.update(query,{$set: user},{safe:true},function(err,docs){

                res.redirect('list');
                res.end();
            });
        });
    });
//    res.end();
});
//删除
app.get('/remove', function (req, res) {

    var ObjectID = require('mongodb').ObjectID;

    var user={"_id":new ObjectID(req.query.id)};
     //user.name=req.query.id;
    console.log(user);

    //collection.findOne({_id: new ObjectID(idString)}, console.log)  // ok

    var db=new Db('test',new Server('localhost',27017,{auto_reconnect:true}, {}));
    db.open(function(){
        console.log('db opened');
        db.collection('reigntitle',function(err,collection){
            if (err) callback(err);
            collection.remove(user,{safe:true},function(err,removed){
                console.log(removed);
                //文件删除
               // fs.unlinkSync('tmp/hello')



                res.redirect('list');
                res.end();
            });
        });
    });
//    res.end();
});
//进入添加页面
app.get('/input', function (req, res) {
    res.redirect('input.html');
    res.end();
});

//fu.get("/input", fu.staticHandler("input.html"));
//列表
app.get('/list',function(req,res){
    var users=[];
    var reigntitles= new Array();

    var db=new Db('test',new Server('localhost',27017,{auto_reconnect:true}, {}));
    console.log("1");
    db.open(function(){
        console.log("2");
        db.collection('reigntitle',function(err,collection){
            console.log("3");
            if (err) callback(err);



                console.log("3-1");
                collection.find({}).toArray(function(err,docs){
                    if (err) callback(err);
                    //console.log(docs);
                    reigntitles=docs;
                    console.log("3-1-1");
                   res.render('list', {items:reigntitles, title:'年号简表' });
                   //res.end();
                })

            console.log("3-3");

        });
    });
    console.log("4");

    //res.end();//不能在此关闭，因为允许数据是1，4，2，3，3-2，3-3
});



