var csso = require("csso");
var loaderUtils = require("loader-utils");

module.exports = function(content, map) {
    this.cacheable && this.cacheable();
    var queryString = this.query || "";
    var query = loaderUtils.parseQuery(this.query);
    var forceMinimize = query.minify;
    var minimize = typeof forceMinimize !== "undefined" ? !!forceMinimize : (this && this.minimize);
   
    if (minimize) {
        return csso.justDoIt(content, !!query.disableStructuralMinification);
    }
    return content;
}

