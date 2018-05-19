/**
 * ztree插件的封装
 */
(function () {

    var $ZTree = function (id, url) {
        this.id = id;
        this.url = url;
        this.onClick = null;
        this.settings = null;
    };

    $ZTree.prototype = {
        /**
         * 初始化ztree的设置
         */
        initSetting: function () {
            var settings = {
                view: {
                    dblClickExpand: true,
                    selectedMulti: true
                },
                check: {
                    enable: true
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "parentId",
                        openKey: "open",
                        checkedKey: "checked"
                    }
                },
                callback: {
                    onClick: this.onClick
                }
            };
            return settings;
        },

        /**
         * 手动设置ztree的设置
         */
        setSettings: function (val) {
            this.settings = val;
        },

        /**
         * 初始化ztree
         */
        init: function () {
            var zNodeSetting = null;
            if (this.settings !== null) {
                zNodeSetting = this.settings;
            } else {
                zNodeSetting = this.initSetting();
            }
            var zNodes = this.loadNodes();
            console.log(zNodes);
            $.fn.zTree.init($("#" + this.id), zNodeSetting, zNodes);
        },

        /**
         * 绑定onclick事件
         */
        bindOnClick: function (func) {
            this.onClick = func;
        },

        /**
         * 加载节点
         */
        loadNodes: function () {
            var zNodes = null;
            var ajax = new $ax(this.url, function (data) {
                zNodes = data.data;
            }, function (data) {
                CSW.error("加载zTree信息失败：" + data.msg);
            });
            ajax.async = false;
            ajax.start();
            return zNodes;
        },

        /**
         * 获取选中的值
         */
        getSelectedVal: function (e, treeId, treeNode) {
            var zTree = $.fn.zTree.getZTreeObj(this.id);
            var nodes = zTree.getSelectedNodes();
            treeNode = nodes[0];
            return nodes[0].name;
        }
    };

    window.$ZTree = $ZTree;

}());