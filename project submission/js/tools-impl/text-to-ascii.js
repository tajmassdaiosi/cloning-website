$(function () {
  mkTool("text-to-ascii", function (n) {
    for (var o = [], r = 0; r < n.length; r++)
      for (var a = unescape(encodeURIComponent(n[r])), e = 0; e < a.length; e++)
        o.push(a[e].charCodeAt(0));
    for (var v = "", c = "%d ", r = 0; r < o.length; r++) {
      var d = o[r],
        f = d.toString(10),
        t = c;
      (t = t.replace(/%d/g, f)), (v += t);
    }
    return v;
  });
});
