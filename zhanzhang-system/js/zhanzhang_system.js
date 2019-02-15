$(function () {
    if (window.location.host === 'ziyuan.baidu.com') {
        $('body').append('<div id="config_box" style="display:none;text-align:center;width:500px;height:350px;position:fixed;top:50%;left:50%;margin-left:-250px;margin-top:-175px;background:#fff;border:1px solid #ccc;border-radius:5px;"><h2 id="config_title">参数配置</h2><ul style="position:absolute;top:90px;left:0;right:0;margin: 0 auto;height:112px;">' +
            '<li><label for="start_page" title="例：1（大于等于1）">起始页码：</label><input id="start_page" placeholder="例：1（大于等于1）" value="1"></li>' +
            '<li><label for="end_page" title="例：400（小于等于500）">结束页码：</label><input id="end_page" placeholder="例：400（小于等于500）"></li>' +
            '<li><label for="time_range" title="查看近一周数据输入week，近一月数据输入month\n自定义时间段举例：2019年2月12日到13日的数据，则输入2019-02-12:2019-02-13">采集时段：</label><input id="time_range" placeholder="鼠标放到\'采集时段\'显示说明"></li>' +
            '<li><label for="web_site">采集站点：</label><input id="web_site" placeholder="例：http://www.baidu.com"></li>' +
            '<li><label for="duration_req" title="推荐填写3，不建议改动">请求间隔：</label><input id="duration_req" placeholder="例：3" value="3"></li>' +
            '</ul><div id="kw_btn_box" style="position:absolute;bottom:40px;left:0;right:0;"><span id="kw_btn_close" class="span_btn">关闭</span><span id="kw_btn_test" class="span_btn">计算页码</span></div><div>');
        $('.tools-con .tools-setting-def').after('<div style="height:38px;line-height:38px;position:absolute;top:0;left:670px;bottom:0;margin:auto;" class="cj_st_wrapper"><a class="cj_st" id="kw_start">开始采集</a> <a class="cj_st" id="kw_config">参数配置</a></div>');
        $('#config_box input').css({ 'width': '200px' });
        $('#config_box li').css('line-height', '35px');
        $('.cj_st').css('padding', '0 10px');
        $('#web_site').val($('.select-domain').val());
        $('#config_box .span_btn').css({ 'display': 'inline-block', 'width': '80px', 'height': '26px', 'background': 'none', 'border': '1px solid #ccc', 'border-radius': '5px', 'margin': 'auto 10px' });
        $('#kw_btn_close').on('click', function () {
            $('#config_box').fadeOut();
        });
        $('#kw_config').on('click', function () {
            $('#config_box').fadeIn();
        });
        $('#kw_start').on('click', TbDisplay);
        $('#kw_btn_test').on('click', KwGetPage);
    }
    function GetDateStr(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0
        var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();//获取当前几号，不足10补0
        return y + "-" + m + "-" + d;
    }
    function GetDateTo() {
        var dd = new Date();
        dd.setDate(dd.getDate());
        var y = dd.getFullYear();
        var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0
        var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();//获取当前几号，不足10补0
        return y + "-" + m + "-" + d;
    }
    function GetDate(val) {
        if (val.match('week') !== null) {
            return GetDateStr(-7) + '_' + GetDateTo();
        }
        else if (val.match('month') !== null) {
            return GetDateStr(-30) + '_' + GetDateTo();
        }
        else {
            return val.split(':')[0] + '_' + val.split(':')[1];
        }
    }
    function KwGetPage() {
        var wbSite = $('#web_site').val();
        var tmRange = $('#time_range').val();
        if (!tmRange) {
            alert('请输入采集时段');
            return;
        }
        $('#kw_btn_test').html('<img style="vertical-align:middle;width:20px;" src="https://tongji.baidu.com/web/css/decorator/loading.gif">');
        $.ajax({
            url: 'https://ziyuan.baidu.com/keywords/keywordlist',
            type: 'GET',
            dataType: 'json',
            data: {
                site: wbSite,
                range: tmRange,
            },
            success: function (data) {
                $('#kw_btn_test').html('计算页码');
                var count = data.count;
                if (typeof (count) !== 'number') {
                    alert('采集时间段有误，请重新填写');
                    return;
                }
                $('#end_page').val(Math.ceil(count / 100));
            }
        });
    }
    function TbDisplay() {
        var sp_val = $('#start_page').val();
        var ep_val = $('#end_page').val();
        var tr_val = $('#time_range').val();
        var ws_val = $('#web_site').val();
        var dr_val = $('#duration_req').val();
        if (sp_val && ep_val && tr_val && ws_val && dr_val) {
            $('#kw_data_box').remove();
            $('body').append('<div id="kw_data_box" style="display:none;background:#fff;overflow:scroll;position:fixed;top:50%;left:50%;width:1000px;height:500px;margin-left:-500px;margin-top:-250px;"><table border="1" id="tableToExcel"><tr><th>关键词</th><th>展现量</th><th>点击量</th><th>总排名</th><th>平均排名</th><th>点击率</th></tr></table></div>');
            $('.cj_st_wrapper').html('<img style="vertical-align:middle;width:20px;" src="https://tongji.baidu.com/web/css/decorator/loading.gif"> <span id="kw_em_wrapper">共<em class="all_req_times" style="color:blue;font-weight:bold;font-size:16px">' + (ep_val - sp_val + 1) + '</em>次请求，还剩<em class="another_req_times" style="color:red;font-weight:bold;font-size:16px">' + (ep_val - sp_val + 1) + '</em>次请求待完成...</span>');
            KwAjaxBaidu(sp_val, ep_val, tr_val, ws_val, dr_val);
        } else {
            alert('请先填写参数配置');
        }
    }
    function KwAjaxBaidu(startPage, endPage, timeRange, webSite, duraRep) {
        $.ajax({
            url: 'https://ziyuan.baidu.com/keywords/keywordlist',
            type: 'GET',
            dataType: 'json',
            data: {
                site: webSite,
                range: timeRange,
                page: startPage,
                pagesize: 100
            },
            success: function (data) {
                var kw_page = data.page;    //页码        number
                var kw_list = data.list;    //数据        array
                var kw_str = '';            //数据字符串   string
                $('#kw_em_wrapper .another_req_times').text(endPage - kw_page);
                $.each(kw_list, function (i, val) {
                    kw_str += '<tr><td>' + val['query'] + '</td><td>' + val['total_display'] + '</td><td>' + val['total_click'] + '</td><td>' + val['total_rank'] + '</td><td>' + val['average_rank'] + '</td><td>' + val['click_rate'] + '</td></tr>';
                });
                $('#tableToExcel').html($('#tableToExcel').html() + kw_str);
                kw_page++;
                if (kw_page > endPage) {
                    $('.cj_st_wrapper').html('<a class="cj_st" id="kw_download" style="height:28px;">下载表格</a> <a class="cj_st" id="kw_start">开始采集</a> <a class="cj_st" id="kw_config">参数配置</a>');
                    $('.cj_st').css('padding', '0 10px');
                    $('#kw_btn_close').on('click', function () {
                        $('#config_box').fadeOut();
                    });
                    $('#kw_config').on('click', function () {
                        $('#config_box').fadeIn();
                    });
                    $('#kw_start').on('click', TbDisplay);
                    $('#kw_btn_test').on('click', KwGetPage);
                    var html = "<html><head><meta charset='utf-8' /><style type='text/css'>table td{font-size:14px;font-family:'宋体';}</style></head><body>" + document.getElementById("tableToExcel").outerHTML + "</body></html>";
                    var blob = new Blob([html], { type: "application/vnd.ms-excel" });
                    var a = document.getElementById("kw_download");
                    a.href = URL.createObjectURL(blob);
                    a.download = webSite + '_' + GetDate(timeRange) + '.xls';
                    return;
                }
                setTimeout(function () {
                    KwAjaxBaidu(kw_page, endPage, timeRange, webSite, duraRep);
                }, duraRep * 1000);
            }
        });
    }
});