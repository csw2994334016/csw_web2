$(function () {
    var Table = {
        api: '',
        tableId: "myTable",
        toolbarId: "toolbar",
        bsTable: null,
        bsModal: null
    };
    Table.initColumn = function () {
        var columns = [
            {field: 'state', checkbox: true, align: 'center', valign: 'middle', width: '5%'},
            {title: 'ID', field: 'checkNo', align: 'center', width: '10%'},
            {title: '标题', field: 'title', align: 'center', width: '70%'},
            {title: '时间', field: 'time', align: 'center', width: '15%%'}
        ];
        return columns;
    };
    var bsTable = new BSTable(Table.tableId, Table.toolbarId, CSW.getUrl(Table.api), Table.initColumn());
    bsTable.setStyle(undefined, true, true, false, true, true)
    bsTable = bsTable.init();

    $('#summernote').summernote({
        height: $(window).height(),
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
            ['link',['link']], //插入链接

            <!--其它-->
            ['fullscreen',['fullscreen']], //全屏
            ['undo',['undo']], //撤销
            ['redo',['redo']], //取消撤销
        ],
    });

    $('#add').click(function () {
        $('#addOrEditDiv').css("display", "block");
        setTimeout(function () {
            $("#addOrEditDiv").css("transform", "translate(-100%, 0%)");
        }, 300);
    })
});