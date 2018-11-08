/**
 * 初始化 BootStrap Table 的封装
 *
 *
 * @author csw
 */
(function () {

    var BSTable = function (tableId, toolbarId, apiUrl, columns) {
        this.tbInstance = null;					//jquery和BootStrapTable绑定的对象
        this.tableId = tableId;
        this.toolbarId = toolbarId;
        this.url = apiUrl;
        this.columns = columns;
        this.method = "get";
        this.paginationType = "client";			//默认分页方式是服务器分页,可选项"client"
        this.height = $(window).height() - 30;
        this.pageList = [10, 25, 200, 300];
        this.pagination = true;
        this.data = {};
        this.refreshParams = {};
        this.search = true;
        this.showRefresh = true;
        this.showToggle = true;
        this.showColumns = true;
        this.onEditableSave = null;
        this.showExport = false;
        this.exportOptions = {};
    };

    BSTable.prototype = {
        /**
         * 初始化bootstrap table
         */
        init: function () {
            var tableId = this.tableId;
            this.tbInstance = $('#' + tableId).bootstrapTable({
                contentType: "application/json",
                url: this.url,				//请求地址
                method: this.method,		//ajax方式
                ajaxOptions: {				//todo:ajax请求的附带参数
                    data: this.data,
                    dataType: "json",
                    xhrFields: {withCredentials: true},
                    crossDomain: true
                },
                queryParams: this.refreshParams,
                toolbar: "#" + this.toolbarId,//顶部工具条
                striped: true,     			//是否显示行间隔色
                cache: false,      			//是否使用缓存,默认为true
                pagination: this.pagination,//是否显示分页（*）
                sortable: true,      		//是否启用排序
                sortOrder: "desc",     		//排序方式
                pageNumber: 1,      		//初始化加载第一页，默认第一页
                pageSize: 10,      			//每页的记录行数（*）
                pageList: this.pageList,  	//可供选择的每页的行数（*）
                queryParamsType: 'limit', 	//默认值为 'limit' ，在默认情况下，传给服务端的参数为：offset,limit,sort
                sidePagination: this.paginationType,   //分页方式：client客户端分页，server服务端分页（*）
                search: this.search,      		    //是否显示表格搜索，此搜索是客户端搜索，不会进服务端
                strictSearch: false,		//设置为 true 启用全字段匹配搜索，否则为模糊搜索
                showRefresh: this.showRefresh,     		//是否显示刷新按钮
                showToggle: this.showToggle,           //是否显示详细视图和列表视图的切换按钮
                showColumns: this.showColumns,     		//是否显示所有的列按钮
                minimumCountColumns: 1,    	//最少允许的列数
                clickToSelect: true,    	//是否启用点击选中行
                searchOnEnterKey: false,	//设置为true时，按回车触发搜索方法，否则自动触发搜索方法
                columns: this.columns,		//列数组
                height: this.height,
                onEditableSave: this.onEditableSave,
                showExport: this.showExport,
                exportDataType: 'both',
                exportTypes: ['excel'],
                Icons: 'glyphicon-export',
                exportOptions: this.exportOptions
            });
            setTimeout(function () {
                $('#' + tableId).bootstrapTable('resetView');
            }, 200);
            return this;
        },

        /**
         * 设置分页方式：server 或者 client
         */
        setPaginationType: function (type) {
            this.paginationType = type;
        },

        setStyle: function (height, search, showRefresh, showToggle, showColumns, pagination) {
            this.height = typeof height === "undefined" ? this.height : height;
            this.search = typeof search === "undefined" ? this.search : search;
            this.showRefresh = typeof showRefresh === "undefined" ? this.showRefresh : showRefresh;
            this.showToggle = typeof showToggle === "undefined" ? this.showToggle : showToggle;
            this.showColumns = typeof showColumns === "undefined" ? this.showColumns : showColumns;
            this.pagination = typeof pagination === "undefined" ? this.pagination : pagination;
        },
        setSearch: function (search) {
            this.search = typeof search === "undefined" ? this.search : search;
        },
        setExport: function (showExport, exportOptions) {
            this.showExport = showExport ? true : false;
            this.exportOptions = exportOptions ? exportOptions : {};
        },

        setOnEditableSave: function (fun) {
            this.onEditableSave = fun;
        },

        operateFormatter: function (value, row, index) {
            return [
                '<a class="edit" href="javascript:void(0)" title="修改">',
                '<i class="glyphicon glyphicon-edit"></i>',
                '</a>&nbsp;&nbsp;&nbsp;',
                '<a class="remove" href="javascript:void(0)" title="删除">',
                '<i class="glyphicon glyphicon-trash"></i>',
                '</a>'
            ].join('');
        },

        statusFormatter: function (value, row, index) {
            if (row.status === 1) {
                return "<span class='label label-sm label-success'>正常</span>";
            } else if (row.status === 0) {
                return "<span class='label label-sm label-warning'>禁用</span>";
            } else if (row.status === 2) {
                return "<span class='label label-sm label-danger'>删除</span>";
            } else {
                return "<span class='label label-sm label-info'>其它</span>";
            }
        },

        stateFormatter: function (value, row, index) {
            if (row.state === 1) {
                return "<span class='label label-sm label-info'>草稿</span>";
            } else if (row.state === 2) {
                return "<span class='label label-sm label-primary'>申请</span>";
            } else if (row.state === 3) {
                return "<span class='label label-sm label-success'>审批通过</span>";
            } else if (row.state === 4) {
                return "<span class='label label-sm label-warning'>审批不通过</span>";
            } else if (row.state === 5) {
                return "<span class='label label-sm label-success'>出货</span>";
            } else if (row.state === 12) {
                return "<span class='label label-sm label-danger'>作废</span>";
            } else if (row.state === 6) {
                return "<span class='label label-sm label-success'>入库</span>";
            } else if (row.state === 7) {
                return "<span class='label label-sm label-info'>未入库</span>";
            } else if (row.state === 8) {
                return "<span class='label label-sm label-warning'>转移</span>";
            } else if (row.state === 9) {
                return "<span class='label label-sm label-success'>借出</span>";
            } else if (row.state === 10) {
                return "<span class='label label-sm label-success'>归还</span>";
            } else if (row.state === 11) {
                return "<span class='label label-sm label-success'>部分归还</span>";
            } else {
                return "<span class='label label-sm label-default'>其它</span>";
            }
        },

        aclTypeFormatter: function (value, row, index) {
            if (row.type === 1) {
                return "<span class='label label-sm label-primary'>菜单</span>";
            } else if (row.type === 2) {
                return "<span class='label label-sm label-warning'>按钮</span>";
            } else {
                return "<span class='label label-sm label-default'>其它</span>";
            }
        },

        sexFormatter: function (value, row, index) {
            if (row.sex === 1) {
                return "<span class='label label-sm label-primary'>男</span>";
            } else if (row.sex === 0) {
                return "<span class='label label-sm label-warning'>女</span>";
            } else {
                return "<span class='label label-sm label-danger'>其它</span>";
            }
        },

        //隐藏单元格多余的内容，以css样式来隐藏多余内容
        formatTableCell: function (value, row, index) {
            return {classes: "tableCell"};
        },

        operationEvent: function () {
            window.operateEvents = {
                'click .edit': function (e, value, row, index) {
                    window.Table.bsModal.setModalData(row);
                    window.Table.bsModal.setForm();
                    window.Table.bsModal.open("编辑信息");
                },
                'click .remove': function (e, value, row, index) {
                    var id = [row.id];
                    CSW.confirm(CSW.confirmInfo, function (result) {
                        if (result) {
                            var objects = [];
                            var object = {};
                            object["id"] = parseInt([row.id]);
                            objects.push(object);
                            var ajax = new $ax(window.Table.api + "/batch", function (data) {
                                if (data.code === "0000") {
                                    CSW.success(CSW.deleteOk);
                                    window.Table.bsTable.refresh();
                                } else if (data.code === "0002") {
                                    CSW.error(CSW.deleteFail + data.msg);
                                } else {
                                    CSW.error(CSW.unknowCode + data.code);
                                }
                            }, function (data) {
                                CSW.error(CSW.requestFail + data.msg);
                            });
                            ajax.type = "DELETE";
                            ajax.data = objects;
                            ajax.start();
                        }
                    });
                }
            };
            return window.operateEvents;
        },

        //得到当前选中行的id字段值(多行被选中时，返回是数组)
        getIdSelections: function () {
            return $.map(this.tbInstance.bootstrapTable('getSelections'), function (row) {
                return row.id
            });
        },

        getItemSelections: function () {
            var selections = this.tbInstance.bootstrapTable('getSelections');
            if (selections.length === 0) {
                CSW.info(CSW.selectTip);
            }
            return selections;
        },

        set: function (key, value) {
            if (typeof key === "object") {
                for (var i in key) {
                    if (typeof i === "function")
                        continue;
                    this.data[i] = key[i];
                }
            } else {
                this.data[key] = (typeof value === "undefined") ? $("#" + key).val() : value;
            }
            return this;
        },

        setData: function (data) {
            this.data = data;
            return this;
        },

        clear: function () {
            this.data = {};
            return this;
        },

        setRefreshParams: function (params) {
            this.refreshParams = params;
        },

        /**
         * 刷新 bootstrap 表格
         * Refresh the remote server data,
         * you can set {silent: true} to refresh the data silently,
         * and set {url: newUrl} to change the url.
         * To supply query params specific to this request, set {query: {foo: 'bar'}}
         */
        refresh: function (parms) {
            if (typeof parms !== "undefined") {
                this.tbInstance.bootstrapTable('refresh', parms);
            } else {
                if (this.refreshParams !== null) {
                    this.tbInstance.bootstrapTable('refresh', this.refreshParams);
                } else {
                    this.tbInstance.bootstrapTable('refresh');
                }
            }
        },

        setHeight: function (height) {
            var h = $(window).height() - 30;
            if (typeof height !== "undefined") {
                h = height;
            }
            this.tbInstance.bootstrapTable('resetView', {
                height: h
            });
        },

        //给表格绑定事件
        bindEvents: function (toolbar, bsModal, bsTable) {

            //选中记录时，改变删除按钮的状态
            bsTable.tbInstance.on('check.bs.table uncheck.bs.table ' +
                'check-all.bs.table uncheck-all.bs.table', function () {
                $("#" + toolbar.deleteBntName).prop('disabled', !bsTable.getIdSelections().length);
            });

            bsTable.tbInstance.on('check.bs.table uncheck.bs.table ' +
                'check-all.bs.table uncheck-all.bs.table', function () {
                $("#" + toolbar.editBntName).prop('disabled', bsTable.getIdSelections().length > 1 || !bsTable.getIdSelections().length);
            });

            //当窗口大小被调整时，调整table高度
            $(window).resize(function () {
                bsTable.tbInstance.bootstrapTable('resetView', {
                    height: $(window).height() - 30
                });
            });
        }
    };

    window.BSTable = BSTable;

}());