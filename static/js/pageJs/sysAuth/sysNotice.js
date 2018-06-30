$(function () {
    var selectedRows = [];
    var modifyRow = {};

    var Table = {
        api: '/api/sys/notices',
        tableId: "myTable",
        toolbarId: "toolbar",
        bsTable: null,
        bsModal: null
    };
    Table.initColumn = function () {
        var columns = [
            {field: 'state', checkbox: true, align: 'center', valign: 'middle', width: '5%'},
            {title: 'ID', field: 'id', align: 'center', width: '10%'},
            {title: '标题', field: 'title', align: 'center', width: '60%'},
            {title: '时间', field: 'createTime', align: 'center', width: '25%'}
        ];
        return columns;
    };
    var bsTable = new BSTable(Table.tableId, Table.toolbarId, CSW.getUrl(Table.api), Table.initColumn());
    bsTable.setStyle(undefined, true, true, false, true, true)
    bsTable = bsTable.init();

    $('#summernote').summernote({
        height: $(window).height() - 190,
        lang:'zh-CN',
        toolbar: [
            <!--字体工具-->
            ['fontname', ['fontname']], //字体系列
            ['style', ['bold', 'italic', 'underline', 'clear']], // 字体粗体、字体斜体、字体下划线、字体格式清除
            ['font', ['strikethrough', 'superscript', 'subscript']], //字体划线、字体上标、字体下标
            ['fontsize', ['fontsize']], //字体大小
            ['color', ['color']], //字体颜色

            <!--段落工具-->
            ['style', ['style']],//样式
            ['para', ['ul', 'ol', 'paragraph']], //无序列表、有序列表、段落对齐方式
            ['height', ['height']], //行高

            <!--插入工具-->
            ['table',['table']], //插入表格
            ['hr',['hr']],//插入水平线

            <!--其它-->
            ['fullscreen',['fullscreen']], //全屏
            ['undo',['undo']], //撤销
            ['redo',['redo']], //取消撤销
        ],
    });

    $('#myTable').on('check.bs.table', function ($element, row) {
        setToolBarState()
    })
    $('#myTable').on('uncheck.bs.table', function ($element, row) {
        setToolBarState()
    })
    $('#myTable').on('check-all.bs.table', function ($element, row) {
        setToolBarState()
    })
    $('#myTable').on('uncheck-all.bs.table', function ($element, row) {
        setToolBarState()
    })
    $('#myTable').on('check-some.bs.table', function ($element, row) {
        setToolBarState()
    })
    $('#myTable').on('uncheck-some.bs.table', function ($element, row) {
        setToolBarState()
    })

    function setToolBarState() {
        selectedRows = bsTable.tbInstance.bootstrapTable('getSelections');
        if (selectedRows.length === 0) {
            $('#modify').prop('disabled', true);
            $('#delete').prop('disabled', true);
            return;
        }
        if (selectedRows.length === 1) {
            $('#modify').prop('disabled', false);
            $('#delete').prop('disabled', false);
            return;
        }
        if (selectedRows.length > 1) {
            $('#modify').prop('disabled', true);
            $('#delete').prop('disabled', false);
        }
    }


    $('#add').click(function () {
        showNoticeEdit()
    })

    $('#modify').click(function () {
        showNoticeEdit()
        modifyRow = selectedRows[0]
        $('#summernote').summernote('code', modifyRow.content);
        $('#noticeTitle').val(modifyRow.title);
    })

    $('#delete').click(function () {
        var deleteIds = [];
        selectedRows.forEach(function (item) {
            deleteIds.push({id: item.id});
        })
        var ajax = new $ax('/api/sys/notices/batch', function (data) {
            if (data.code === "0000") {
                toastr.success('已删除公告');
                bsTable.refresh()

                modifyRow = {};
                selectedRows = [];
                $('#modify').prop('disabled', true);
                $('#delete').prop('disabled', true);
            } else {
                toastr.warning(data.msg);
            }
        }, function (data) {
            toastr.warning(CSW.requestFail + data.msg);
        });
        ajax.setData(deleteIds);
        ajax.type = "DELETE";
        ajax.start();
    })

    $('#return').click(function () {
        dismissNoticeEdit()
    })
    
    $('#save').click(function () {
        var content = $('#summernote').summernote('code');
        var title = $('#noticeTitle').val();
        var type = $('#type').find("option:selected").text()
        if (!title || title.trim().length === 0) {
            toastr.warning('公告标题不能为空~');
            return;
        }
        if (!content || content.trim().length === 0) {
            toastr.warning('公告内容不能为空~');
            return;
        }
        var params = {
            title: title,
            content: content,
            noticeType: type,
        }

        var url = modifyRow.id ? '/api/sys/notices/' + modifyRow.id : '/api/sys/notices';
        var ajax = new $ax( url , function (data) {
            if (data.code === "0000") {
                toastr.success(modifyRow.id?'已更新公告信息':'已新增公告信息')
                bsTable.refresh()
                dismissNoticeEdit()
                modifyRow = {};
                selectedRows = [];
                $('#modify').prop('disabled', true);
                $('#delete').prop('disabled', true);
            } else{
                toastr.warning(data.msg);
            }
        }, function (data) {
            toastr.warning(CSW.requestFail + data.msg);
        });
        ajax.set(params);
        ajax.type = modifyRow.id ? "PUT" : "POST";
        ajax.start();
    })

    function showNoticeEdit() {
        $('#addOrEditDiv').css("display", "block");
        setTimeout(function () {
            $("#addOrEditDiv").css("transform", "translate(-100%, 0%)");
        }, 100);
        setTimeout(function () {
            $('#mainDiv').css("display", "none");
        },600)
    }

    function dismissNoticeEdit() {
        $('#summernote').summernote('code', '');
        $('#noticeTitle').val(null);

        $('#mainDiv').css("display", "block");
        setTimeout(function () {
            $("#addOrEditDiv").css("transform", "translate(0%, 0%)");
        }, 100);
        setTimeout(function () {
            $('#addOrEditDiv').css("display", "none");
        },600)
    }
});