PathTerm = function (type, name, data) {
    this.type = type;
    this.data = data;
    this.name = name;
};

Path = function (){
    this.pathList = Array();
};

Path.prototype.depth = function(){
    return this.pathList.length;
};

Path.prototype.popTo = function(d) {
    if (typeof(d) == 'undefined') {
        return;
    } else if (d >= 0) {
        while (this.pathList.length > d) {
            this.pathList.pop();
        }
    } else {
        for (var i = 0; i < -d; ++i) {
            this.pathList.pop();
        }
    }
};

Path.prototype.pop = function() {
    return this.pathList.pop();
};

Path.prototype.getLast = function() {
    return this.pathList[this.pathList.length - 1];
};

Path.prototype.get = function(id) {
    return this.pathList[id];
};

Path.prototype.getLastTermWithType = function(typeName) {
    var d = this.pathList.length - 1;
    while (d >= 0) {
        if (this.pathList[d].type == typeName) {
            return this.pathList[d];
        }
        -- d;
    }
    return null;
};

Path.prototype.getBoard = function() {
    return this.getLastTermWithType(bbs_type.path.board);
};

Path.prototype.getLastTerm = function() {
    var d = this.pathList.length;
    if (d == 0) {
        return null;
    } else {
        return this.pathList[d-1];
    }
};

Path.prototype.push = function(pathTerm) {
    this.pathList.push(pathTerm);
};
