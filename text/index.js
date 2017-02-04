/**
 * @mei
 * 2016.12.19
 */

// 全局变量
$(function(){

    //页面初始化拿数据
/*    $(document).scroll(function() {
      $(".enroll").css("top",$(window).height()-$(".enroll").height());
    });*/
    var load=false;
    var url="http://www.axyungou.com/";
    init();
    //初始化个人报名信息
    function init() {
        var html='',userDetail='';
        $.ajax({
            type    : 'POST',
            async   : false,
            url     : url+"mobile/wechatvote/isRegister",
            data    : {
                    },
            dataType:'json',
            success : function(data) {
                if(data.code==0){
                    if (data.data.is_register==1) {
                        var user=data.data.data;
                            html='<ul>'+
                                        '<li class="left">'+
                                            '<span class="enroll-order">'+data.data.rank+'</span>'+
                                            '<span class="enroll-avater"><img src="'+user.headimg+'" alt=""></span>'+
                                            '<span class="enroll-user"><i class="name">'+user.username+'</i></span>'+
                                        '</li>'+
                                        '<li class="center">'+user.wechat_vote_activity_id+'</li>'+
                                        '<li class="enroll-right">'+
                                            '<i>'+user.nums+'</i>'+
                                            '<span class="enroll-button">投票</span>'+
                                        '</li>'+
                                    '</ul>';
                            $('#wechat_vote_activity_id').val(user.wechat_vote_activity_id);
                            userDetail={
                                name:user.username,
                                wechat_vote_activity_id:user.wechat_vote_activity_id,
                                nums:user.nums
                            }
                            console.log(userDetail);
                        window.localStorage.setItem('userDetail',JSON.stringify(userDetail))
                    }else {
                        html='<div class="sign">我要报名</div>';
                    }
                }
            },
            error :function(){
                console.log('请求失败');
            }
        })
        $('.enroll').html(html);
    }
    
    //用户报名活动
    $(document).on("click",'.sign',function(){
        $('.register').show();
    })
    $(document).on("focus",'#mobile',function(){
        $('#mobile').val('');
    })
    $(document).on("click",'.registerDefine',function(){
        var mobile=$('#mobile').val();
        var error=checkMobile(mobile);
        if(error){
            $('#mobile').val(error);
        }else {
            $.ajax({
                type    : 'POST',
                async   : false,
                url     : url+"mobile/wechatvote/register",
                data    : {
                            mobile:mobile
                        },
                dataType:'json',
                success : function(data) {
                    if(data.code==0){
                        var num=data.data;
                        console.log(num);
                        pop("<h4>恭喜参加成功，您的编号为：</h4><p>"+num+"</p>","立即查看",0,'/mobile/wechatvote/index');
                        $('.register').hide();
                        $('.pageDialog').show();
                    }else if(data.code==1) {
                        console.log(data.code);
                        pop("<h5>您已报名,不能重复报名</h5>","立即查看",0,'/mobile/wechatvote/index');
                        $('.register').hide();
                        $('.pageDialog').show();
                    }
                },
                error :function(){
                    console.log(data.err);                     
                }
            })
        }

    })

    //获取列表数据
    glist_json(1);
    function glist_json(parm) {
        $.ajax({
            type    : 'POST',
            async   : false,
            url     : url+"mobile/wechatvote/getVoteStatisticsList",
            data    : {
                        page:parm,
                    },
            dataType:'json',
            success : function(data) {
                if(data.code==0){
                    $("#loading").css('display','none');
                    var ullist='';
                    var list=data.data.data;
                    if (list.length>0) {
                        $("#pagenum").val(parseInt(data.data.page.currentPage)+1);
                         $.each(list,function(i,n){
                             ullist+='<ul>'+
                                            '<li class="left">'+
                                                '<span class="order">'+(parseInt(parm-1)==0 ? (i<3 ?'<img src="../../../statics/templates/yungou/images/mobile/active/'+(i+1)+'.png" >' : (i+1)) : (i==9 ? (parseInt(parm)+''+0) :(parseInt(parm-1)+''+(i+1)) ) )+'</span>'+
                                                '<span class="avater"><img src="'+n.headimg+'" ></span>'+
                                               '<span class="user"><i class="name"> '+n.username+'</i><br>编号：<i class="num">'+n.wechat_vote_activity_id+'</i></span>'+
                                            '</li>'+
                                            '<li class="right">'+
                                                '<i>'+n.nums+'</i>'+
                                                '<span class="button">投票</span>'+
                                            '</li>'+
                                        '</ul>';
                        })
                        if (data.data.page.currentPage>=data.data.page.totalPage) {
                            load=true;
                            $("#btn_Page").html('已经到底了');
                        }else if(data.data.page.currentPage<data.data.page.totalPage) {
                            load=false;
                            $("#btn_Page").html('查看更多');
                        }
                    }else {
                        load=true;
                        $("#btn_Page").html('没有数据了'); 
                    }
                    $('#return').hide();
                    $("#btn_Page").show();
                    $('.ullist').append(ullist);
                    

                }
            },
            error :function(){
                console.log('请求失败');
            }
        })

    }

    //==============核心代码=============  
    var winH = $(window).height(); //页面可视区域高度   
  
    var scrollHandler = function () {  
        var pageH = $(document.body).height();  
        var scrollT = $(window).scrollTop(); //滚动条top   
        var aa = (pageH - winH - scrollT) / winH;
        if (aa < 0.02) {//0.02是个参数 
            if(load==false) {
                load=true;
                page=$("#pagenum").val();
                glist_json(page); 
            }
            
        }  
    }
     //定义鼠标滚动事件  
    $(window).scroll(scrollHandler);  


    //继续加载按钮事件  
    $(document).on("click",'#btn_Page',function(){
        console.log(444)
        if(load==false) {
            load=true;
            page=$("#pagenum").val();
            glist_json(page); 
        }
    }) 
     //按编号搜索  
    $(document).on("click",'.search .icon',function(){

        var val=$('.search input').val();
        $.ajax({
            type    : 'POST',
            async   : false,
            url     : url+"mobile/wechatvote/getVoteUser",
            data    : {
                        wechat_vote_activity_id:val,
                    },
            dataType:'json',
            success : function(data) {
                var term=data.data.data;
                if(data.code==0){
                   var li='<ul>'+
                                '<li class="left">'+
                                    '<span class="order">'+data.data.rank+'</span>'+
                                    '<span class="avater"><img src="'+term.headimg+'" ></span>'+
                                   '<span class="user"> <i class="name">'+term.username+'</i><br>编号：<i>'+term.wechat_vote_activity_id+'</i></span>'+
                                '</li>'+
                                '<li class="right">'+
                                    '<i>'+term.nums+'</i>'+
                                    '<span class="button">投票</span>'+
                                '</li>'+
                            '</ul>';
                }else if(data.code==1) {
                    alert(data.err);
                }
                $('.ullist').html(li);
                $('#btn_Page').hide();
                $('#return').show();
            },
            error :function(){
                console.log('请求失败');
            }
        })
    })
    $(document).on("click",'#return',function(){
        $('.ullist').html('');
        glist_json(1);
    })
    $(document).on("click",'.button',function(){
        var name=$(this).parent().siblings('.left').find('.name').text();
        var num=$(this).parent().siblings('.left').find('.num').text();
        $('#num').val(num);
        pop("<h4>投票给选手</h4><p>"+name+"</p>","",1,'');
        $('.pageDialog').show();
    })
    $(document).on("click",'.enroll-button',function(){
        var name=$(this).parent().siblings('.left').find('.name').text();
        var num=$(this).parent().siblings('.center').text();
        $('#num').val(num);
        pop("<h4>投票给选手</h4><p>"+name+"</p>","",1,'');
        $('.pageDialog').show();
    })
    $(document).on("click",'.close',function(){
        $('.pageDialog').hide();
    })
    $(document).on("click",'.registerClose',function(){
        $('.register').hide();
    })
    $(document).on("click",'.define',function(){
        var num=$('#num').val();
        console.log(num);
        var content='';
        $.ajax({
            type    : 'POST',
            async   : false,
            url     : url+"mobile/wechatvote/vote",
            data    : {
                        wechat_vote_activity_id:num,
                    },
            dataType:'json',
            success : function(data) {
                console.log(data);
                if(data.code==0){
                    content="恭喜您为喜爱的选手投出宝贵的一票";
                }else{
                    content="您已经投票，不能重复投票"
                }
            },
            error :function(){
                if(data.code==1) {
                    content="您已经投票，不能重复投票"
                }
            }
        })
        pop('<h5>'+content+'</h5>','立即分享',0,'/mobile/activityshare/share?activity_id='+num);
        $('.pageDialog').show();
    })

    //公共弹框
    function pop(name,btn,type,href){
        var content='';
        if (type) {
            content+='<div class="txt">'+name+'</div>'+
                       '<div class="Btn">'+
                            '<div class="Btn-li close">取消</div>'+
                            '<div class="Btn-li define">确定</div>'+
                        '</div>'
        }else {
            content+='<div class="txt">'+name+'</div>'+
                    '<div class="Btn">'+
                        '<a class="share-btn" href="'+href+'">'+btn+'</a>'+
                    '</div>'
        }
        $('.pageDialog .pannel').html(content);
    }
    //检验手机号码
    function checkMobile(mobile){
        if(mobile){
            var len = mobile.length;
        }            

        if(len<=0){
            return '请填写手机号码';
        }
        if(!/^1\d{10}$/.test(mobile)){
            return '请您输入正确的手机号';
        }
    }
    

})
   