MathJax.Hub.Register.StartupHook("TeX Jax Ready",

    function () {

      MathJax.InputJax.TeX.prefilterHooks.Add(function (data) {

          data.math = data.math.replace(/\\kern *-\\nulldelimiterspace/g, "");

          data.math = data.math.replace(/\\user2/g, "\\pmb");

          data.math = data.math.replace(/\\mapstochar/g, "\\mapsto");

          data.math = data.math.replace(/\s*<!\[CDATA\[\s*(.*)\s*\]\]>\s*/gm, "$1");

          data.math = data.math.replace(/{?\\ss}?/g, "ß");

          data.math = data.math.replace(/\\"a|{\\"a}|\\"{a}/g, "ä");

          data.math = data.math.replace(/\\"o|{\\"o}|\\"{o}/g, "ö");

          data.math = data.math.replace(/\\"u|{\\"u}|\\"{u}/g, "ü");

          data.math = data.math.replace(/\\parbox(\[\w\])?{(.*?)}{(.*?)\\\\ (.*?)}/g, "\\parbox{$2}{$3 $4}");

          data.math = data.math.replace(/\\vspace\*?{[^}]+}/g, "");

          data.math = data.math.replace(/\\text{\\small{([^}]+)}}/g, "\\scriptstyle{\\text{$1}}");

          data.math = data.math.replace(/\\text{\\footnotesize{([^}]+)}}/g, "\\scriptstyle{\\text{$1}}");

          data.math = data.math.replace(/\\text{\\scriptsize{([^}]+)}}/g, "\\scriptscriptstyle{\\text{$1}}");

          data.math = data.math.replace(/\\text{\\tiny{([^}]+)}}/g, "\\scriptscriptstyle{\\text{$1}}");

          data.math = data.math.replace(/\\textrm/g, "\\mathrm");

          data.math = data.math.replace(/\\bf{/g, "\\mathbf{");

          data.math = data.math.replace(/\\text\\EUR/g, "€");

          data.math = data.math.replace(/\\mathop ([^{]+?)\\limits/g, "\\mathop{$1}\\limits");

          data.math = data.math.replace(/{?\\ss}?/g, "ﬂ");

          data.math = data.math.replace(/\\"a|{\\"a}|\\"{a}/g, "‰");

          data.math = data.math.replace(/\\"o|{\\"o}|\\"{o}/g, "ˆ");

          data.math = data.math.replace(/\\"u|{\\"u}|\\"{u}/g, "¸");

          data.math = data.math.replace(/\\user1/g, "\\mathcal");

          data.math = data.math.replace(/\\(big|Big|bigg|Bigg) *{([^}]+)}/g, "\\$1$2");

          data.math = data.math.replace(/\\textsc *{([^}]+)}/g, "{\\rm ~#~$1~#~}");

          data.math = data.math.replace(/\\upvarphi/g, "\\varphi");

          data.math = data.math.replace(/\\llbracket/g, "⟦");

          data.math = data.math.replace(/\\rrbracket/g, "⟧");

          data.math = data.math.replace(/\\pounds/g, "£");

          data.math = data.math.replace(/\\raisebox *{-[^}]+}{\$(.+?)\$}/g, "_{$1}");

          data.math = data.math.replace(/\\raisebox *{[^}]+}{\$(.+?)\$}/g, "^{$1}");

          var reg = new RegExp("~#~(.*?)~#~", "g");
          var m;
          while (m = reg.exec(data.math)) {
              var result = "";
              for (var index = 0; index != m[1].length; index++) {
                  var char = m[1].substr(index, 1);
                  if (char.match(/[a-z]/)) {
                      result += "{\\small " + char.toUpperCase() + "}";
                  } else {
                      result += char;
                  }
              }
              data.math = data.math.replace(/~#~.*?~#~/, result);
          }
      });
    }
);