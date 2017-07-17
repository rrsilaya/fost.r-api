const uuid = require('shortid');
uuid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');	
// default has "-"" and "_" ; this sets the characters to only the entered characters (https://www.npmjs.com/package/shortid)  
// i placed it here because if there is a pet that will be added which already has a photo upon pet creation
// the uuid cannot be accessed before getting the image dimensions

module.exports.generate = function(callback){
	var uuid = uuid.generate();
	return callback(null, uuid);
}