var myApp = myApp || {};
$(document).ready(function () {
    var controller = new myApp.TreeController();
    controller.start();
});

myApp.TreeData = function () { 

}

myApp.TreeData.allContinents = function () {
    var continents = [];
    var treeData = { Continents: [] };
    continents.push({ Type: "Continent", Name: "Asia", HaveChildren: true });
    continents.push({ Type: "Continent", Name: "Africa", HaveChildren: true });
    continents.push({ Type: "Continent", Name: "Antartica", HaveChildren: false });
    continents.push({ Type: "Continent", Name: "America", HaveChildren: true });
    continents.push({ Type: "Continent", Name: "Australia", HaveChildren: true });
    continents.push({ Type: "Continent", Name: "Europe", HaveChildren: true });
    treeData = { TreeNodes: continents };
    return treeData;
}
myApp.TreeData.allCities = function (state) {
    var cities = [];
    var treeData = {};
    if (state == "Tamil Nadu") {
        cities.push({ Type: "City", Name: "Chennai", HaveChildren: true });
        cities.push({ Type: "City", Name: "Coimbatore", HaveChildren: true });
        cities.push({ Type: "City", Name: "Madurai", HaveChildren: true });
        cities.push({ Type: "City", Name: "Tirunelveli", HaveChildren: true });
        cities.push({ Type: "City", Name: "Trichy", HaveChildren: true });
    } else if (state == "California") {
        states.push({ Type: "City", Name: "Sunnyvale", HaveChildren: true });
        states.push({ Type: "City", Name: "Santa Clara", HaveChildren: true });
        cities.push({ Type: "City", Name: "San Francisco", HaveChildren: true });
    } else {
        for(var i = 0 ; i < 100; i ++){
            cities.push({ Type: "City", Name: "City " + (i+1), HaveChildren: true });
        }
    }

    treeData = { TreeNodes: cities };
    return treeData;

}

myApp.TreeData.allStates = function (country) {
    var states = [];
    var treeData = {};
    if (country == "India") {
        states.push({ Type: "State", Name: "Tamil Nadu", HaveChildren: true });
        states.push({ Type: "State", Name: "Karnataka", HaveChildren: true });
        states.push({ Type: "State", Name: "Kerala ", HaveChildren: true });
        states.push({ Type: "State", Name: "Andhra Pradesh", HaveChildren: true });
    } else if (country == "USA") {
        states.push({ Type: "State", Name: "California", HaveChildren: true });
        states.push({ Type: "State", Name: "Texas", HaveChildren: true });
        states.push({ Type: "State", Name: "New Jersey", HaveChildren: true });
        states.push({ Type: "State", Name: "Arizona", HaveChildren: true });
        states.push({ Type: "State", Name: "Nevada", HaveChildren: true });
    } else {
        states.push({ Type: "State", Name: "State1", HaveChildren: true });
        states.push({ Type: "State", Name: "State2", HaveChildren: true });
        states.push({ Type: "State", Name: "State2", HaveChildren: true });
    }

    treeData = { TreeNodes: states };
    return treeData;

}
myApp.TreeData.allCountries = function (continent) {
    var countries = [];
    var treeData = {};
    if (continent == "Asia") {
        countries.push({ Type: "Country", Name: "India", HaveChildren: true });
        countries.push({ Type: "Country", Name: "China", HaveChildren: true });
        countries.push({ Type: "Country", Name: "Japan", HaveChildren: true });
        countries.push({ Type: "Country", Name: "South Korea", HaveChildren: true });
    }
    if (continent == "Europe") {
        countries.push({ Type: "Country", Name: "France", HaveChildren: true });
        countries.push({ Type: "Country", Name: "England", HaveChildren: true });
        countries.push({ Type: "Country", Name: "Germany", HaveChildren: true });
    }
    if (continent == "Africa") {
        countries.push({ Type: "Country", Name: "Kenya", HaveChildren: true });
        countries.push({ Type: "Country", Name: "South Africa", HaveChildren: true });
        countries.push({ Type: "Country", Name: "Nigeria", HaveChildren: true });
    }
    if (continent == "America") {
        countries.push({ Type: "Country", Name: "USA", HaveChildren: true });
    }
    if (continent == "Australia") {
        countries.push({ Type: "Country", Name: "Australia", HaveChildren: true });
    }
    treeData = { TreeNodes: countries };
    return treeData;
}

myApp.TreeController = function () {
    this.treeView = null;

}

myApp.TreeController.prototype.start = function () {
    this.treeView = new myApp.TreeView(this);
    this.treeView.start(myApp.TreeData.allContinents());
}

myApp.TreeController.prototype.getChildren = function (node, callback) {
    var treeNodes = null;
    if (node == null || node.Type == null) {
        return null;
    }
    if (node.Type == "Continent") {
        treeNodes = myApp.TreeData.allCountries(node.Name);
    }

    if (node.Type == "Country") {
        treeNodes = myApp.TreeData.allStates(node.Name);
    }

    if (node.Type == "State") {
        treeNodes = myApp.TreeData.allCities(node.Name);
    }
    callback(treeNodes);
}

myApp.TreeController.prototype.getNodeData = function (nodeName, treeData) {
    var nodeData = null;
    $.each(treeData, function (key, value) {
        if (value.Name.replace(/ /gi, "") == nodeName.replace(/ /gi, "")) {
            nodeData = value;
        }
    });
    return nodeData;

}
myApp.TreeView = function (viewController) {
    this.controller = viewController;
    this.callbackContext = null;
}

myApp.TreeView.prototype.start = function (treeData) {
    $('#TreeViewContainer').append($('#treeTemplate').jqote({ treeData: treeData }));
    this.render($('#TreeViewContainer'), treeData);

}
myApp.TreeView.prototype.bindEvents = function (context, treeData) {
    var _this = this;
    $(context).find('li').click(function (event) {
        var currentElement = $(this);
        if ($(this).attr("isloaded") != "true") {
            var treeNode = _this.controller.getNodeData($(this).data("name"), treeData.TreeNodes);
            _this.controller.getChildren(treeNode, function (callbackResult) {
                if (callbackResult == null) { return false; }
                currentElement.children(".expand").html("<img src='loader.gif'/>");
                _this.render(currentElement, callbackResult);
                currentElement.children(".expand").html("-");
                $(currentElement).attr("isloaded", true);
                return false;
            });
        } else {
            var isVisible = $(this).find(".trees").is(":visible") ? true : false;
            if (isVisible) {
                $(this).children(".expand").text("+");
                $(this).find(".trees").hide();
            } else {
                $(this).find(".trees").show();
                $(this).children(".expand").text("-");
            }
        }
        event.preventDefault();
        return false;
    });

}
myApp.TreeView.prototype.render = function (context, treeData) {
    // let's do some jQote magic
    $(context).append($('#treeTemplate').jqote(treeData, '%'));
    this.bindEvents($(context).find("ul"), treeData);

}

