$(document).ready(function () {

  var sideNav = $('.sidewide-nav');
  var headerEl = $('div.header');

  var tokenTimer;
  var jwt, me;

  function initialize() {
    checkTokenAndUpdateProfile();
    moveAnchorTarget();
  }

  function isTokenValid() {
    if (!window.localStorage) return false;
    jwt = window.localStorage['lscache-extended_jwt'] ? $.parseJSON(window.localStorage['lscache-extended_jwt']) : {};
    me = window.localStorage['lscache-me'] ? $.parseJSON(window.localStorage['lscache-me']) : {};
    var unixTime = (Math.round((new Date()).getTime() / 1000));
    return me && me.name && jwt && parseInt(jwt.expires_at) > parseInt(unixTime);
  }

  function moveAnchorTarget() {
    // Modifying the Sphinx output seems too difficult, so move the ID tags
    // from the node carrying them to the headerlink
    $('a.headerlink').each(function () {
      var target = this.href.substr(this.href.indexOf('#')+1)
      $('<a class="anchor" />').attr('id', target).insertAfter($(this))
      $(this).parentsUntil('[id]').each(function() {
        $(this.parentNode).removeAttr('id')
      })
    })
  }

  function checkTokenAndUpdateProfile() {
    if (!isTokenValid()) {
      tokenTimer && clearInterval(tokenTimer);

      sideNav.find('li.dashboard').addClass('hidden');
      sideNav.find('li.profile').addClass('hidden');
      sideNav.find('li.login').removeClass('hidden');

      headerEl.find('li.dashboard').addClass('hidden');
      headerEl.find('li.login').removeClass('hidden');

      headerEl.find('.username-wrap').addClass('hidden');
      headerEl.find('.thumbnail-wrap').addClass('hidden');

    } else if (!tokenTimer) {

      sideNav.find('li.dashboard').removeClass('hidden');
      sideNav.find('li.profile').removeClass('hidden');
      sideNav.find('li.login').addClass('hidden');

      headerEl.find('li.dashboard').removeClass('hidden');
      headerEl.find('li.login').addClass('hidden');

      headerEl.find('.username-wrap a').text(me.name);
      headerEl.find('.username-wrap').removeClass('hidden');

      headerEl.find('.thumbnail-wrap img').attr('src', me.avatar);
      headerEl.find('.thumbnail-wrap').hide();
      headerEl.find('.thumbnail-wrap').fadeOut();
      headerEl.find('.thumbnail-wrap').removeClass('hidden');
      headerEl.find('.thumbnail-wrap').fadeIn(500);

      tokenTimer = setInterval(checkTokenAndUpdateProfile, 1000);
    }
  }

  initialize();

});
