/*
 The Unread class is the UI widget for displaying unread feeds, displaying
 as a little red dot on the upper right corner of its parent node. User 
 should initiate with the following 3 parameters and assign check function.
 To activate the checking, run schedule(); to deactivate, run unschedule().

 size should be either "small", "medium" or "large".
 parent should be a DOM element.
 freq an integer (in ms) indicating the time interval for checking unreads.

 Author: Wenqi Zhang 
 Date: 10/21/2013
*/

Unread = function (size, parent, freq) {
    if (parent == null || typeof(parent) == 'undefined') {
        return null;
    }
    this.parent = parent;
    this.node = this.genNode_(size, parent);
    if (this.node == null || typeof(this.node) == 'undefined') {
        return null;
    }
    this.check = function (self) {};
    this.freq_ = freq;
    this.intervalTask_ = undefined;
    this.node.hide();
    return this;
};

Unread.prototype.show = function (state) {
    if (state) {
        this.node.show();
    } else {
        this.node.hide();
    }
};

Unread.prototype.schedule = function() {
    if (typeof(this.node) == 'undefined' || this.node == null) {
        return;
    }
    if (typeof(this.check) == 'undefined' || this.check == null) {
        return;
    }
    if (typeof(this.freq_) == 'undefined' || 
        this.freq_ == null || this.freq_ <= 0) {
        return;
    }
    var self = this;
    this.intervalTask_ = setInterval(function() {
        self.check(self);
    }, this.freq_);
};

Unread.prototype.forceCheck = function() {
    if (typeof(this.check) == 'undefined' || this.check == null) {
        return;
    }
    var self = this;
    this.check(self);   
}

Unread.prototype.unschedule = function() {
    clearInterval(this.intervalTask_);
};

Unread.prototype.genNode_ = function(size, parent) {
    if (size != 'small' && size != 'medium' && size != 'large') {
        return null;
    }
    var node = $('<span>').addClass('unread-area').addClass(size);
    parent.append(node).addClass('unread-inside');
    return node;
};
