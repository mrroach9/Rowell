function PathTerm(type, name, data){
    this.type = type;
    this.data = data;
    this.name = name;
}

function Path(){
    this.pathList = Array();
    this.depth = function(){
        return this.pathList.length;
    };
    this.popTo = function(d) {
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
    this.pop = function() {
        return this.pathList.pop();
    };

    this.getLast = function() {
        return this.pathList[this.pathList.length - 1];
    };

    this.get = function(id) {
        return this.pathList[id];
    };

    this.getLastTermWithType = function(typeName) {
        var d = this.pathList.length - 1;
        while (d >= 0) {
            if (this.pathList[d].type == typeName) {
                return this.pathList[d];
            }
            -- d;
        }
        return null;
    };

    this.getBoard = function() {
        return this.getLastTermWithType(bbs_type.path.board);
    };

    this.getLastTerm = function() {
        var d = this.pathList.length;
        if (d == 0) {
            return null;
        } else {
            return this.pathList[d-1];
        }
    };

    this.push = function(pathTerm) {
        this.pathList.push(pathTerm);
    };
}
