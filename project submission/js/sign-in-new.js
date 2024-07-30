$(function () {
  $("#sign-in").click(function (n) {
    n.preventDefault(),
      $.post("/api/ui-event", {
        event: "sign-in-click",
      }),
      $("#menu-sign-in").is(":visible")
        ? $("#sign-in").removeClass("active")
        : $("#sign-in").addClass("active"),
      $("#menu-sign-in-sign-up").css({
        top: $("#top-nav").position().top + $("#top-nav").height() + 2,
        left:
          $("#top-links").position().left +
          $("#top-links").width() -
          $("#menu-sign-in-sign-up").width(),
      }),
      $(window).resize(function () {
        $("#menu-sign-in-sign-up").css({
          top: $("#top-nav").position().top + $("#top-nav").height() + 2,
          left:
            $("#top-links").position().left +
            $("#top-links").width() -
            $("#menu-sign-in-sign-up").width(),
        });
      }),
      $("#menu-sign-in").slideToggle(),
      $('#menu-sign-in input[name="email"]').focus(),
      $("#menu-create-account").hide(),
      $("#create-account").removeClass("active"),
      $("#create-account").addClass("blue"),
      $("#menu-forgot-password").is(":visible") &&
        $("#menu-forgot-password").slideToggle();
  }),
    $("#create-account").click(function (n) {
      n.preventDefault(),
        $.post("/api/ui-event", {
          event: "create-account-click",
        }),
        $("#menu-create-account").is(":visible")
          ? ($("#create-account").removeClass("active"),
            $("#create-account").addClass("blue"))
          : ($("#create-account").addClass("active"),
            $("#create-account").removeClass("blue")),
        $("#menu-sign-in-sign-up").css({
          top: $("#top-nav").position().top + $("#top-nav").height() + 2,
          left:
            $("#top-links").position().left +
            $("#top-links").width() -
            $("#menu-sign-in-sign-up").width(),
        }),
        $(window).resize(function () {
          $("#menu-sign-in-sign-up").css({
            top: $("#top-nav").position().top + $("#top-nav").height() + 2,
            left:
              $("#top-links").position().left +
              $("#top-links").width() -
              $("#menu-sign-in-sign-up").width(),
          });
        }),
        $("#menu-create-account").slideToggle("slow"),
        $('#menu-create-account input[name="email"]').focus(),
        $("#menu-sign-in").hide(),
        $("#sign-in").removeClass("active"),
        $("#menu-forgot-password").is(":visible") &&
          $("#menu-forgot-password").slideToggle();
    }),
    $('#menu-sign-in input[type="submit"]').click(function (n) {
      n.preventDefault();
      var e = $('#menu-sign-in input[name="email"]').val(),
        t = $('#menu-sign-in input[name="password"]').val();
      if (((e = e.replace(/^\s+/, "").replace(/\s+$/, "")), e.length == 0)) {
        $("#menu-error-sign-in").text("Empty email"),
          $("#menu-error-sign-in").show();
        return;
      }
      if (!/.+@.+\..+/.test(e)) {
        $("#menu-error-sign-in").text("Invalid email"),
          $("#menu-error-sign-in").show();
        return;
      }
      if (t.length == 0) {
        $("#menu-error-sign-in").text("Empty password"),
          $("#menu-error-sign-in").show();
        return;
      }
      _rcExecute("idRCSignIn"),
        grecaptcha.reset(idRCSignIn),
        grecaptcha.execute(idRCSignIn);
    }),
    $('#menu-create-account input[type="submit"]').click(function (n) {
      n.preventDefault();
      var e = $('#menu-create-account input[name="email"]').val(),
        t = $('#menu-create-account input[name="password1"]').val(),
        i = $('#menu-create-account input[name="password2"]').val();
      if (((e = e.replace(/^\s+/, "").replace(/\s+$/, "")), e.length == 0)) {
        $("#menu-error-create-account").text("Empty email"),
          $("#menu-error-create-account").show();
        return;
      }
      if (!/.+@.+\..+/.test(e)) {
        $("#menu-error-create-account").text("Invalid email"),
          $("#menu-error-create-account").show();
        return;
      }
      if (t.length == 0) {
        $("#menu-error-create-account").text("Empty password"),
          $("#menu-error-create-account").show();
        return;
      }
      if (i.length == 0) {
        $("#menu-error-create-account").text("Empty confirmation password"),
          $("#menu-error-create-account").show();
        return;
      }
      if (t != i) {
        $("#menu-error-create-account").text("Passwords don't match"),
          $("#menu-error-create-account").show();
        return;
      }
      _rcExecute("idRCCreateAccount"),
        grecaptcha.reset(idRCCreateAccount),
        grecaptcha.execute(idRCCreateAccount);
    }),
    $("#forgot-password a").click(function (n) {
      n.preventDefault(),
        $.post("/api/ui-event", {
          event: "forgot-password-click",
        }),
        $("#menu-sign-in").slideToggle(),
        $("#menu-forgot-password").slideToggle(),
        $('#menu-forgot-password input[name="email"]').focus();
    }),
    $("#forgot-password-back a").click(function (n) {
      n.preventDefault(),
        $("#menu-sign-in").slideToggle(),
        $("#menu-forgot-password").slideToggle(),
        $('#menu-sign-in input[name="email"]').focus();
    }),
    $('#menu-forgot-password input[type="submit"]').click(function (n) {
      n.preventDefault();
      var e = $('#menu-forgot-password input[name="email"]').val();
      if (((e = e.replace(/^\s+/, "").replace(/\s+$/, "")), e.length == 0)) {
        $("#menu-error-forgot-password").text("Empty email"),
          $("#menu-error-forgot-password").show();
        return;
      }
      if (!/.+@.+\..+/.test(e)) {
        $("#menu-error-forgot-password").text("Invalid email"),
          $("#menu-error-forgot-password").show();
        return;
      }
      _rcExecute("idRCForgotPassword"),
        grecaptcha.reset(idRCForgotPassword),
        grecaptcha.execute(idRCForgotPassword);
    });
});
