var idRCSignIn = null;
var idRCCreateAccount = null;
var idRCForgotPassword = null;
var idRCSignInPricing = null;
var idRCCreateAccountPricing = null;

var _RC_EXECUTE_CALLED = 1 << 0;
var _RC_WINDOW_SHOWN = 1 << 1;

var _rcFlags = {
  idRCSignIn: 0,
  idRCCreateAccount: 0,
  idRCForgotPassword: 0,
  idRCSignInPricing: 0,
  idRCCreateAccountPricing: 0,
};

var _rcLastExecute = null;

var _rcExecute = function (id) {
  _rcLastExecute = id;
  _rcFlags[id] |= _RC_EXECUTE_CALLED;
};

if ("MutationObserver" in window) {
  var rcObserveVisibility = function (mutations, observer) {
    for (var i = 0; i < mutations.length; i++) {
      var mutation = mutations[i];

      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "style"
      ) {
        var wasHidden = /visibility:\s*hidden/.test(mutation.oldValue);
        var isHidden = mutation.target.style.visibility === "hidden";

        if (wasHidden && !isHidden) {
          var id = _rcLastExecute;
          if (id) {
            _rcLastExecute = null;
            _rcFlags[id] |= _RC_WINDOW_SHOWN;
          }
        }
      }
    }
  };

  var rcObserveBframes = function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var mutation = mutations[i];

      if (mutation.type === "childList") {
        for (var j = 0; j < mutation.addedNodes.length; j++) {
          var addedNode = mutation.addedNodes[j];
          var rcBframe = addedNode.querySelector(
            'iframe[src^="https://www.google.com/recaptcha/api2/bframe"]'
          );

          if (rcBframe) {
            new MutationObserver(rcObserveVisibility).observe(addedNode, {
              attributes: true,
              attributeFilter: ["style"],
              attributeOldValue: true,
            });
          }
        }
      }
    }
  };

  new MutationObserver(rcObserveBframes).observe(document.body, {
    childList: true,
  });
}

var RecaptchaCallback = function () {
  var siteKey = "6LcuOoYkAAAAAOD7O2RrdAdciROGH2YrD1VFvbcf";

  idRCSignIn = grecaptcha.render("recaptchaSignIn", {
    sitekey: siteKey,
    size: "invisible",
    callback: function (token) {
      $("#menu-error-sign-in").hide();
      $('#menu-sign-in input[type="submit"]').prop("disabled", true);
      var email = $('#menu-sign-in input[name="email"]').val();
      var pass = $('#menu-sign-in input[name="password"]').val();
      var flags = _rcFlags["idRCSignIn"];

      $.post(
        "/api/user/login",
        {
          email: email,
          password: pass,
          widget1: true,
          recaptcha: token,
          flags: flags,
        },
        function (data) {
          try {
            var json = JSON.parse(data);
            if (json.success) {
              window.location.reload();
            } else {
              $('#menu-sign-in input[type="submit"]').prop("disabled", false);
              $("#menu-error-sign-in").text(json.error);
              $("#menu-error-sign-in").show();
            }
          } catch (e) {
            $('#menu-sign-in input[type="submit"]').prop("disabled", false);
            $("#menu-error-sign-in").text(
              "Failed parsing JSON login response from the server."
            );
            $("#menu-error-sign-in").show();
          }
        }
      );
    },
    "expired-callback": function () {
      $('#menu-sign-in input[type="submit"]').prop("disabled", false);
      $("#menu-error-sign-in").text("Recaptcha expired. Please try again.");
      $("#menu-error-sign-in").show();

      var flags = _rcFlags["idRCSignIn"];
      $.post(
        "/api/user/rc-exp-err",
        {
          action: "login",
          experr: "exp",
          flags: flags,
        },
        function () {}
      );
    },
    "error-callback": function () {
      $('#menu-sign-in input[type="submit"]').prop("disabled", false);
      $("#menu-error-sign-in").text("Recaptcha error. Please try again.");
      $("#menu-error-sign-in").show();

      var flags = _rcFlags["idRCSignIn"];
      $.post(
        "/api/user/rc-exp-err",
        {
          action: "login",
          experr: "err",
          flags: flags,
        },
        function () {}
      );
    },
  });
  idRCCreateAccount = grecaptcha.render("recaptchaCreateAccount", {
    sitekey: siteKey,
    size: "invisible",
    callback: function (token) {
      $("#menu-error-create-account").hide();
      $('#menu-create-account input[type="submit"]').prop("disabled", true);
      var email = $('#menu-create-account input[name="email"]').val();
      var pass1 = $('#menu-create-account input[name="password1"]').val();
      var pass2 = $('#menu-create-account input[name="password2"]').val();
      var flags = _rcFlags["idRCCreateAccount"];

      $.post(
        "/api/user/register",
        {
          email: email,
          password: pass1,
          accountType: "browserling",
          widget1: true,
          recaptcha: token,
          flags: flags,
        },
        function (data) {
          if (/^error/i.test(data)) {
            $('#menu-create-account input[type="submit"]').prop(
              "disabled",
              false
            );
            $("#menu-error-create-account").text(data);
            $("#menu-error-create-account").show();
          } else {
            window.location.reload();
          }
        }
      );
    },
    "expired-callback": function () {
      $('#menu-create-account input[type="submit"]').prop("disabled", false);
      $("#menu-error-create-account").text(
        "Recaptcha expired. Please try again."
      );
      $("#menu-error-create-account").show();

      var flags = _rcFlags["idRCCreateAccount"];
      $.post(
        "/api/user/rc-exp-err",
        {
          action: "register",
          experr: "exp",
          flags: flags,
        },
        function () {}
      );
    },
    "error-callback": function () {
      $('#menu-create-account input[type="submit"]').prop("disabled", false);
      $("#menu-error-create-account").text(
        "Recaptcha error. Please try again."
      );
      $("#menu-error-create-account").show();

      var flags = _rcFlags["idRCCreateAccount"];
      $.post(
        "/api/user/rc-exp-err",
        {
          action: "register",
          experr: "err",
          flags: flags,
        },
        function () {}
      );
    },
  });
  idRCForgotPassword = grecaptcha.render("recaptchaForgotPassword", {
    sitekey: siteKey,
    size: "invisible",
    callback: function (token) {
      $("#menu-error-forgot-password").hide();
      $('#menu-forgot-password input[type="submit"]').prop("disabled", true);
      var email = $('#menu-forgot-password input[name="email"]').val();
      var flags = _rcFlags["idRCForgotPassword"];

      $.post(
        "/api/user/forgot-password",
        {
          email: email,
          widget1: true,
          recaptcha: token,
          flags: flags,
        },
        function (data) {
          if (/^error/i.test(data)) {
            $('#menu-forgot-password input[type="submit"]').prop(
              "disabled",
              false
            );
            $("#menu-error-forgot-password").text(data);
            $("#menu-error-forgot-password").show();
          } else {
            $("#menu-ok-forgot-password").show();
          }
        }
      );
    },
    "expired-callback": function () {
      $('#menu-forgot-password input[type="submit"]').prop("disabled", false);
      $("#menu-error-forgot-password").text(
        "Recaptcha expired. Please try again."
      );
      $("#menu-error-forgot-password").show();

      var flags = _rcFlags["idRCForgotPassword"];
      $.post(
        "/api/user/rc-exp-err",
        {
          action: "reset-pass",
          experr: "exp",
          flags: flags,
        },
        function () {}
      );
    },
    "error-callback": function () {
      $('#menu-forgot-password input[type="submit"]').prop("disabled", false);
      $("#menu-error-forgot-password").text(
        "Recaptcha error. Please try again."
      );
      $("#menu-error-forgot-password").show();

      var flags = _rcFlags["idRCForgotPassword"];
      $.post(
        "/api/user/rc-exp-err",
        {
          action: "reset-pass",
          experr: "err",
          flags: flags,
        },
        function () {}
      );
    },
  });

  if (document.querySelector("#pricing")) {
    // these two captchas are only initialized on the main page for the pricing widget
    idRCSignInPricing = grecaptcha.render("recaptchaSignInPricing", {
      sitekey: siteKey,
      size: "invisible",
      callback: function (token) {
        var backSide = Site.pricing.currentBackSide;
        var plan = Site.pricing.currentPlan;
        var actionText = Site.pricing.currentActionText;
        var which = Site.pricing.currentWhich;

        Site.pricing.hideLoginError(plan);
        actionText.textContent = Site.pricing.lang.SIGNING_IN_ACTION;

        var loginWrapper = backSide.querySelector(
          ".plan-side-scroll.scroll-auth .auth-login"
        );
        var email = loginWrapper.querySelector(".plan-auth-email").value;
        var password = loginWrapper.querySelector(".plan-auth-password").value;
        var flags = _rcFlags["idRCSignInPricing"];
        var fromPricingWidget = true;

        Site.account.login(
          email,
          password,
          token,
          flags,
          fromPricingWidget,
          function (status, response) {
            if (status != 200) {
              Site.pricing.showLoginError(
                plan,
                Site.pricing.lang.GENERIC_SERVER_ERROR
              );
              actionText.textContent = Site.pricing.lang.SIGN_IN_ACTION;
              return;
            }
            try {
              var json = JSON.parse(response);
              if (json.success) {
                window.session.email = email;
                window.session.plan = json.plan;

                var planWeight = {
                  developer: 1,
                  team: 2,
                };

                var chosenPlan = planWeight[which];
                var usersPlan = planWeight[json.plan];

                Site.pricing.hideLoginError(plan);

                if (usersPlan >= chosenPlan) {
                  Site.pricing.getBack();
                } else {
                  Site.pricing.setPlanState(plan, "payment");
                }

                Site.pricing.updatePlan(plan);
              } else {
                Site.pricing.showLoginError(plan, json.error);
                actionText.textContent = Site.pricing.lang.SIGN_IN_ACTION;
                return;
              }
            } catch (e) {
              Site.pricing.showLoginError(
                plan,
                Site.pricing.lang.JSON_LOGIN_PARSE_ERROR
              );
              actionText.textContent = Site.pricing.lang.SIGN_IN_ACTION;
              return;
            }
          }
        );
      },
      "expired-callback": function () {
        var plan = Site.pricing.currentPlan;
        var actionText = Site.pricing.currentActionText;

        Site.pricing.showLoginError(
          plan,
          "Recaptcha expired. Please try again."
        );
        actionText.textContent = Site.pricing.lang.SIGN_IN_ACTION;

        var flags = _rcFlags["idRCSignInPricing"];
        $.post(
          "/api/user/rc-exp-err",
          {
            action: "login-pricing",
            experr: "exp",
            flags: flags,
          },
          function () {}
        );
      },
      "error-callback": function () {
        var plan = Site.pricing.currentPlan;
        var actionText = Site.pricing.currentActionText;

        Site.pricing.showLoginError(
          plan,
          "Recaptcha rerror. Please try again."
        );
        actionText.textContent = Site.pricing.lang.SIGN_IN_ACTION;

        var flags = _rcFlags["idRCSignInPricing"];
        $.post(
          "/api/user/rc-exp-err",
          {
            action: "login-pricing",
            experr: "err",
            flags: flags,
          },
          function () {}
        );
      },
    });
    idRCCreateAccountPricing = grecaptcha.render(
      "recaptchaCreateAccountPricing",
      {
        sitekey: siteKey,
        size: "invisible",
        callback: function (token) {
          var backSide = Site.pricing.currentBackSide;
          var plan = Site.pricing.currentPlan;
          var actionText = Site.pricing.currentActionText;

          Site.pricing.hideRegisterError(plan);
          actionText.textContent = Site.pricing.lang.REGISTERING_ACTION;

          var registerWrapper = backSide.querySelector(
            ".plan-side-scroll.scroll-auth .auth-register"
          );
          var email = registerWrapper.querySelector(".plan-auth-email").value;
          var password1 = registerWrapper.querySelector(
            ".plan-auth-password"
          ).value;
          var password2 = registerWrapper.querySelector(
            ".plan-auth-confirm-password"
          ).value;
          var flags = _rcFlags["idRCCreateAccountPricing"];
          var fromPricingWidget = true;

          Site.account.register(
            email,
            password1,
            password2,
            token,
            flags,
            fromPricingWidget,
            function (status, response) {
              if (status != 200) {
                Site.pricing.showRegisterError(
                  plan,
                  Site.pricing.lang.GENERIC_SERVER_ERROR
                );
                actionText.textContent = Site.pricing.lang.REGISTER_ACTION;
                return;
              }
              if (/^error/i.test(response)) {
                Site.pricing.showRegisterError(plan, response);
                actionText.textContent = Site.pricing.lang.REGISTER_ACTION;
                return;
              } else {
                window.session.email = email;
                Site.pricing.hideRegisterError(plan);
                Site.pricing.setPlanState(plan, "payment");
                setTimeout(function () {
                  Site.pricing.updatePlan(plan);
                }, 10);
              }
            }
          );
        },
        "expired-callback": function () {
          var plan = Site.pricing.currentPlan;
          var actionText = Site.pricing.currentActionText;

          Site.pricing.showRegisterError(
            plan,
            "Recaptcha expired. Please try again."
          );
          actionText.textContent = Site.pricing.lang.REGISTER_ACTION;

          var flags = _rcFlags["idRCCreateAccountPricing"];
          $.post(
            "/api/user/rc-exp-err",
            {
              action: "register-pricing",
              experr: "exp",
              flags: flags,
            },
            function () {}
          );
        },
        "error-callback": function () {
          var plan = Site.pricing.currentPlan;
          var actionText = Site.pricing.currentActionText;

          Site.pricing.showRegisterError(
            plan,
            "Recaptcha rerror. Please try again."
          );
          actionText.textContent = Site.pricing.lang.REGISTER_ACTION;

          var flags = _rcFlags["idRCCreateAccountPricing"];
          $.post(
            "/api/user/rc-exp-err",
            {
              action: "register-pricing",
              experr: "err",
              flags: flags,
            },
            function () {}
          );
        },
      }
    );
  }
};
