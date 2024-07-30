$(function () {
  document.location.hash == "#subscribe" &&
    $(function () {
      setTimeout(function () {
        $('#web-subscribe-body input[name="email"]').is(":focus") ||
          $('#web-subscribe-body input[name="email"]').focus();
      }, 500);
    }),
    $("#web-subscribe2 button").click(function () {
      function e() {
        for (var b = 0; b < 3; b++)
          $("#web-subscribe-body").animate(
            {
              "margin-left": "-=15",
            },
            50
          ),
            $("#web-subscribe-body").animate(
              {
                "margin-left": "+=15",
              },
              50
            );
      }
      var i = $('#web-subscribe2 input[name="email"]').val();
      if (((i = i.replace(/^\s+/, "").replace(/\s+$/, "")), i.length == 0)) {
        e();
        return;
      }
      if (!/.+@.+\..+/.test(i)) {
        e();
        return;
      }
      $.post(
        "/api/web-subscribe",
        {
          email: i,
        },
        function (b) {
          /^error/i.test(b)
            ? ($("#web-subscribe-error").text(b), e())
            : ($("#web-subscribe-body").hide(),
              $("#web-subscribe-error").hide(),
              $("#web-subscribe-title").text(
                "Thanks for subscribing to our updates!"
              ),
              $("#web-subscribe-extra-message").text(b),
              $("#web-subscribe-extra-message").fadeIn());
        }
      );
    }),
    $("#web-subscribe2 input").keypress(function (e) {
      e.which == 13 && $("#web-subscribe2 button").click();
    });
  var s = !1;
  $("#web-subscribe2 input").focus(function (e) {
    s ||
      ($.post("/api/ui-event", {
        event: "web-email-subscribe-focus",
      }),
      (s = !0));
  }),
    $(".fffff").click(function (e) {
      console.log("a"),
        window.open("https://facebook.com/browserling", "_blank");
    });
  try {
    console.log(
      "%c " +
        "Lbh'ir sbhaq n frperg! Hfr pbhcba pbqr PBAFBYRUNPXRE gb trg n qvfpbhag!".replace(
          /[a-zA-Z]/g,
          function (e) {
            return String.fromCharCode(
              (e <= "Z" ? 90 : 122) >= (e = e.charCodeAt(0) + 13) ? e : e - 26
            );
          }
        ),
      "color: rgb(180,180,180)"
    );
  } catch (e) {}
});
