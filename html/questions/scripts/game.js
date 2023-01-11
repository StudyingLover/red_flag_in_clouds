var fenshu = 0;//分数
var time = 30;//总时间
//var num=0;//等待改变的方块个数
var squre={};
squre.Game={};
squre.Game.squreWidth=100;
squre.Game.squreHeight=100;
squre.Game.desk=[
	"0","1","2","3",
	"4","5","6","7",
	"8","9","10","11",	
	"12","13","14","15"
];

var squrelength;
//翻转方块功能的实现
function changeSqure(){
	var $fsqure=$(".squre-flipped");
	$(this).addClass("squre-flipped");
	time+=10;
	document.getElementById("sec").innerHTML=time;
	if($(this).data("pattern") == 0){
		document.getElementById('problem_0').style.display='block';
		$(this).data("pattern",16);
	}else if($(this).data("pattern") == 1){
		document.getElementById('problem_1').style.display='block';
		$(this).data("pattern",16);
	}else if($(this).data("pattern") == 2){
		document.getElementById('problem_2').style.display='block';
		$(this).data("pattern",16);
	}else if($(this).data("pattern") == 3){
		document.getElementById('problem_3').style.display='block';
		$(this).data("pattern",16);
	}else if($(this).data("pattern") == 4){
		document.getElementById('problem_4').style.display='block';
		$(this).data("pattern",16);
	}else if($(this).data("pattern") == 5){
		document.getElementById('problem_5').style.display='block';
		$(this).data("pattern",16);
	}else if($(this).data("pattern") == 6){
		document.getElementById('problem_6').style.display='block';
		$(this).data("pattern",16);
	}else if($(this).data("pattern") == 7){
		document.getElementById('problem_7').style.display='block';
		$(this).data("pattern",16);
	}else if($(this).data("pattern") == 8){
		document.getElementById('problem_8').style.display='block';
		$(this).data("pattern",16);
	}else if($(this).data("pattern") == 9){
		document.getElementById('problem_9').style.display='block';
		$(this).data("pattern",16);
	}else if($(this).data("pattern") == 10){
		document.getElementById('problem_10').style.display='block';
		$(this).data("pattern",16);
	}else if($(this).data("pattern") == 11){
		document.getElementById('problem_11').style.display='block';
		$(this).data("pattern",16);
	}else if($(this).data("pattern") == 12){
		document.getElementById('problem_12').style.display='block';
		$(this).data("pattern",16);
	}else if($(this).data("pattern") == 13){
		document.getElementById('problem_13').style.display='block';
		$(this).data("pattern",16);
	}else if($(this).data("pattern") == 14){
		document.getElementById('problem_14').style.display='block';
		$(this).data("pattern",16);
	}else if($(this).data("pattern") == 15){
		document.getElementById('problem_15').style.display='block';
		$(this).data("pattern",16);
	}else if($(this).data("pattern") == 16){
		alert("你已经点过此方块");
	}else{
		alert("你不对劲");
	}
	var $fsqures=$(".squre-flipped");
	squrelength=$fsqures.length;
}

function closeproblem(){
	document.getElementById('problem_0').style.display='none';
	document.getElementById('problem_1').style.display='none';
	document.getElementById('problem_2').style.display='none';
	document.getElementById('problem_3').style.display='none';
	document.getElementById('problem_4').style.display='none';
	document.getElementById('problem_5').style.display='none';
	document.getElementById('problem_6').style.display='none';
	document.getElementById('problem_7').style.display='none';
	document.getElementById('problem_8').style.display='none';
	document.getElementById('problem_9').style.display='none';
	document.getElementById('problem_10').style.display='none';
	document.getElementById('problem_11').style.display='none';
	document.getElementById('problem_12').style.display='none';
	document.getElementById('problem_13').style.display='none';
	document.getElementById('problem_14').style.display='none';
	document.getElementById('problem_15').style.display='none';
}

var go = false;//判断是否点击游戏继续
function startgame(){
	document.getElementById("quiet").play();
	document.getElementById('startgame').style.display='none';
	document.getElementById('tips').style.display='block';
	go = true;
	var c=document.getElementById("hud");
	var ctx=c.getContext('2d');
	c.style.display='block';
	ctx.font="20px Georgia";
	ctx.fillText("ヾ(◍°∇°◍)ﾉﾞ",5,20);
}
var ontip = true;
function tip(){
	if(ontip){
		document.getElementById('tipbox').style.display='block';
		ontip = false;
	}else{
		document.getElementById('tipbox').style.display='none';
		ontip = true;
	}
}
function less(){
	fenshu-=5;
	document.getElementById("score").innerHTML=fenshu;
	closeproblem();
	checklast();
	time-=5;
	document.getElementById("sec").innerHTML=time;
	document.getElementById('falsesound').play();
}
function add(){
	fenshu+=5;
	document.getElementById("score").innerHTML=fenshu;
	closeproblem();
	checklast();
	time+=10;
	document.getElementById("sec").innerHTML=time;
	document.getElementById('truesound').play();
}
function lesstime(){
	closeproblem();
	checklast();
	time-=5;
	document.getElementById("sec").innerHTML=time;
	document.getElementById('falsesound').play();
}
function addtime(){
	closeproblem();
	checklast();
	time+=5;
	document.getElementById("sec").innerHTML=time;
	document.getElementById('truesound').play();
}
function checklast(){
	if(squrelength==16){
		console.log(squrelength);
		document.getElementById('gameover').style.display='block';
		document.getElementById("score2").innerHTML=fenshu;
	}
}

//计时器
function timego(){
	if(go){
		if(time <= 0){
			document.getElementById('gameover').style.display='block';
			document.getElementById("score2").innerHTML=fenshu;
		}
		time-=1;
		document.getElementById("sec").innerHTML=time;
		setTimeout("timego()",1000);
	}
	else
		setTimeout("timego()",1000);

}