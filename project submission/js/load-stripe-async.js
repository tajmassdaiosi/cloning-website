$(function () {
  if (loadStripeAsync) {
    setTimeout(function () {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "https://js.stripe.com/v3/";

      script.addEventListener("load", function () {});

      document.body.appendChild(script);
    }, 1000);
  }
});
