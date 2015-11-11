
// track zombifying the page only once
var iszombied = false;

// fix scrollspy for using a fixed navbar
var scrolloffset = 51;

var imageSrcMap = [
	{id: 'img-nav-logo-inverted', url: 'img/biocoretek-zombie.png'},
	{id: 'img-carousel-logo-inverted', url: 'img/biocoretek-zombie.png'},
	{id: 'img-carousel-1', url: 'stockphoto/full-moon-886291_1920-1000.jpg'},
	{id: 'img-carousel-2', url: 'stockphoto/zombie-949915_1920-1000.jpg'},
	{id: 'img-carousel-3', url: 'stockphoto/frosted-glass-741505_1920-1000.jpg'},
	{id: 'img-carousel-4', url: 'stockphoto/zombie-367517_1920-1000.jpg'},
	{id: 'img-list-1', url: 'stockphoto/zombie-598390_1920.jpg'},
	{id: 'img-list-2', url: 'stockphoto/killer-820017_1920-1280.jpg'},
	{id: 'img-list-3', url: 'stockphoto/zombie-949916_1920.jpg'},
	{id: 'img-list-4', url: 'stockphoto/man-520042_1920.jpg'},
	{id: 'img-list-5', url: 'stockphoto/blood-spatter-497546_1920.jpg'},
	{id: 'img-list-6', url: 'stockphoto/death-667143_1280-853.jpg'},
	{id: 'img-molecularbiologist', url: 'stockphoto/3040460272_d51d5886d2_b.jpg'},
	{id: 'img-systemadministrator', url: 'stockphoto/zombie-949917_1920.jpg'},
	{id: 'img-securityagent', url: 'stockphoto/skull-535745_1920.jpg'},
	{id: 'img-escapegame', url: 'stockphoto/hand-525988_1920.jpg'},
	{id: 'img-past', url: 'stockphoto/zombie-784914_1920.jpg'},
	{id: 'img-present', url: 'stockphoto/10500555063_069511b1fc_h.jpg'},
	{id: 'img-future', url: 'stockphoto/skull-220049_1280.jpg'},
];

function init()
{
	// configure scrollspy
	$('body').scrollspy({ target: '#navbar-site', offset: scrolloffset });

/*
	// track scrollspy changes
	$('#navbar-site').on('activate.bs.scrollspy', function (e) {
		console.log(e);
	});
*/

	// Add smooth scrolling to all links inside a navbar
	$("#navbar-site a").on('click', function(event){
		// Prevent default anchor click behavior
		event.preventDefault();

		// Store hash (#)
		var hash = this.hash;

		// Using jQuery's animate() method to add smooth page scroll
		// The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area (the speed of the animation)
		$('html, body').animate({
			scrollTop: ($(hash).offset().top-scrolloffset+1)
		}, 800, function(){
			// Add hash (#) to URL when done scrolling (default click behavior)
			window.location.hash = hash;
		});
	});

	// track reaching the bottom of the page
	$(window).scroll(function() {
		if($(window).scrollTop() + $(window).height() == $(document).height()) {
			if (!iszombied)
			{
				iszombied = true;
				zombify();
			}
		}
	});

	// preload zombie images
	preloadImages();

	getResults();
}

function zombify()
{
	//console.log('zombify');
	applyClass();
	changeImageSource();
	addBlood();
}

function applyClass()
{
	$("body").addClass('zombify');
}

function changeImageSource()
{
	for (var i = 0; i <imageSrcMap.length; i++)
	{
		$("#"+imageSrcMap[i].id).attr('src', imageSrcMap[i].url);
	}
}

function addBlood()
{
	$(".bloodsplash").show();
}

function preloadImages()
{
	var images = new Array()
	for (i = 0; i < imageSrcMap.length; i++)
	{
		images[i] = new Image();
		images[i].src = imageSrcMap[i].url;
	}
}



var fields = [];
var results = [];
var multiplier = {};

function getResults()
{
	//console.log('get results');
	$.getJSON('results.json', function(data) {
		//console.log('got results');
		if (data && data.results)
		{
			fields = data.fields;
			results = data.results;
			multiplier = data.multiplier;
			processResults();
		}
	});
}

function processResults()
{
	var performance = [];

	for (var i = 0; i < results.length; i++)
	{
		// make tabs
		var t = $("#templateresulttab").children().clone();
		if (i == 0)
			t.addClass('active');

		t.find('a').attr('href', "#team"+results[i].team)
					.attr('aria-controls', "team"+results[i].team)
					.html(results[i].gametime);
		t.appendTo("#tablist");

		/////////////////////////

		// set details
		var c = $("#templateresultcontent").children().clone();
		c.attr('id', "team"+results[i].team)
		if (0 == i)
			c.addClass('active');

		// set summary values
		c.find('.team').html(results[i].team);
		c.find('.name').html(results[i].name);
		c.find('.gametime').html(results[i].gametime);
		c.find('.timeremaining').html(results[i].timeremaining);

		var members = '';
		for (var j=0; j < results[i].members.length; j++)
		{
			members += results[i].members[j];
			if (j < results[i].members.length-1)
				members += ', ';
		}
		c.find('.members').html(members);

		// get the table into which to add detail rows
		var st = c.find('.resultdetails tbody');

		var grandtotal = 0;
		var possibletotal = 0;

		// set detail values
		for (var k=0; k < fields.length; k++)
		{
			var d = $("#templateresultcontentdetailsrow").find('tr').clone();
			
			d.attr('id', "detailrow"+fields[k].name);
			var dname = '';
			if (fields[k].bonus)
				dname = "Bonus&ast;: ";
			dname += fields[k].display;
			d.find('.resultname').html(dname);
			d.find('.resultvalue').html(results[i].score[fields[k].name]);
			d.find('.resultmultiplier').html(fields[k].multiplier);
			d.find('.resultmaximum').html(fields[k].max);
			var total = fields[k].multiplier * results[i].score[fields[k].name];
			if ((fields[k].max > 0 && total > fields[k].max) ||
				(fields[k].max < 0 && total < fields[k].max))
				total = fields[k].max;
			d.find('.resulttotal').html(total);

			grandtotal += total;

			if (!fields[k].bonus && fields[k].max > 0)
				possibletotal += fields[k].max;

			d.appendTo(st);
		}
		// calculate percentage
		var per = grandtotal * 100 / possibletotal;
		per = Math.round(per);

		c.find('.percentage').attr('title', per+'% Completed')
				.find('.progress-bar').attr('aria-valuenow', per)
				.css('width', per+'%');

		// add the footer total
		c.find('.resultfoottotal').html(grandtotal + "/" + possibletotal + ' = ' + per + '%');

		c.appendTo('#tabcontent');

		//////////////////////////

		// make performance
		var p = $("#templateperformancerow").find('tr').clone();
		p.find('.name').html(results[i].name);
		p.find('.gametime').html(results[i].gametime);

		p.find('.percentage').attr('title', per+'% Completed')
				.find('.progress-bar').attr('aria-valuenow', per)
				.css('width', per+'%');

		performance.push({'percentage': per, 'obj': p});
	}

	performance.sort(function(a, b) {
		if (a.percentage < b.percentage)
			return 1;
		if (a.percentage > b.percentage)
			return -1;
		return 0;
	});

	var lastrank = 0;
	var lastper = 0;
	for (var m=0; m < performance.length; m++)
	{
		var r = lastrank+1;
		if (performance[m].percentage == lastper)
			r = lastrank;

		(performance[m].obj).find('.rank').html(r);
		(performance[m].obj).appendTo("#performancelist");
		lastper = performance[m].percentage;
		lastrank = r;
		console.log(lastper, lastrank);
	}


}














// run on startup
$(function() {
	init();
});
