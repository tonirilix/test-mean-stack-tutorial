var mongoose = require( 'mongoose' );

var fs = require('fs');
fs.readdirSync(__dirname + '/models/').forEach(function(filename){
    if(~filename.indexOf('.js')) require(__dirname + '/models/'+filename);
});

mongoose.connect( 'mongodb://localhost:27017/news' );
