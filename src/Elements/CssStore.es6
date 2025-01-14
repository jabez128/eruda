import util from '../util'

function formatStyle(style)
{
    var ret = {};

    for (var i = 0, len = style.length; i < len; i++)
    {
        var name = style[i];

        if (style[name] === 'initial') continue;

        ret[name] = style[name];
    }

    return ret;
}

var elProto = Element.prototype;

var matchesSel = function (el, selText) { return false };

if (elProto.webkitMatchesSelector)
{
    matchesSel = (el, selText) => el.webkitMatchesSelector(selText);
} else if (elProto.mozMatchesSelector)
{
    matchesSel = (el, selText) => el.mozMatchesSelector(selText);
}

export default class CssStore
{
    constructor(el)
    {
        this._el = el;
    }
    getComputedStyle()
    {
        var computedStyle = window.getComputedStyle(this._el);

        return formatStyle(computedStyle);
    }
    getMatchedCSSRules()
    {
        var ret = [];

        util.each(document.styleSheets, (styleSheet) =>
        {
            if (!styleSheet.cssRules) return;

            util.each(styleSheet.cssRules, (cssRule) =>
            {
                var matchesEl = false;

                // Mobile safari will throw DOM Exception 12 error, need to try catch it.
                try {
                    matchesEl = this._elMatchesSel(cssRule.selectorText);
                } catch (e) {}

                if (!matchesEl) return;

                ret.push({
                    selectorText: cssRule.selectorText,
                    style: formatStyle(cssRule.style)
                });
            });
        });

        return ret;
    }
    _elMatchesSel(selText)
    {
        return matchesSel(this._el, selText);
    }
};