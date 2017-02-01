window.MathJax = {
    /* load MathML extension */
    extensions: ["mml2jax.js"],

    /* configure input and output */
    jax: ["input/TeX", "input/MathML", "output/HTML-CSS"],

    /* align display equations to the center */
    displayAlign: "center",

    /* set zoom trigger */
    menuSettings: {
        zoom: "Click"
    },

    /* configuration of the tex2jax preprocessor:
     - set delimiters for inline and display equations
     - preview while equations are processed is "TeX"
     - allow \$ to represent a literal dollar sign
     */
    tex2jax: {
        inlineMath: [ ["\\(","\\)"] ],
        displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
        preview: ["TeX"],
        processEscapes: true
    },

    /* configuration of the mml2jax preprocessor:
     - preview while equations are processed is "MathML"
     */
    mml2jax: {
        preview: ["MathML"]
    },

    /* configuration of the HTML-CSS output processor:
     - available fonts are STIX and TeX
     - preferred font is STIX
     - use TeX as web-based font if none of the above is available on the user's computer
     - use TeX font for image fallback mode
     */
    "HTML-CSS": {
        EqnChunk: 500,
        EqnChunkFactor: 1,
        EqnChunkDelay: 1000,
        availableFonts: ["STIX", "TeX"],
        preferredFont: ["STIX"],
        webFont: ["TeX"],
        imageFont: ["TeX"],
        styles: {
            '.MathJax_Display': {
                "margin": 0
            },
            '#MathJax_Message': {
                "margin": 0
            }
        }
    },
    TeX: {

        TagSide: "right",

        Macros: {
            bgroup: '{\\unicode{x007B}}',

            egroup: '{\\unicode{x007D}}',

            enskip: '{\\enspace}',

            parbox: ['\\mbox{#2}',2],

            upvarepsilon: '{\\unicode{x03B5}}',

            ss: '{\\unicode{x1E9E}}',

            textregistered: '{\\unicode{0x00AE}}',

            upvartheta: '{\\unicode{x03D1}}',

            Upvartheta: '{\\unicode{x03F4}}',

            Upgamma: '{\\unicode{x0393}}',

            upgamma: '{\\unicode{x03B3}}',

            Updelta: '{\\unicode{x0394}}',

            updelta: '{\\unicode{x03B4}}',

            Uptheta: '{\\unicode{x0398}}',

            uptheta: '{\\unicode{x03B8}}',

            Upkappa: '{\\unicode{x039A}}',

            upkappa: '{\\unicode{x03BA}}',

            Uplambda: '{\\unicode{x039B}}',

            uplambda: '{\\unicode{x03BB}}',

            Upsigma: '{\\unicode{x03A3}}',

            upsigma: '{\\unicode{x03C3}}',

            Upmu: '{\\unicode{x039C}}',

            upmu: '{\\unicode{x03BC}}',

            Upiota: '{\\unicode{x0399}}',

            upiota: '{\\unicode{x03B9}}',

            Upnu: '{\\unicode{x039D}}',

            upnu: '{\\unicode{x03BD}}',

            Upxi: '{\\unicode{x039E}}',

            upxi: '{\\unicode{x03BE}}',

            Upomicron: '{\\unicode{x039F}}',

            upomicron: '{\\unicode{x03BF}}',

            Uppi: '{\\unicode{x03A0}}',

            uppi: '{\\unicode{x03C0}}',

            Uprho: '{\\unicode{x03A1}}',

            uprho: '{\\unicode{x03C1}}',

            Uptau: '{\\unicode{x03A4}}',

            uptau: '{\\unicode{x03C4}}',

            Upupsilon: '{\\unicode{x03A5}}',

            upupsilon: '{\\unicode{x03C5}}',

            Upphi: '{\\unicode{x03A6}}',

            upphi: '{\\unicode{x03C6}}',

            Upchi: '{\\unicode{x03A7}}',

            upchi: '{\\unicode{x03C7}}',

            Uppsi: '{\\unicode{x03A8}}',

            uppsi: '{\\unicode{x03C8}}',

            Upomega: '{\\unicode{x03A9}}',

            upomega: '{\\unicode{x03C9}}',

            upalpha: '{\\unicode{x03B1}}',

            upbeta: '{\\unicode{x03B2}}',

            upepsilon: '{\\unicode{x03B5}}',

            upzeta: '{\\unicode{x03B6}}',

            upeta: '{\\unicode{x03B7}}',

            permille: '{\\unicode{x2030}}',

            hfill: '{\\enspace\\enspace}',

            copyright: '{\\unicode{x00A9}}',

            dag: '{\\unicode{x2020}}',

            ddag: '{\\unicode{x2021}}',

            ointop: '{\\unicode{0x222E}}',

            P: '{\\unicode{0x00B6}}',

            lhook: '{\\hookrightarrow}',

            rhook: '{\\hookleftarrow}',

            fancyscript: ['{\\scr #1}', 1],

            varvec: ['\\pmb{#1}', 1]

        }
    },
    /* configuration of the math menu:
     - allow the user to select what font to use
     */
    MathMenu: {
        showFontMenu: true
    }
};