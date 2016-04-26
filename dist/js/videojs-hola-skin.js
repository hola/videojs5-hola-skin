(function(window, vjs){
'use strict';

// helpers

function add_css(url, ver){
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', url+(ver ? '?'+ver : ''));
    document.getElementsByTagName('head')[0].appendChild(link);
}

function get_class_name(element){
    return element.className.split(/\s+/g);
}

function add_class_name(element, class_name){
    var classes = get_class_name(element);
    if (classes.indexOf(class_name)==-1)
    {
        classes.push(class_name);
        element.className = classes.join(' ');
        return true;
    }
    return false;
}

function remove_class_name(element, class_name){
    var classes = get_class_name(element);
    var class_index = classes.indexOf(class_name);
    if (class_index>=0)
    {
        classes.splice(class_index, 1);
        element.className = classes.join(' ');
    }
}

// main skin code

var HolaSkin = function(video, opt){
    var _this = this;
    this.vjs = video;
    this.el = video.el();
    this.opt = opt;
    this.intv = 0;
    this.stagger = 3;
    this.steptotal = 5;
    this.classes_added = [];
    this.vjs.on('dispose', function(){ _this.dispose(); });
    this.vjs.on('ready', function(){ _this.init(); });
    this.apply();
};

HolaSkin.prototype.apply = function(){
    var c, classes = [this.opt.className];
    if (this.opt.show_controls_before_start)
        classes.push('vjs-show-controls-before-start');
    while ((c = classes.shift()))
    {
        if (add_class_name(this.el, c))
            this.classes_added.push(c);
    }
};

// XXX michaelg: taken from mp_video.js but play mode adjusted 2px right
// play/pause curves and transform
var play1 = 'M 21.5,18 32,25 21.5,32 21.5,32 Z';
var play2 = 'M 19.5,18 22.5,18 22.5,32 19.5,32 Z';
var pause1 = 'M 21.5,18 24.5,25 24.5,25 21.5,32 Z';
var pause2 = 'M 27.5,18 30.5,18 30.5,32 27.5,32 Z';
var replay1 = ['M 889.68 166.32c-93.608-102.216-228.154-166.32',
    '-377.68-166.32-282.77 0-512 229.23-512 512h96c0-229.75 186.25-416 ',
    '416-416 123.020 0 233.542 53.418 309.696 138.306l-149.696 149.694',
    'h352v-352l-134.32 134.32z'].join('');
var replay2 = ['M 928 512c0 229.75-186.25 416-416 416-123.020 ',
    '0-233.542-53.418-309.694-138.306l149.694-149.694h-352v352l134.32',
    '-134.32c93.608 102.216 228.154 166.32 377.68 166.32 282.77 0 512',
    '-229.23 512-512h-96z'].join('');
var morph_html = [
    '<svg height="3em" width="3em" viewBox="10 10 30 30">',
        '<g id="move">',
            '<g id="morph">',
                '<path d="M 19.5,18 22.5,18 22.5,32 19.5,32 Z"/>',
                '<path d="M 27.5,18 30.5,18 30.5,32 27.5,32 Z"/>',
            '</g>',
            '<use xlink:href="#morph" x="-23" y="0"/>',
        '</g>',
    '</svg>'].join('');
var umorph_html = [
    '<svg width="100%" height="100%" viewBox="5 5 40 40">',
        '<use id="umorph" xlink:href="#morph" x="0" y="0"/>',
    '</svg>'].join('');

HolaSkin.prototype.set_play_button_state = function(btn_svg, paused, ended){
    var intv = this.intv;
    var _this = this;
    var steptotal = this.steptotal;
    var stagger = this.stagger;
    function mk_transition(from, to, steps){
        return (function(){
            var start = parseFloat(from);
            var delta = (parseFloat(to)-start)/parseFloat(steps);
            return (function(){ return start += delta; });
        }());
    }
    function mk_transform(from_path, to_path, steps){
        var path1pts = from_path.split(' ').slice(1, -1);
        var path2pts = to_path.split(' ').slice(1, -1);
        return (function(){
            var pathgen = path1pts.map(function(coord, index){
                return coord.split(',').map(function(fld, idx){
                    return mk_transition(fld,
                        path2pts[index].split(',')[idx], steps);
                });
            });
            return (function(){
                return pathgen.reduce(function(prev, curr){
                    return prev+' '+curr.reduce(function(prv, crr){
                        return prv()+','+crr();
                    });
                }, 'M')+' Z';
            });
        }());
    }
    var bars = btn_svg.getElementsByTagName('path');
    var stepcnt = 0, stepcnt1 = 0;
    if (intv)
        clearInterval(intv);
    if (ended)
    {
        bars[1].setAttribute('d', replay1);
        bars[1].setAttribute('transform',
            'scale(0.012) translate(1560, 1560)');
        bars[0].setAttribute('d', replay2);
        bars[0].setAttribute('transform',
            'scale(0.012) translate(1560, 1560)');
        return;
    }
    bars[1].removeAttribute('transform');
    bars[0].removeAttribute('transform');
    if (paused)
    {
        var mk_path3 = mk_transform(play2, play1, steptotal);
        var mk_path4 = mk_transform(pause2, pause1, steptotal);
        this.intv = setInterval(function(){
            if (stepcnt < steptotal)
                bars[1].setAttribute('d', mk_path4());
            if (stepcnt >= stagger)
                bars[0].setAttribute('d', mk_path3());
            stepcnt++;
            if (stepcnt >= steptotal+stagger)
            {
                clearInterval(_this.intv);
                _this.intv = 0;
            }
        }, 20);
    }
    else
    {
        var mk_path1 = mk_transform(play1, play2, steptotal);
        var mk_path2 = mk_transform(pause1, pause2, steptotal);
        this.intv = setInterval(function(){
            if (stepcnt < steptotal)
                bars[0].setAttribute('d', mk_path1());
            if (stepcnt >= stagger)
                bars[1].setAttribute('d', mk_path2());
            stepcnt++;
            if (stepcnt >= steptotal+stagger)
            {
                clearInterval(_this.intv);
                _this.intv = 0;
            }
        }, 20);
    }
};

HolaSkin.prototype.init = function(){
    var _this = this;
    var player = this.vjs;
    // play button special treatment: both buttons share a single shape
    // that's how it is morphed simultaneously
    if (!!this.opt.no_play_transform)
    {
        this.steptotal = 1;
        this.stagger = 0;
    }
    var play_button = player.controlBar.playToggle.el();
    play_button.insertAdjacentHTML('beforeend', morph_html);
    player.bigPlayButton.el().insertAdjacentHTML('beforeend', umorph_html);
    var morph = document.getElementById('morph');
    player.on('play', function(){
        _this.set_play_button_state(morph, false);
    })
    .on('pause', function(){
        _this.set_play_button_state(morph, true);
    })
    .on('ended', function(){
        _this.set_play_button_state(morph, true, true);
    });
    _this.set_play_button_state(morph, player.paused());
};

HolaSkin.prototype.dispose = function(){
    while (this.classes_added.length)
        remove_class_name(this.el, this.classes_added.pop());
};

var defaults = {
    className: 'vjs5-hola-skin',
    css: '/css/videojs-hola-skin.css',
    ver: 'ver=0.0.2-1'
};

// VideoJS plugin register

vjs.plugin('hola_skin', function(options){
    var opt = vjs.mergeOptions(defaults, options);
    if (opt.css && (!options.className || options.css))
        add_css(opt.css, opt.ver);
    new HolaSkin(this, opt);
});

}(window, window.videojs));
