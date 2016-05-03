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
var replay = 'M8.661,0.001c0.006,0,0.01,0,0.01,0c0.007,0,0.007,0,0.011,'
    +'0c0.002,0,0.007,0,0.009,0 c0,0,0,0,0.004,0c0.019-0.002,0.027,0,0.'
    +'039,0c2.213,0,4.367,0.876,5.955,2.42l1.758-1.776c0.081-0.084,0.209'
    +'-0.11,0.314-0.065c0.109,0.044,0.186,0.152,0.186,0.271l-0.294,6.066h'
    +'-5.699c-0.003,0-0.011,0-0.016,0c-0.158,0-0.291-0.131-0.291-0.296 '
    +'c0-0.106,0.059-0.201,0.146-0.252l1.73-1.751c-1.026-0.988-2.36-1.529'
    +'-3.832-1.529c-2.993,0.017-5.433,2.47-5.433,5.51 c0.023,2.978,2.457,'
    +'5.4,5.481,5.422c1.972-0.106,3.83-1.278,4.719-3.221l2.803,1.293l-0.019'
    +',0.039 c-1.92,3.713-4.946,5.277-8.192,4.944c-4.375-0.348-7.848-4.013'
    +'-7.878-8.52C0.171,3.876,3.976,0.042,8.661,0.001z';
var morph_html = [
    '<svg height="3em" width="3em" viewBox="10 10 30 30">',
        '<g id="move">',
            '<g id="morph">',
                '<path d="M 19.5,18 22.5,18 22.5,32 19.5,32 Z"/>',
                '<path d="M 27.5,18 30.5,18 30.5,32 27.5,32 Z"/>',
            '</g>',
            '<use xlink:href="#morph" x="-30" y="0"/>',
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
        bars[0].setAttribute('transform', 'translate(16.3, 16.5)');
        bars[0].setAttribute('d', replay);
        bars[1].setAttribute('display', 'none');
        return;
    }
    bars[1].removeAttribute('display');
    var is_transformed = bars[0].getAttribute('transform');
    bars[0].removeAttribute('transform');
    // need to clear the attribute to avoid glitch with transition from
    // replay icon to animated pause icon
    if (is_transformed)
        bars[0].setAttribute('d', '');
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
    var volume_button = player.controlBar.volumeMenuButton.el();
    var volume_icon = document.createElement('div');
    volume_icon.setAttribute('class', 'vjs-volume-icon');
    volume_button.insertBefore(volume_icon, volume_button.firstChild);
};

HolaSkin.prototype.dispose = function(){
    while (this.classes_added.length)
        remove_class_name(this.el, this.classes_added.pop());
};

var defaults = {
    className: 'vjs5-hola-skin',
    css: '/css/videojs-hola-skin.css',
    ver: 'ver=0.0.2-11'
};

// VideoJS plugin register

vjs.plugin('hola_skin', function(options){
    var opt = vjs.mergeOptions(defaults, options);
    if (opt.css && (!options.className || options.css))
        add_css(opt.css, opt.ver);
    new HolaSkin(this, opt);
});

}(window, window.videojs));
