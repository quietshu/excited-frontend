// TODO : debug
var domain = "";//http://172.27.221.110";
// TODO : end debug

var app = angular.module("excited", []);
var todoListItems = [];
var email = null,
    nickname = null;

var redirectLogin = function () {
    $("#overlay").css("display", "inherit");
    $("#warning").css("opacity", "1");
    var secondLeft = 5;
    $("#second").html(secondLeft);
    setInterval(function () {
        secondLeft--;
        if (secondLeft <= 0)
            window.location.href = "login/";
        else
            $("#second").html(secondLeft);
    }, 1000);
};

var checkLogin = function () {
    var signed_in = false;
    $.ajax({
        url: domain + "/api/check-login/",
        method: "get"
    }).done(function (data) {
        if (typeof data.signed_in !== "undefined")
            signed_in = data.signed_in;
        if (!signed_in)
            redirectLogin();
        email = data.email;
        nickname = data.nickname;
    }).error(function () {
        redirectLogin();
    });
};

var main = function ($scope) {
};

var timelineList = function ($scope) {
    var callback = function (data) {
        var lists = [];
        for (var i in data) {
            if (todoListItems.indexOf( data[i].id ) == -1)
                lists.push(new timelineLi(data[i]));
        }
        $scope.lists = lists;
        $scope.$apply();
    };
    getTimeline(callback);

    //$scope.classUlShow = "hide";
    window.location.hash = "new";

    $scope.markItem = function (id, itemId) {
        markItemApi(itemId);
        markItemAnimation(id);
    };

    timelineInit();
};

var todoList = function ($scope) {
    var callback = function (data) {
        var lists = [];
        for (var i in data) {
            lists.splice(0, 0, new todolistLi(data[i]));
            todoListItems.push(data[i].item.id);
        }
        $scope.lists = lists;
        $scope.$apply();
    };
    getTodolist(callback);
};

var followList = function ($scope) {
    $scope.lists = getFollow();
};

var toolbar = function ($scope) {
    $scope.userInfo = getUserInfo();
};

app.controller("main", main)
    .controller("toolbar", toolbar)
    .controller("todo-list", todoList)
    .controller("timeline-list", timelineList)
    .controller("follow-list", followList);

checkLogin();