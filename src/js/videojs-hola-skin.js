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
var play_button_svg = '<svg height="100%" width="100%" viewBox="0 14 96 68">'
    +'<path d="M96,44.3v7.3c-0.1,7.7-1,15.5-1,15.5s-0.9,6.6-3.8,9.5c-3.6,3.8-'
    +'7.7,3.8-9.6,4c-13.4,1-33.5,0.9-33.5,0.9 c-0.8,0-25-0.2-32.5-0.9c-2.1-0.4'
    +'-6.9-0.3-10.6-4.1c-2.9-2.9-3.8-9.5-3.8-9.5s-1-7.7-1.1-15.5v-7.3c0.2-7.8,'
    +'1.1-15.5,1.1-15.5 s0.9-6.6,3.8-9.5c3.6-3.8,7.7-3.8,9.6-4.1c13.4-1,33.5-'
    +'0.9,33.5-0.9s20.1-0.1,33.5,0.9c1.9,0.2,5.9,0.2,9.6,4.1 c2.9,2.9,3.8,9.5,'
    +'3.8,9.5S95.9,36.6,96,44.3z M38.3,61.4L64,47.9L38.3,34.4V61.4z"/>'
    +'<polygon points="64,47.9 38.3,61.4 38.3,34.4" fill="#fff"/>'
    +'</svg>';
var slider_gaps = '<div class="vjs-slider-gap-left"></div>'
    +'<div class="vjs-slider-gap-right"></div>';
var skin = '.vjs5-hola-skin';
var custom_css = skin+' .vjs-big-play-button:hover .vjs-button-icon {'
    +'    fill: @play_button_color;'
    +'}'
    +skin+':not(.vjs-ad-playing) .vjs-progress-control .vjs-play-progress,'
    +skin+' .vjs-progress-control .vjs-mouse-display:before,'
    +skin+' .vjs-progress-control .vjs-play-progress:before,'
    +skin+' .vjs-captions-toggle>.vjs-button-icon:after {'
    +'    background-color: @seek_bar_color;'
    +'}';

function add_css(url, ver){
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', url+(ver ? '?'+ver : ''));
    document.getElementsByTagName('head')[0].appendChild(link);
}

var Component = vjs.getComponent('Component');
var ControlBar = vjs.getComponent('ControlBar');
var Button = vjs.getComponent('Button');
var MenuButton = vjs.getComponent('MenuButton');
var VolumeMenuButton = vjs.getComponent('VolumeMenuButton');
var FullscreenToggle = vjs.getComponent('FullscreenToggle');
var BigPlayButton = vjs.getComponent('BigPlayButton');
var SeekBar = vjs.getComponent('SeekBar');
var LoadingSpinner = vjs.getComponent('LoadingSpinner');
var Tooltip = vjs.getComponent('Tooltip');
var patched = false;

function patch_controls_default(){
    if (patched)
        return;
    patched = true;
    var controlbar_createEl = ControlBar.prototype.createEl;
    ControlBar.prototype.createEl = function(){
        var el = controlbar_createEl.call(this);
        el.appendChild(vjs.createEl('div',
            {className: 'vjs-gradient vjs-bottom-gradient'}));
        return el;
    };
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
    BigPlayButton.prototype.createEl = function(){
        var el = Button.prototype.createEl.call(this);
        el.appendChild(vjs.createEl('div', {
            className: 'vjs-button-icon',
            innerHTML: play_button_svg,
        }));
        return el;
    };
    var orig_createEl = SeekBar.prototype.createEl;
    SeekBar.prototype.createEl = function(){
        var el = orig_createEl.call(this);
        el.appendChild(vjs.createEl('div', {className: 'vjs-slider-padding'}));
        return el;
    };
    var spinner_createEl = LoadingSpinner.prototype.createEl;
    LoadingSpinner.prototype.createEl = function(){
        var el = spinner_createEl.call(this);
        var rotator = vjs.createEl('div', {className: 'vjs-spinner-rotator'});
        rotator.appendChild(vjs.createEl('div', {
            className: 'vjs-spinner-left'}));
        rotator.appendChild(vjs.createEl('div', {
            className: 'vjs-spinner-right'}));
        el.appendChild(rotator);
        return el;
    };
    var tooltip_show = Tooltip.prototype.show;
    Tooltip.prototype.show = function(){
        if (this.timeout)
        {
            this.clearTimeout(this.timeout);
            this.timeout = 0;
        }
        return tooltip_show.apply(this, arguments);
    };
}

function get_ui_zoom(player){
    function clamp(zoom){
        // XXX alexeym: disable zoom < 1 because of wrong handling
        // for some elements
        return Math.max(1, zoom);
    }
    var scale = 1;
    if (player && !player.hasClass('vjs-ios-skin'))
        return player.ui_zoom = scale;
    var viewport = window.visualViewport;
    if (viewport&&viewport.scale)
        return player.ui_zoom = clamp(1/viewport.scale);
    var screen = window.screen;
    if (!screen)
        return player.ui_zoom = scale;
    var width_available = need_invert() ? screen.availHeight :
        screen.availWidth;
    if (width_available)
        scale = window.innerWidth/width_available;
    return player.ui_zoom = clamp(scale);
}

function patch_controls_ios(opt){
    if (patched)
        return;
    patched = true;
    var prefix = 'vjs-ios-';
    function init_control(player, el, icon, need_box){
        var bg = vjs.createEl('div', {className: prefix+'background-tint'});
        bg.appendChild(vjs.createEl('div', {className: prefix+'blur'}));
        bg.appendChild(vjs.createEl('div', {className: prefix+'tint'}));
        el.appendChild(bg);
        if (icon)
        {
            el.appendChild(vjs.createEl('div', {className: 'vjs-button-icon',
                innerHTML: typeof icon=='string' ? icon : ''}));
        }
        if (need_box!==false)
            el.className += ' vjs-ios-control-box';
        el.style.zoom = get_ui_zoom(player);
    }
    var controls = ControlBar.prototype.options_.children;
    var play_index = controls.indexOf('playToggle');
    if (!opt.hide_skip_buttons && play_index!=-1)
    {
        controls.splice(play_index+1, 0, 'skipForward');
        controls.splice(play_index, 0, 'skipBackward');
    }
    var controls_create_el = ControlBar.prototype.createEl;
    ControlBar.prototype.createEl = function(){
        var el = controls_create_el.call(this);
        init_control(this.player_, el, null, false);
        return el;
    };
    var init_children = ControlBar.prototype.initChildren;
    ControlBar.prototype.initChildren = function(){
        var res = init_children.call(this);
        var _this = this;
        ['volumeMenuButton', 'fullscreenToggle'].forEach(function(name){
            var control = _this[name];
            if (control&&control.el_)
                _this.player_.el_.appendChild(control.el_);
        });
        return res;
    };
    var volume_create_el = VolumeMenuButton.prototype.createEl;
    VolumeMenuButton.prototype.createEl = function(){
        var el = volume_create_el.call(this);
        init_control(this.player_, el, true);
        return el;
    };
    var fullscreen_create_el = FullscreenToggle.prototype.createEl;
    FullscreenToggle.prototype.createEl = function(){
        var el = fullscreen_create_el.call(this);
        init_control(this.player_, el, true);
        return el;
    };
    var bigplaybutton_create_el = BigPlayButton.prototype.createEl;
    BigPlayButton.prototype.createEl = function(){
        var el = bigplaybutton_create_el.call(this);
        init_control(this.player_, el, true, false);
        return el;
    };
    var seekbar_calculate = SeekBar.prototype.calculateDistance;
    SeekBar.prototype.calculateDistance = function(event){
        var zoom = this.player_.ui_zoom;
        var fake_event = {};
        fake_event.pageY = event.pageY / zoom;
        fake_event.pageX = event.pageX / zoom;
        if (event.changedTouches&&event.changedTouches[0])
        {
            var touch = {};
            touch.pageX = event.changedTouches[0].pageX / zoom;
            touch.pageY = event.changedTouches[0].pageY / zoom;
            fake_event.changedTouches = [touch];
        }
        return seekbar_calculate.call(this, fake_event);
    };
    // hack to improve seeking on Android
    // handle touch events from progress-control component
    var seekbar_mousedown = SeekBar.prototype.handleMouseDown;
    SeekBar.prototype.handleMouseDown = function(event){
        if (this.mouse_down_pressed)
            return;
        this.mouse_down_pressed = true;
        seekbar_mousedown.call(this, event);
    };
    var seekbar_mouseup = SeekBar.prototype.handleMouseUp;
    SeekBar.prototype.handleMouseUp = function(event){
        if (!this.mouse_down_pressed)
            return;
        this.mouse_down_pressed = false;
        seekbar_mouseup.call(this, event);
    };
    SeekBar.prototype.handleMouseMove = function(event){
        if (!this.mouse_down_pressed)
            return;
        var duration = this.player_.duration();
        var distance = this.calculateDistance(event);
        this.scrubbing_distance = distance;
        if (duration)
        {
            this.player_.scrubbing_percent = 0;
            var newTime = distance*duration;
            if (newTime===duration)
                newTime = newTime - 0.1;
            this.player_.currentTime(newTime);
        }
        else
            this.player_.scrubbing_percent = distance;
        if (this.update)
            this.update();
        // Immediate update for the time labels
        // disabled because native iOS player does not do this
        if (0)
        {
        this.player_.controlBar.currentTimeDisplay.updateContent();
        this.player_.controlBar.remainingTimeDisplay.updateContent();
        }
    };
    SeekBar.prototype.getPercent = function(){
        var duration = this.player_.duration();
        var percent;
        if (duration || !this.player_.scrubbing_percent)
        {
            percent = this.player_.scrubbing() ?
                this.scrubbing_distance :
                this.player_.currentTime() / duration;
        }
        else
            percent = this.player_.scrubbing_percent;
        return percent >= 1 ? 1 : percent;
    };
}

var HolaSkin = function(player, opt){
    var _this = this;
    this.player = player;
    this.el = player.el();
    this.opt = opt;
    this.classes_added = [];
    var ios_skin = opt.className=='vjs-ios-skin';
    // values are found empirically from the native iOS player
    this.controls_min_width = ios_skin ?
        [{name: 'skipBackward', min_width: 306},
        {name: 'skipForward', min_width: 335},
        {name: 'currentTimeDisplay', min_width: 260}] : [];
    this.external_controls = ios_skin ?
        ['volumeMenuButton', 'fullscreenToggle'] : [];
    player.on('dispose', function(){ _this.dispose(); });
    player.on('ready', function(){ _this.init(); });
    var resize = this._resize = this.resize.bind(this);
    var zoom_end = this._zoom_end = this.on_touch_end.bind(this);
    player.on('resize', resize);
    player.on('fullscreenchange', function(){ setTimeout(resize); });
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', resize);
    this.scale = 1;
    document.addEventListener('touchend', zoom_end);
    this.apply();
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

function need_invert(){
    var screen = window.screen;
    if (!screen)
        return false;
    // ios safari always use values for screen.avail*
    // from vertical rotation while android chrome change it
    // depending on the orientation
    var s = screen.availHeight > screen.availWidth;
    var w = window.innerHeight > window.innerWidth;
    return s!=w;
}

HolaSkin.prototype.update_scrubbing = function(){
    if (!this.player.scrubbing_percent)
        return;
    var duration = this.player.duration();
    if (duration===Infinity)
    {
        this.player.scrubbing_percent = 0;
        return;
    }
    if (!duration||this.player.hasClass('vjs-waiting'))
        return;
    var newTime = this.player.scrubbing_percent*duration;
    if (newTime===duration)
        newTime = newTime - 0.1;
    this.player.scrubbing_percent = 0;
    this.player.currentTime(newTime);
};

HolaSkin.prototype.on_touch_end = function(e){
    var scale = get_ui_zoom(this.player);
    if (this._zoom_bounce)
        clearTimeout(this._zoom_bounce);
    if (this.scale==scale)
    {
        // XXX alexeym: hack for animation when zoom via double-tap
        if (e)
            this._zoom_bounce = setTimeout(this._zoom_end, 500);
        return;
    }
    var zooming_out = this.scale<scale;
    this.scale = scale;
    this._resize();
    // XXX alexeym: hack for bounce-on-zoom animation when zooming out
    if (zooming_out)
        this._zoom_bounce = setTimeout(this._resize, 500);
};

HolaSkin.prototype.resize = function(){
    var player = this.player;
    var width = this.el.offsetWidth;
    player.toggleClass('vjs-small', width<=480);
    function get_child(name){
        var control_bar = player.controlBar;
        return player[name] || control_bar&&control_bar[name] ||
            player.getChild(name);
    }
    var zoom = get_ui_zoom(player);
    ['controlBar', 'bigPlayButton', 'ShareButton']
    .concat(this.external_controls).forEach(function(name){
        var control = get_child(name);
        if (!control)
            return;
        var el = control.el();
        if (!el)
            return;
        el.style.zoom = zoom;
    });
    var s_width = width/zoom;
    this.controls_min_width.forEach(function(item){
        var control = get_child(item.name);
        if (!control)
            return;
        control.toggleClass('vjs-hidden', s_width<item.min_width);
    });
    // XXX alexeym TODO: show only play/pause button if s_width<201
};

HolaSkin.prototype.init = function(){
    var _this = this;
    var player = this.player;
    this.resize();
    if (vjs.browser.IS_ANDROID || vjs.browser.IS_IOS)
        player.addClass('vjs-mobile');
    this.init_volume_button();
    this.has_played = false;
    var play_el = player.controlBar.playToggle.el();
    play_el.appendChild(vjs.createEl('div', {className: 'vjs-button-icon'}));
    var update_scrubbing = this.update_scrubbing.bind(this);
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
        update_scrubbing();
        _this.has_played = has_pos;
        _this.update_state(player);
    })
    .on('mouseleave', function(){
        if (!player.hasClass('vjs-settings-expanded'))
            player.userActive(false);
    })
    .one('loadmetadata', update_scrubbing)
    .one('canplay', update_scrubbing)
    .one('canplaythrough', update_scrubbing)
    .one('playing', update_scrubbing);
    this.update_state(player);
    var control_bar = player.controlBar;
    var progress_control = control_bar.progressControl;
    var seek_bar = progress_control.seekBar;
    var progress_holder = seek_bar.el();
    progress_control.on('touchstart', function(e){
        progress_control.addClass('vjs-touch');
        // hack to improve seeking on Android
        // handle touch events from progress-control component
        seek_bar.handleMouseDown(e);
    });
    progress_control.on('touchmove', function(e){
        seek_bar.handleMouseMove(e);
    });
    progress_control.on('touchend', function(e){
        seek_bar.handleMouseUp(e);
        progress_control.removeClass('vjs-touch');
    });
    progress_holder.insertAdjacentHTML('beforeend', slider_gaps);
    player.addChild('PlayAnimation');
    var volume_btn = control_bar.volumeMenuButton;
    var volume_slider = volume_btn.volumeBar.el();
    volume_slider.insertAdjacentHTML('beforeend', slider_gaps);
    volume_btn.on('mouseenter', function(){
        volume_btn.addClass('vjs-show-volume-button'); });
    var interval, report_activity = player.reportUserActivity.bind(player);
    control_bar.on('mouseenter', function(){
        interval = this.setInterval(report_activity, 250); });
    control_bar.on('mouseleave', function(){
        if (interval)
            this.clearInterval(interval);
        volume_btn.removeClass('vjs-show-volume-button');
    });
    var spacer = control_bar.customControlSpacer;
    var spacer_el = spacer&&spacer.el();
    if (spacer_el)
    {
        control_bar.on('mousemove', function(e){
            var r = spacer_el.getBoundingClientRect();
            if (e.clientX>r.left || e.clientY<r.top)
                volume_btn.removeClass('vjs-show-volume-button');
        });
    }
    if (this.opt.title)
        player.addChild('TopBar', {title: this.opt.title});
};

HolaSkin.prototype.update_state = function(player){
    var replay_classname = 'vjs-play-control-replay';
    player.controlBar.playToggle.toggleClass(replay_classname, this.is_ended);
    player.bigPlayButton.toggleClass(replay_classname, this.is_ended);
    player.toggleClass('vjs-pos-ended', this.is_ended && this.has_played);
    player.toggleClass('vjs-pos-started', this.has_played);
    var poster = player.posterImage.el();
    if (this.is_ended)
    {
        player.controlBar.playToggle.controlText('Replay');
        setTimeout(function(){ poster.style.opacity = 1; });
    }
    else
        poster.style.opacity = '';
};

HolaSkin.prototype.init_volume_button = function(){
    var player = this.player, btn = player.controlBar.volumeMenuButton;
    var override = function(obj, events, method, fn){
        var p = VolumeMenuButton.prototype;
        btn.off(obj, events, p[method]);
        btn.on(obj, events, fn);
        btn[method] = fn;
    };
    override(player, ['volumechange', 'advolumechange', 'loadstart'],
        'volumeUpdate', function()
    {
        var i, el = this.el_, _this = this;
        var vol = !this.player_.muted() && this.player_.volume();
        var level = !vol ? 0 : vol<0.5 ? 1 : 2;
        for (i = 0; i < 2; i++)
            vjs.toggleClass(el, 'vjs-vol-'+i, i==level);
        var muted = !vol;
        if (this.muted_!==undefined && this.muted_==muted)
            return;
        this.muted_ = muted;
        this.controlText(muted ? 'Unmute' : 'Mute');
        var masks = el.querySelectorAll('.vjs-volume-mask');
        var from = vol ? 20 : 0, to = vol ? 0 : 20;
        var start = window.performance && window.performance.now();
        var animate = function(time){
            var progress = time ? (time-start)/250 : 1;
            var v = from+(to-from)*Math.max(Math.min(progress, 1), 0);
            for (i = 0; i < masks.length; i++)
                masks[i].setAttribute('transform', 'translate('+v+','+v+')');
            if (v!=to)
                _this.animId = window.requestAnimationFrame(animate);
        };
        if (!start || !window.requestAnimationFrame)
            return void animate();
        if (this.animId)
            window.cancelAnimationFrame(this.animId);
        this.animId = window.requestAnimationFrame(animate);
    });
    var prevent_click = false;
    override(btn, ['tap', 'click'], 'handleClick', function(){
        if (prevent_click)
            return;
        this.player_.muted(!this.player_.muted() && !!this.player_.volume());
        if (!this.player_.muted() && !this.player_.volume())
            this.player_.volume(1);
    });
    btn.on('mousedown', function(event){
        prevent_click = this.volumeBar.el().contains(event.target);
    });
    btn.volumeUpdate();
};

HolaSkin.prototype.dispose = function(){
    while (this.classes_added.length)
        this.player.removeClass(this.classes_added.pop());
    window.removeEventListener('resize', this._resize);
    window.removeEventListener('orientationchange', this._resize);
    document.removeEventListener('touchend', this._zoom_end);
    if (this._zoom_bounce)
        this._zoom_bounce = clearTimeout(this._zoom_bounce);
};

vjs.registerComponent('ControlsWatermark', vjs.extend(Button, {
    constructor: function(player, opt){
        Button.apply(this, arguments);
        if (opt.tooltip)
            this.controlText(opt.tooltip);
    },
    createEl: function(){
        var opt = this.options_;
        var el = vjs.createEl('div', {className:
            'vjs-controls-watermark vjs-control'});
        if (!opt.image)
            return el;
        var container = opt.url ? vjs.createEl('a', {href: opt.url,
            target: '_blank'}) : el;
        if (opt.url)
            el.insertBefore(container, el.firstChild);
        container.appendChild(vjs.createEl('img', {src: opt.image}));
        return el;
    },
    handleClick: function(){
        if (this.options_.url)
            this.player_.pause();
    },
    buildCSSClass: function(){
        return 'vjs-controls-watermark '+
            Button.prototype.buildCSSClass.apply(this, arguments);
    }
}));

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

vjs.registerComponent('TopBar', vjs.extend(Component, {
    createEl: function(){
        var el = vjs.createEl('div', {className: 'vjs-top-bar'});
        el.appendChild(vjs.createEl('div',
            {className: 'vjs-gradient vjs-top-gradient'}));
        el.appendChild(vjs.createEl('div', {className: 'vjs-video-title',
            innerHTML: this.options_.title}));
        return el;
    },
}));

vjs.registerComponent('SkipForward', vjs.extend(Button, {
    skip: 15,
    className: 'vjs-skip-forward',
    createEl: function(){
        var el = Button.prototype.createEl.call(this);
        var icon = vjs.createEl('div',
            {className: 'vjs-button-icon', innerHTML: ''});
        el.insertBefore(icon, el.firstChild);
        return el;
    },
    buildCSSClass: function(){
        var parent_class = Button.prototype.buildCSSClass.call(this);
        return this.className+' vjs-skip-button '+parent_class;
    },
    handleClick: function(){
        var current = this.player_.currentTime();
        this.player_.currentTime(current+this.skip);
    },
}));
var SkipForward = vjs.getComponent('SkipForward');
vjs.registerComponent('SkipBackward', vjs.extend(SkipForward, {skip: -15,
    className: 'vjs-skip-back'}));

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
    add_css('https://fonts.googleapis.com/css?family=Roboto:400,500');
    if (opt.play_button_color||opt.seek_bar_color)
    {
        custom_css = custom_css
            .replace(/@play_button_color/g, opt.play_button_color||'#00b7f1')
            .replace(/@seek_bar_color/g, opt.seek_bar_color||'#00b7f1');
        require('browserify-css').createStyle(custom_css);
    }
    if (opt.className=='vjs-ios-skin')
        patch_controls_ios(opt);
    else
        patch_controls_default();
    new HolaSkin(this, opt);
});

}(window, window.videojs));
