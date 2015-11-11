$(function() {
	setupMenu();
	$("#menuproject").click();
});

var timeoutID;

function setupMenu()
{
	$("#menu a").on('click', function(e) {
		e.preventDefault();
		var id = $(this).attr('id');
		//console.log('clicked', id);

		// set active class
		$("#menu li").removeClass();
		$(this).parent().addClass('active');

		// set template
		var t = $("#template"+id).clone();
		t.show();
		$('#content').html(t);
	});
}

function submitForm()
{
	hideAlerts();
	var boxnumber = $("#boxnumber").val();
	var accesscode = $("#accesscode").val();

	if (!boxnumber || !accesscode)
	{
		showError();
		return false;
	}

	$.ajax({
		method: "POST",
		url: "projecturl",
		cache: false,
		data: { boxnumber: boxnumber, code: accesscode }
	}).done(function() {
		showSuccess();
	}).fail(function() {
		showError();
	});

}
function hideAlerts()
{
	hideSuccess();
	hideError();
	window.clearTimeout(timeoutID);
}

function showSuccess()
{
	hideAlerts();
	$('#successalert').show();
	timeoutID = window.setTimeout(hideAlerts, 5000);
}
function hideSuccess()
{
	$('#successalert').hide();
}

function showError()
{
	hideAlerts();
	$('#erroralert').show();
	timeoutID = window.setTimeout(hideAlerts, 5000);
}
function hideError()
{
	$('#erroralert').hide();
}