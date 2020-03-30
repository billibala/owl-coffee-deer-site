// checks that an input string looks like a valid email address.
var emailRegex = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
var mailToAttribute = 'mailto:support@headnix.zendesk.com?subject=Atttach: alpha sign up support';
var userEmail;
function isEmail(s) {
   return String(s).search(emailRegex) != -1;
}
function updateFormView(aStatus) {
	if ( aStatus == 'sending' ) {
		// show sending
		$('#submitRequestButton').text('Sending...');
		$('#emailField').blur().attr('disabled', 'disabled');
		$('#requestBetaForm').css('opacity', '0.5');
	} else if ( aStatus == 'successful_request') {
		ga('send', 'event', 'Sign Up', 'success')
		$('#requestBetaForm').css('opacity', '0');
		$('#requestBetaForm').bind('webkitTransitionEnd', function() {
		// Successful. Please check your inbox.
			$('#requestBetaForm').html('<div class="successMessage"><h2>Request submitted successfully!</h2><p>You should receive an invitation subject &ndash; <b>Atttach Invitation for HockeyApp</b> sent to ' + userEmail + ' in seconds. Contact <a href="' + mailToAttribute + '">support</a> if you need any assistance.</p></div>').css({'opacity': '1.0'});
			$('#requestBetaForm').unbind('webkitTransitionEnd');
		});
	} else if ( aStatus == 'failed_request' ) {
		ga('send', 'event', 'Sign Up', 'fail')
		$('#requestBetaForm').css('opacity', '0');
		// Failed! Please try again.
		$('#requestBetaForm').bind('webkitTransitionEnd', function() {
			$('#requestBetaForm').html('<div class="errorMessage"><h2>Request failed!</h2><p>Please contact <a href="' + mailToAttribute + '">support</a> for assistance.</p></div>').css({'opacity': '1.0'});
			$('#requestBetaForm').unbind('webkitTransitionEnd');
		});
	} else if ( aStatus == 'email_exists' ) {
		ga('send', 'event', 'Sign Up', 'duplicate')
		$('#requestBetaForm').css('opacity', '0');
		$('#requestBetaForm').bind('webkitTransitionEnd', function() {
			$('#requestBetaForm').html('<div class="errorMessage"><h2>Email exists</h2><p>Look for the invite &ndash; <b>Atttach Invitation for HockeyApp</b> in your inbox. Please contact <a href="' + mailToAttribute + '">support</a> if you need any assistance. If you want to download Atttach again, sign in our <a href="https://rink.hockeyapp.net/users/sign_in">beta management system</a>.</p></div>').css({'opacity': '1.0'});
			$('#requestBetaForm').unbind('webkitTransitionEnd');
		});
	}
}
function submitBetaRequest() {
	var emTxt = $('#emailField').val().trim();
	// validate email address
	if ( isEmail(emTxt) ) {
		ga('send', 'event', 'Sign Up', 'signing-up')
		userEmail = emTxt;
		updateFormView('sending');
		var jqxhr = $.post('behaviors/index.php/beta_request/sign_up', {email: emTxt}, function(data) {
			// sign up result
			if ( data.result == 'done' ) {
				updateFormView('successful_request');
			} else if ( data.result == 'failed' ) {
				if ( data.reason == 'taken' ) {
					updateFormView('email_exists');
				}
			}
		})
		.error(function() {
			alert('error');
		});
	} else {
		alert('Please enter a valid email address');
	}
	// post email to project server
	return false;
}
function showWhyEmailCallout() {
	$('#whyEmailCallout').fadeIn('fast', function() {
	$('body').click(function() {
	$('#whyEmailCallout').fadeOut('fast');
	$('#whyEmailCallout').unbind('click');
	})
	});
	ga('send', 'event', 'Sign Up', 'why-email')
}
function clickHandler(theEvent) {
    left = Math.round((screen.width / 2) - (520 / 2));
    top = 0;
    if (screen.height > 420) {
      top = Math.round((screen.height / 2) - (420 / 2));
    }
    window.open(theEvent.target.href, 'intent', 'scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=520,height=420,left=' + left + ',top=' + top);
	ga('send', 'social', theEvent.target.innerText.toLowerCase(), 'possibly_sharing', 'http://atttach.com');
	return false;
}
function clickAnchor(linkObj, catName, actionName) {
  ga('send', 'event', catName, 'click', actionName, {
	  'hitCallback' : function() {
		  document.location = linkObj.href;
	  }
  });
}

$(document).ready(function() {
	$('#logoDiv').bind({
		mouseenter: function() {
			$('#betaBubble').css('background-position-y', '0');
		},
		mouseleave: function() {
			$('#betaBubble').css('background-position-y', '19px');
		},
		click: function() {
			$('#emailField').focus().addClass('highlightEmailField');
		}
	});
	$('#emailField').focus(function(){
		ga('send', 'event', 'Sign Up', 'intent');
	});
	$('#submitRequestButton').click(submitBetaRequest);
	$('#requestBetaForm').submit(submitBetaRequest);
	$('#twitterShare').click(clickHandler);
	$('#facebookShare').click(clickHandler);
	$('#gplusShare').click(clickHandler)
	$('#dribbbleShare').click(clickHandler);
});