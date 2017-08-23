(function(window, vjs){
'use strict';
var volume_icon_svg = '<svg height="100%" width="100%" viewBox="0 0 36 36">'
    +'<defs><clipPath id="{vjs-volume-mask1}">'
    +'<path d="m 14.35,-0.14 -5.86,5.86 20.73,20.78 5.86,-5.91 z"></path>'
    +'<path d="M 7.07,6.87 -1.11,15.33 19.61,36.11 27.80,27.60 z"></path>'
    +'<path class="vjs-volume-mask" d="M 9.09,5.20 6.47,7.88 26.82,28.77 '
    +'29.66,25.99 z"></path></clipPath><clipPath id="{vjs-volume-mask2}">'
    +'<path class="vjs-volume-mask" d="m -11.45,-15.55 -4.44,4.51 20.45,20.94 '
    +'4.55,-4.66 z"></path></clipPath></defs>'
    +'<g clip-path="url(#{vjs-volume-mask1})"><path d="M8,21 L12,21 L17,26 '
    +'L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 '
    +'21.5,18 C21.5,16.26 20.48,14.74 19,14 Z"></path>'
    +'<path class="volume-level-2" d="M19,11.29 C21.89,12.15 24,'
    +'14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 '
    +'26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z"></path></g>'
    +'<path clip-path="url(#{vjs-volume-mask2})" d="M 9.25,9 7.98,10.27 '
    +'24.71,27 l 1.27,-1.27 Z"></path>'
    +'</svg>';
var fullscreen_svg = '<svg height="100%" width="100%" viewBox="0 0 36 36">'
    +'<g><path d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z"/></g>'
    +'<g><path d="m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z"/></g>'
    +'<g><path d="m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z"/></g>'
    +'<g><path d="M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z"/></g>'
    +'</svg>';
var exit_fullscreen_svg = '<svg height="100%" width="100%" viewBox="0 0 36 36">'
    +'<g><path d="m 20,26 2,0 0,-4 4,0 0,-2 -6,0 0,6 0,0 z"/></g>'
    +'<g><path d="m 10,22 4,0 0,4 2,0 0,-6 -6,0 0,2 0,0 z"/></g>'
    +'<g><path d="m 14,14 -4,0 0,2 6,0 0,-6 -2,0 0,4 0,0 z"/></g>'
    +'<g><path d="m 22,14 0,-4 -2,0 0,6 6,0 0,-2 -4,0 0,0 z"/></g>'
    +'</svg>';
var slider_gaps = '<div class="vjs-slider-gap-left"></div>'
    +'<div class="vjs-slider-gap-right"></div>';

function add_css(url, ver){
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', url+(ver ? '?'+ver : ''));
    document.getElementsByTagName('head')[0].appendChild(link);
}

var HolaSkin = function(player, opt){
    var _this = this;
    this.player = player;
    this.el = player.el();
    this.opt = opt;
    this.classes_added = [];
    player.on('dispose', function(){ _this.dispose(); });
    player.on('ready', function(){ _this.init(); });
    var resize = this._resize = this.resize.bind(this);
    player.on('resize', resize);
    player.on('fullscreenchange', function(){ setTimeout(resize); });
    window.addEventListener('resize', resize);
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
        if (this.player.addClass(c))
            this.classes_added.push(c);
    }
};

HolaSkin.prototype.resize = function(){
    if (!this.opt.no_vjs_large)
        this.player.toggleClass('vjs-large', this.el.offsetWidth>=768);
    this.player.toggleClass('vjs-small', this.el.offsetWidth<=480);
};

HolaSkin.prototype.init = function(){
    var _this = this;
    var player = this.player;
    this.has_played = false;
    var play_el = player.controlBar.playToggle.el();
    play_el.appendChild(vjs.createEl('div', {className: 'vjs-button-icon'}));
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
    var control_bar = player.controlBar;
    var progress_holder = control_bar.progressControl.seekBar.el();
    progress_holder.insertAdjacentHTML('beforeend', slider_gaps);
    player.addChild('PlayAnimation');
    var volume_btn = control_bar.volumeMenuButton;
    var volume_slider = volume_btn.volumeBar.el();
    volume_slider.insertAdjacentHTML('beforeend', slider_gaps);
    volume_btn.on('mouseenter', function(){
        volume_btn.addClass('vjs-show-volume-button'); });
    control_bar.on('mouseleave', function(){
        volume_btn.removeClass('vjs-show-volume-button'); });
    var spacer_el = control_bar.customControlSpacer.el();
    control_bar.on('mousemove', function(e){
        var r = spacer_el.getBoundingClientRect();
        if (e.clientX>r.left || e.clientY<r.top)
            volume_btn.removeClass('vjs-show-volume-button');
    });
};

HolaSkin.prototype.update_state = function(player){
    var replay_classname = 'vjs-play-control-replay';
    player.controlBar.playToggle.toggleClass(replay_classname, this.is_ended);
    player.bigPlayButton.toggleClass(replay_classname, this.is_ended);
    player.toggleClass('vjs-pos-ended', this.is_ended && this.has_played);
    player.toggleClass('vjs-pos-started', this.has_played);
};

HolaSkin.prototype.dispose = function(){
    while (this.classes_added.length)
        this.player.removeClass(this.classes_added.pop());
    window.removeEventListener('resize', this._resize);
};

var MenuButton = vjs.getComponent('MenuButton');
var VolumeMenuButton = vjs.getComponent('VolumeMenuButton');
VolumeMenuButton.prototype.createEl = function(){
    var el = MenuButton.prototype.createEl.call(this);
    var id = this.player_.id();
    var svg = volume_icon_svg
        .replace(/{vjs-volume-mask1}/g, 'vjs-volume-mask1_'+id)
        .replace(/{vjs-volume-mask2}/g, 'vjs-volume-mask2_'+id);
    var icon = this.icon_ = vjs.createEl('div',
        {className: 'vjs-button-icon', innerHTML: svg});
    el.insertBefore(icon, el.firstChild);
    return el;
};
VolumeMenuButton.prototype.tooltipHandler = function(){
    return this.icon_;
};

var MuteToggle = vjs.getComponent('MuteToggle');
MuteToggle.prototype.update =
VolumeMenuButton.prototype.volumeUpdate = function(){
    var i, el = this.el_;
    var vol = !this.player_.muted() && this.player_.volume();
    var level = !vol ? 0 : vol<0.5 ? 1 : 2;
    var text = this.player_.muted() ? 'Unmute' : 'Mute';
    if (this.controlText() != text)
        this.controlText(text);
    for (i = 0; i < 2; i++)
        vjs.toggleClass(el, 'vjs-vol-'+i, i==level);
    var start = window.performance && window.performance.now();
    var masks = el.querySelectorAll('.vjs-volume-mask');
    var from = vol ? 20 : 0, to = vol ? 0 : 20;
    var curr = masks[0].getAttribute('transform');
    var m = curr && curr.match(/translate\((\d*)/);
    if (m && m[1]==to)
        return;
    var animate = function(time){
        var v = from + (to-from) * Math.min((time-start)/250, 1);
        for (i = 0; i < masks.length; i++)
            masks[i].setAttribute('transform', 'translate('+v+','+v+')');
        if (v!=to)
            window.requestAnimationFrame(animate);
    };
    if (!start || !window.requestAnimationFrame)
        return void animate();
    window.requestAnimationFrame(animate);
};

var Button = vjs.getComponent('Button');
var FullscreenToggle = vjs.getComponent('FullscreenToggle');
FullscreenToggle.prototype.controlText_ = 'Full screen';
FullscreenToggle.prototype.createEl = function(){
    var el = Button.prototype.createEl.call(this);
    el.insertBefore(vjs.createEl('div', {
        className: 'vjs-button-icon vjs-fullscreen-icon',
        innerHTML: fullscreen_svg,
    }), el.firstChild);
    el.insertBefore(vjs.createEl('div', {
        className: 'vjs-button-icon vjs-exit-fullscreen-icon',
        innerHTML: exit_fullscreen_svg,
    }), el.firstChild);
    return el;
};
FullscreenToggle.prototype.updateHint = function(){
    this.controlText(this.player_.isFullscreen() ? 'Exit full screen' :
        'Full screen');
};

vjs.registerComponent('ControlsWatermark', vjs.extend(Button, {
    constructor: function(player, opt){
        Button.apply(this, arguments);
    },
    createEl: function(){
        var opt = this.options_;
        var el = vjs.createEl('div', {className: 'vjs-controls-watermark'});
        if (!opt.image)
            return el;
        var container = opt.url ? vjs.createEl('a', {href: opt.url,
            target: '_blank'}) : el;
        if (opt.url)
            el.insertBefore(container, el.firstChild);
        container.appendChild(vjs.createEl('img', {src: opt.image}));
        return el;
    },
    buildCSSClass: function(){
        return 'vjs-controls-watermark '+
            Button.prototype.buildCSSClass.apply(this, arguments);
    }
}));

var SeekBar = vjs.getComponent('SeekBar');
var orig_createEl = SeekBar.prototype.createEl;
SeekBar.prototype.createEl = function(){
    var el = orig_createEl.call(this);
    el.appendChild(vjs.createEl('div', {className: 'vjs-slider-padding'}));
    return el;
};

var ControlBar = vjs.getComponent('ControlBar');
var controlbar_createEl = ControlBar.prototype.createEl;
ControlBar.prototype.createEl = function(){
    var el = controlbar_createEl.call(this);
    el.appendChild(vjs.createEl('div', {className: 'vjs-gradient'}));
    return el;
};

var Component = vjs.getComponent('Component');
vjs.registerComponent('PlayAnimation', vjs.extend(Component, {
    constructor: function(player, opt){
        Component.apply(this, arguments);
        var _this = this, timeout;
        player.on(['videoclick'], function(){
            if (!player.hasStarted())
                return;
            _this.el_.style.display = 'block';
            _this.clearTimeout(timeout);
            timeout = _this.setTimeout(function(){
                _this.el_.style.display = '';
            }, 500);
        });
    },
    createEl: function(){
        var el = Component.prototype.createEl.apply(this, arguments);
        el.className = 'vjs-play-animation';
        return el;
    },
}));

var LoadingSpinner = vjs.getComponent('LoadingSpinner');
var spinner_createEl = LoadingSpinner.prototype.createEl;
LoadingSpinner.prototype.createEl = function(){
    var el = spinner_createEl.call(this);
    var rotator = vjs.createEl('div', {className: 'vjs-spinner-rotator'});
    rotator.appendChild(vjs.createEl('div', {className: 'vjs-spinner-left'}));
    rotator.appendChild(vjs.createEl('div', {className: 'vjs-spinner-right'}));
    el.appendChild(rotator);
    return el;
};

var defaults = {
    className: 'vjs5-hola-skin',
    css: '/css/videojs-hola-skin.css',
    ver: 'ver={[version]}'
};

vjs.plugin('hola_skin', function(options){
    if (options === false)
        options = {css: false, className: false};
    var opt = vjs.mergeOptions(defaults, options);
    if (opt.css && (!options.className || options.css))
        add_css(opt.css, opt.ver);
    new HolaSkin(this, opt);
});

}(window, window.videojs));
