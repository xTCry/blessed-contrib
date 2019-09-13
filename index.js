
module.exports = function (blessed) {

    this.grid = require('./lib/layout/grid')
    this.carousel = require('./lib/layout/carousel')

    var widgets = [
        'map',
        'canvas',

        'gauge',
        'gauge-list',

        'lcd',
        'donut',
        'log',
        'picture',
        'reverselog',
        'sparkline',
        'table',
        'tree',
        'markdown',
    ];

    for (const widget of widgets) {
        var name = snakeToVar(widget);
        this[name] = (new (require(`./lib/widget/${widget}.js`))(blessed)).exports;
    }

    var widgetsCharts = [
        'bar',
        'stacked-bar',
        'line',
    ];
    for (const widget of widgetsCharts) {
        var name = snakeToVar(widget);
        this[name] = (new (require(`./lib/widget/charts/${widget}.js`))(blessed)).exports;
    }

    var serverUtils = new (require('./lib/server-utils'))(blessed);
    this.OutputBuffer = serverUtils.OutputBuffer
    this.InputBuffer = serverUtils.InputBuffer
    this.createScreen = serverUtils.createScreen
    this.serverError = serverUtils.serverError

}

function snakeToVar(str) {
    return str.split('-').map((part, i) => (i > 0) ? `${part.charAt(0).toUpperCase()}${part.slice(1)}` : part).join('');
}