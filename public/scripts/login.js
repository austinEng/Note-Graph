(function() {
  $('.reveal').slideDown(300);

  function transitionToLogin() {
    $('.for_registration').slideUp(300);
    $('#register-buttons').hide();
    $('#login-buttons').show();
    $('.error').slideUp(300, function() {
      $(this).remove();
    });
  }

  function transitionToRegister() {
    $('.for_registration').slideDown(300);
    $('#login-buttons').hide();
    $('#register-buttons').show();
    $('.error').slideUp(300, function() {
      $(this).remove();
    });
  }

  $('#login-link').on('click', function (e) {
    e.preventDefault();
    var href = $('#login-link').attr('href');
    history.pushState({page: 'login'}, "login", href);
    transitionToLogin();
  });

  $('#register-link').on('click', function (e) {
    e.preventDefault();
    var href = $('#register-link').attr('href');
    history.pushState({page: 'register'}, "register", href);
    transitionToRegister();
  });

  window.onpopstate = function (e) {
    if (e.state) {
      if (e.state.page == 'login') {
        transitionToLogin();
      } else if (e.state.page == 'register') {
        transitionToRegister();
      }
    }
  }

})();