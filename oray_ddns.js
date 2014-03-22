var http = require('http');

var user_name = process.argv[2];
var user_pwd = process.argv[3];
var check_time = 10*1000 || process.argv[4];

var old_ip = '';
var cur_ip = '';

var tmo;


start();

function start(){
	if ( (process.argv.length == 4) || (process.argv.length == 4) ) {
		checkip();
	}else{
		console.log('Please use cmd like : node oray_ddns.js your_user_name your_user_pwd [check_ip_time]');
	};
}


function base64(str){
	return new Buffer(str).toString('base64');
}

function update(){
	var update_options = {
		hostname : 'ddns.oray.com',
		port : 80,
		path : '/ph/update?hostname=clovedin.oicp.net&myip'+cur_ip,
		method : 'GET'
	};

	var update_req = http.request(update_options, function(res){
		res.on('data', function(chk){
			console.log('\t--Info\tOray res : \n\t\t'+chk);

			var res = chk.toString().split(' ');
			if (res[0].trim() !== 'good') {
				console.log('\t--Warn\tUpdate ip May Failure !\n\t\tcur_ip='+cur_ip+'; old_ip='+old_ip);
			}else{
				console.log('\t--Info\tUpdate ip Success !');
			}
		});
	});

	// update_req.setHeader('Authorization','Basic Y2xvdmVkaW46bWY5MTQ2OTk0Nzg=');
	update_req.setHeader('Authorization','Basic '+base64(user_name+':'+user_pwd));
	update_req.setHeader('User-Agent','Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.149 Safari/537.36');

	update_req.end();
}

function checkip(){
	http.get('http://ddns.oray.com/checkip', function(res){
		res.on('data', function(chk){
			var res_text = chk.toString().trim();
			cur_ip = res_text.substring(76,res_text.length-14);

			console.log('\t--Info\tCheck IP : '+cur_ip+' @ '+new Date().toLocaleTimeString());

			if (cur_ip !== old_ip) {
				update();
				old_ip = cur_ip;
			}

			if (tmo) {
				clearTimeout(tmo);
			};
			tmo = setTimeout(checkip, check_time);
		});
	}).end();
};
