$(function() {
	drawBG();
	checkForError();
});

function drawBG()
{
	var tt = "C<sub>8</sub>H<sub>10</sub>N<sub>4</sub>O<sub>2</sub>"
	var t = '';
	for (var i=0; i < 1600; i++)
	{
		t += tt + ' ';
	}
	$(".viewText").html(t);
}

function checkForError()
{
	var hash = window.location.hash;
	
	if (hash == '#error')
	{
		$('#erroralert').show();
	}
}