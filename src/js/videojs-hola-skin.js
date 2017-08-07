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

function toggle_class_name(element, class_name, add){
    if (add)
        add_class_name(element, class_name);
    else
        remove_class_name(element, class_name);
}

// main skin code

var HolaSkin = function(video, opt){
    var _this = this;
    this.vjs = video;
    this.el = video.el();
    this.opt = opt;
    this.classes_added = [];
    this.vjs.on('dispose', function(){ _this.dispose(); });
    this.vjs.on('ready', function(){ _this.init(); });
    this._resize = this.resize.bind(this);
    this.vjs.on('resize', this._resize);
    window.addEventListener('resize', this._resize);
    this.apply();
    this.resize();
};

HolaSkin.prototype.apply = function(){
    var c, classes = [this.opt.className];
    if (this.opt.show_controls_before_start)
        classes.push('vjs-show-controls-before-start');
    if (this.opt.show_time_for_live)
        classes.push('vjs-show-time-for-live');
    while (c = classes.shift())
    {
        if (add_class_name(this.el, c))
            this.classes_added.push(c);
    }
};

HolaSkin.prototype.resize = function(){
    if (!this.opt.no_vjs_large)
        toggle_class_name(this.el, 'vjs-large', this.el.offsetWidth>=768);
    toggle_class_name(this.el, 'vjs-small', this.el.offsetWidth<=480);
};

var volume_icon_svg = '<svg height="2.8em" width="2.8em" viewBox="-5 -7 30 30">'
    +'<polygon points="4,5 4,5 0,5 0,11 4,11 4,11 8,16 8,0"/>'
    +'<polygon class="volume-level-0" points="11.5,4 10,5.5 12.5,8 10,10.5 11.5,12 14,9.5 16.5,12 18,10.5 15.5,8 18,5.5 16.5,4 14,6.5"/>'
    +'<g>'
        +'<path class="volume-level-1" d="M10,4.6v6.9c1.2-0.7,2-2,2-3.4S11.2,5.2,10,4.6z"/>'
        +'<path class="volume-level-2" d="M16,8c0-2.2-0.9-4.2-2.3-5.6L12,3.6c1.2,1.1,2,2.7,2,4.4c0,1.8-0.8,3.3-2,4.4l1.7,1.2C15.1,12.2,16,10.2,16,8z"/>'
        +'<path class="volume-level-3" d="M16.9,0l-1.6,1.2C17,3,18,5.4,18,8c0,2.6-1,5-2.7,6.8l1.6,1.2c1.9-2.1,3.1-4.9,3.1-8C20,4.9,18.8,2.1,16.9,0z"/>'
    +'</g>'
+'</svg>';

var gap_name = 'vjs-slider-gap';
var slider_gaps = '<div class="'+gap_name+'-left"></div><div class="'+gap_name+'-right"></div>';

HolaSkin.prototype.init = function(){
    var _this = this;
    var player = this.vjs;
    this.has_played = false;
    var play_button = player.controlBar.playToggle.el();
    var icon = document.createElement('div');
    icon.className = 'vjs-button-icon';
    play_button.appendChild(icon);
    player.on('play', function(){
        _this.is_ended = false;
        _this.update_state(player);
    })
    .on('ended', function(){
        _this.is_ended = true;
        _this.update_state(player);
    })
    .on('seeking', function(){
        // hide replay button if it's not rewind to the start (cur time == 0)
        if (player.currentTime())
        {
            _this.is_ended = false;
            _this.has_played = true;
        }
        else
            _this.has_played = false;
        _this.update_state(player);
    })
    .on('timeupdate', function(val, t1, t2){
        var has_pos = !!player.currentTime();
        if (has_pos==_this.has_played)
            return;
        _this.has_played = has_pos;
        _this.update_state(player);
    });
    this.update_state(player);
    var volume_slider = player.controlBar.volumeMenuButton.volumeBar.el();
    volume_slider.insertAdjacentHTML('beforeend', slider_gaps);
    var progress_holder = player.controlBar.progressControl.seekBar.el();
    progress_holder.insertAdjacentHTML('beforeend', slider_gaps);
};

HolaSkin.prototype.update_state = function(player){
    var play_button = player.controlBar.playToggle.el();
    var big_play_button = player.bigPlayButton.el();
    var replay_classname = 'vjs-play-control-replay';
    toggle_class_name(play_button, replay_classname, this.is_ended);
    toggle_class_name(big_play_button, replay_classname, this.is_ended);
    toggle_class_name(player.el_, 'vjs-pos-ended',
        this.is_ended && this.has_played);
    toggle_class_name(player.el_, 'vjs-pos-started', this.has_played);
};

HolaSkin.prototype.dispose = function(){
    while (this.classes_added.length)
        remove_class_name(this.el, this.classes_added.pop());
    window.removeEventListener('resize', this._resize);
};

// update some vjs controls

var MenuButton = vjs.getComponent('MenuButton');
var VolumeMenuButton = vjs.getComponent('VolumeMenuButton');
VolumeMenuButton.prototype.createEl = function(){
    var el = MenuButton.prototype.createEl.call(this);
    var icon = this.icon_ = document.createElement('div');
    icon.setAttribute('class', 'vjs-button-icon');
    icon.innerHTML = volume_icon_svg;
    el.insertBefore(icon, el.firstChild);
    return el;
};

VolumeMenuButton.prototype.tooltipHandler = function(){
    return this.icon_;
};

var Button = vjs.getComponent('Button');
var FullscreenToggle = vjs.getComponent('FullscreenToggle');
FullscreenToggle.prototype.controlText_ = 'Full screen';
FullscreenToggle.prototype.createEl = function(){
    var el = Button.prototype.createEl.call(this);
    var icon = this.icon_ = document.createElement('div');
    icon.setAttribute('class', 'vjs-button-icon');
    el.insertBefore(icon, el.firstChild);
    return el;
};
FullscreenToggle.prototype.updateHint = function(){
    this.controlText(this.player_.isFullscreen() ? 'Exit full screen' :
        'Full screen');
};

var ControlsWatermark = vjs.extend(Button, {
    constructor: function(player, opt){
        Button.apply(this, arguments);
    },
    createEl: function(){
        var opt = this.options_;
        var el = Button.prototype.createEl.apply(this, arguments);
        if (!opt.src)
            return el;
        var img = document.createElement('img');
        img.src = opt.src;
        el.appendChild(img);
        return el;
    },
    buildCSSClass: function(){
        return 'vjs-controls-watermark '+
            Button.prototype.buildCSSClass.apply(this, arguments);
    }
});
vjs.registerComponent('ControlsWatermark', ControlsWatermark);

var SeekBar = vjs.getComponent('SeekBar');
var orig_createEl = SeekBar.prototype.createEl;
SeekBar.prototype.createEl = function(){
    var el = orig_createEl.call(this);
    el.appendChild(vjs.createEl('div', {className: 'vjs-slider-padding'}));
    return el;
};

var defaults = {
    className: 'vjs5-hola-skin',
    css: '/css/videojs-hola-skin.css',
    ver: 'ver={[version]}'
};

// VideoJS plugin register

vjs.plugin('hola_skin', function(options){
    if (options === false)
        options = {css: false, className: false};
    var opt = vjs.mergeOptions(defaults, options);
    if (opt.css && (!options.className || options.css))
        add_css(opt.css, opt.ver);
    new HolaSkin(this, opt);
});

}(window, window.videojs));
