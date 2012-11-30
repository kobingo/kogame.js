var ko = (function (ko) {
    /*global Audio*/
    ko.Audio = function () {
        this.sounds = [];
    };
    ko.Audio.prototype.playSound = function(url, loop, id, volume) {
        var sound = new Audio(url);
        sound.id = id;
        sound.volume = volume || 1;
        sound.loop = loop;
        sound.play();
        this.sounds.push(sound);
    };
    ko.Audio.prototype.playMusic = function(url, loop, volume) {
        this.music = new Audio(url);
        this.music.volume = volume || 1;
        this.music.loop = loop;
        this.music.play();
    };
    ko.Audio.prototype.stopSound = function(id) {
        if (id === undefined) {
            throw new Error("Must specify 'id' when stopping a sound.");
        }
        for (var i = 0; i < this.sounds.length; i++) {
            if (this.sounds[i].id === id) {
                this.sounds[i].pause();
                this.sounds.splice(i, 1);
                break;
            }
        }
    };
    ko.Audio.prototype.stopMusic = function() {
        if (!this.music) {
            throw new Error("Can't stop music before music has been played.");
        }
        this.music.pause();
    };
    ko.Audio.prototype.stopAllSounds = function() {
        for (var i = this.sounds.length - 1; i >= 0; i--) {
            this.sounds[i].pause();
            this.sounds.splice(i, 1);
        }
    };
    ko.Audio.prototype.fadeMusic = function(volume, duration) {
        if (!this.music) {
            throw new Error("Can't fade music before music has been played.");
        }
        this.fadeFrom = this.music.volume;
        this.fadeTo = volume;
        this.fadeAction = new ko.Action(duration || 1);
        this.fadeAction.init(this);
    };
    ko.Audio.prototype.isMusicPlaying = function() {
        if (!this.music) {
            return false;
        }
        return !this.music.paused;
    };
    ko.Audio.prototype.update = function(delta) {
        if (!this.fadeAction) {
            return;
        }
        this.fadeAction.update(delta);
        this.music.volume = this.fadeFrom + ((this.fadeTo - this.fadeFrom) * 
            this.fadeAction.value);
        if (this.fadeAction.isComplete()) {
            delete this.fadeAction;
        }
    };
    ko.audio = new ko.Audio();
    return ko;
})(ko || {});
