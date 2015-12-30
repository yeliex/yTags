/**
 * 自定义jQuery tags方法
 * params: Object, 参数
 *  {
     *      text: string, 显示的文字
     *      icon: string, 显示的图标样式类名
     *      description: string, 显示于菜单header中的描述
     *      server: string, 获取tags 的接口地址
     *          要求返回: Object)\
     *          status: string, 请求状态"success"/"failed"
     *          data:Array(Object), 包含返回的数据
     *          {
     *              tagID: tag 数据库id
     *              tagName: tag name
     *              tagColoe: tag 颜色
     *          }
     *          接口信息: "Get"请求
     *      tags: Array(Object), 输入tags,在server存在的情况下优先使用server
     *      search: bool(false), 是否允许搜索
     *      add: Object, 是否允许新增tag,以及新增tag的接口信息
     *          {
     *              addable: bool, 是否允许新增tag
     *              server: string
     *              method: string("POST"), 接口调用模式, "POST"/"GET",
     *          }
     *          发送数据: string, 发送的数据, 一次只会发送一条
     *          {
     *              name: string, tag名,数据库序号由auto-increase生成
     *              color: string, 颜色名,随机生成
     *          }
     *          要求返回:
     *          {
     *              status: string, 请求状态"success"/"failed"
     *              data: Object, 包含返回的数据(新增tag的实际序号及tag名)
     *              {
     *                  tagID: tag 数据库id
     *                  tagName: tag name
     *                  tagColoe: tag 颜色
     *              }
     *          }
     *      ...
     *
     *      // 开发中功能
     *      symbol: Object, 是否在每个tag前添加一个标记
     *          {
     *              display: bool, 是否显示symbol
     *              codes: string, symbol的html代码
     *          }
     *  }
 *
 *  tags信息
 *      {
     *          tagID: tag id(本地如果留空将按顺序排列)
     *          tagName: tag name
     *          tagColoe: tag 颜色
     *      }
 */
jQuery.fn.yeTags = function (params) {
    // 定义变量
    var _err = "";
    var target = this;
    $(function () {
        params.tags = _tags(); // 获取tags
        displayTags(params.tags, params.search, params.add.addable);
        initListner();
    });

    // 建立监听事件
    function initListner() {
        if (params.add.addable) {
            target.find(".link.icon").bind("click", function (e) {
                // 执行添加tag操作
                // 修改UI
                if ($(e.target).parent().hasClass("loading disabled")) {
                    // 已经在修改了
                    return;
                }
                $(e.target).parent().addClass("loading disabled");
                // 获取输入内容
                var tag = target.find(".ui.search.input input").val();
                // 向服务器发送tag,返回ID与随机生成的颜色
                var result = addServertag(tag);
                if (result.status == true) {
                    // 添加新增的tag
                    var htmlStr = "<div class='item' data-value='" + result.id + "'>" + "<div class='ui " + result.color + " empty circular label'></div>" + result.name + "</div>";
                    target.find(".menu .scrolling.menu").append(htmlStr);
                }
                else {
                    // 显示错误
                    displayErr(target.err);
                }

                // 恢复UI
                $(e.target).parent().removeClass("loading disabled");
            });
        }
    }

    /**
     *  获取tags
     */
    function _tags() {
        var tags;
        if (params.server !== "") {
            // 从服务器获取
            tags = getServerTags();
        }
        else {
            tags = params.tags;
        }
        return tags;
    }

    /**
     * 从服务器获取tags
     */
    function getServerTags() {
        var data;
        $.ajax(params.server, {
            method: "GET",
            async: false
        }).complete(function (r) {
            data = $.parseJSON(r.responseText);
            if (data.status === "success") {
                data = data.data;
            }
            else {
                err("无法获取到Tags");
            }
        });
        return data;
    }

    function addServertag(tag) {
        var result = {
            status: false,
            name: "",
            color: "",
            id: "",
            err: ""
        };
        $.ajax(params.add.server, {
            method: params.add.method,
            async: false,
            data: {
                name: tag,
                color: getTagColor()
            }
        }).complete(function (returnData) {
            var d = $.parseJSON(returnData.responseText);
            if (d.status == "success") {
                d = d.data;
                // 返回成功
                result.status = true;
                result.id = d.tagID;
                result.name = d.tagName;
                result.color = d.tagColor;
            }
            else {
                // 失败返回err信息
                result.err = d.error_info;
            }
        });
        return result;
    }

    // 从表中获取颜色
    function getTagColor() {
        var color = new Array("red", "orange", "yellow", "olive", "green", "teal", "blue", "violet", "purple", "pink", "brown", "grey", "black");
        var num = Math.floor(Math.random() * (color.length) + 1);
        return color[num - 1];
    }

    // 错误维护
    function err(e) {
        if (e == "") {
            return _err;
        }
        else {
            _err = e;
        }
    }

    function displayErr(e) {
        target.find("header").text(e);
    }

    function initErr() {
        _err = "";
        target.find("header").text("选择一个或多个标签");
    }

    // 显示tags
    function displayTags(tags, search, addable) {
        var str = getTagsStr(tags, search, addable);
        target.html(str);

        $(".ui.dropdown").dropdown({
            onShow: initErr()
        });
    }

    // tags 代码维护
    function getTagsStr(tags, search, addable) {
        var str = "";
        str += "<div class='ui multiple dropdown'>";
        str += "<input type='hidden' name='newTag'>";
        str += "<i class='" + params.icon + " icon'></i>";
        str += "<span class='text'>" + params.text + "</span>";
        // Menu
        str += "<div class='menu'>";
        // Menu Contents
        var _str = "";
        if (search == true) {
            _str += "<div class='ui icon search fluid input'>";
            _str += "<input type='text' placeholder='搜索" + ((addable == true) ? ("/新建") : ("")) + "' style='padding: .67861429em 1em'>";
            _str += "<i class='circular plus link icon'></i>";
            _str += "</div>";
            _str += "<div class='divider'></div>";
        }
        str += _str;

        str += ((params.description != "") ? ("<div class='header'>" + params.description + "</div>") : (""));

        str += "<div class='scrolling menu'>";
        // Menu Items
        _str = "";
        for (var i = 0; i < tags.length; i++) {
            var tag = tags[i];
            _str += "<div class='item' data-value='" + tag.id + "'>";
            // Tag Symbols
            _str += "<div class='ui " + tag.color + " empty circular label'></div>";
            _str += tag.name;
            _str += "</div>";
        }
        str += _str;

        // Menu End;
        str += "</div>";
        str += "</div>";
        str += "</div>";
        return str;
    }
};