window.addEventListener('load', function() {

    // 轮播图
    // 获取元素
    var arrow_l = document.querySelector('.arrow-l');
    var arrow_r = document.querySelector('.arrow-r');
    var focus = document.querySelector('.focus');
    var focusWidth = focus.offsetWidth;
    // 鼠标经过显示 左右按钮
    focus.addEventListener('mouseenter', function() {
        arrow_l.style.display = 'block';
        arrow_r.style.display = 'block';
        clearInterval(timer);
        timer = null;
    })
    focus.addEventListener('mouseleave', function() {
        arrow_l.style.display = 'none';
        arrow_r.style.display = 'none';
        timer = setInterval(function() {
            // 手动调用点击事件
            arrow_r.click();
        }, 2000)
    })

    // 动态生成 小圆圈
    var ul = focus.querySelector('ul');
    var ol = focus.querySelector('.circle');
    for (var i = 0; i < ul.children.length; i++) {
        // 创建一个小li
        var li = document.createElement('li');
        // 记录当前小圆圈的索引号
        li.setAttribute('index', i);
        // 把li 插入到ol里面
        ol.appendChild(li);
        // 我们可以在生成li的同时，绑定点击事件（排他思想）
        li.addEventListener('click', function() {
            // 干掉所有人
            for (var i = 0; i < ol.children.length; i++) {
                ol.children[i].className = '';
            }
            // 留下我自己
            this.className = 'current';
            // 点击小圆圈，移动图片
            // ul的移动距离 小圆圈的索引号 乘以 图片的宽度 （负值）
            var index = this.getAttribute('index');
            // 当我们点击了某个小li 就要把li 的索引号给num
            num = index;
            // 当我们点击了某个小li 就要把li 的索引号给circle
            circle = index;
            console.log(focusWidth);
            console.log(index);

            animate(ul, -index * focusWidth)
        })
    }
    // 把ol 里面的第一个 li类名设置为current
    ol.children[0].className = 'current';
    // 克隆第一张图片 放到ul最后面
    var first = ul.children[0].cloneNode(true);
    ul.appendChild(first);
    // 点击右侧按钮，图片移动一张
    var num = 0;
    // circle控制小圆圈的播放
    var circle = 0;
    var flag = true;
    arrow_r.addEventListener('click', function() {
        if (flag) {
            flag = false; //关闭节流阀
            // 如果走到了最后复制的一张图片， 此时 我们的ul 要快速复原 left = 0
            if (num == ul.children.length - 1) {
                ul.style.left = 0;
                num = 0;
            }
            num++;
            animate(ul, -num * focusWidth, function() {
                flag = true;
            });
            // 点击右侧按钮，小圆圈跟随一起变化 可以再声明一个变量控制小圆圈的播放
            circle++;
            // 判断条件，如果circle=4,说明走到了克隆的那张图片，我们就复原
            if (circle == ol.children.length) {
                circle = 0;
            }
            circleChange()
        }

    });
    // 左侧按钮
    arrow_l.addEventListener('click', function() {
        // 如果走到了最后复制的一张图片， 此时 我们的ul 要快速复原 left = 0
        if (flag) {
            flag = false; //关闭节流阀
            if (num == 0) {
                num = ul.children.length - 1;
                ul.style.left = -num * focusWidth + 'px';

            }
            num--;
            animate(ul, -num * focusWidth, function() {
                flag = true;
            });
            // 点击右侧按钮，小圆圈跟随一起变化 可以再声明一个变量控制小圆圈的播放
            circle--;
            // 判断条件，如果circle<0,说明走到了第一张图片，我们就将小圆圈索引号改为3
            if (circle < 0) {
                circle = ol.children.length - 1;
            }
            circleChange()
        }
    });

    function circleChange() {
        // 先清除其余小圆圈的current类名
        for (var i = 0; i < ol.children.length; i++) {
            ol.children[i].className = '';
        }
        ol.children[circle].className = 'current';
        // 留下当前小圆圈的current类名
    }
    // 添加自动播放
    var timer = setInterval(function() {
        // 手动调用点击事件
        arrow_r.click();
    }, 2000);


})
$(function() {
    var flag;
    // 电梯导航
    //1、显示或者隐藏电梯导航

    // 页面一加载就要判断显示还是隐藏
    taggleTool();

    function taggleTool() {
        var toolTop = $(".recommend").offset().top;
        if ($(document).scrollTop() >= toolTop) {
            $(".fixedtool").fadeIn();
        } else {
            $(".fixedtool").fadeOut();
        }
    }
    $(window).scroll(function() {
            // 页面滚动  还要要判断显示还是隐藏
            taggleTool();
            if (flag) {
                // 3、当我们页面滚动到内容区域某个模块， 左侧电梯导航，相对应的小li模块，也会添加current类， 兄弟移除current类。
                // 需要用到each，遍历 div  内容区域大模块。 each里面能拿到内容区域每一个模块元素和索引号
                $(".floor .w").each(function(i, ele) {
                    if ($(document).scrollTop() >= $(ele).offset().top)
                        $(".fixedtool li").eq(i).addClass("current").siblings().removeClass();
                })
            }
        })
        // 2、 点击电梯导航页面可以滚动到相应内容区域
    $(".fixedtool li").click(function() {
            flag = false;
            //拿到当前小li的索引号  console.log($(this).index());
            // 当我们每次点击小li ，就需要计算出页面要去往的位置
            // 选出对应索引号的内容区域的盒子 计算它的 .offset().top
            var current = $(".floor .w").eq($(this).index()).offset().top;
            // 页面元素滚动效果
            $("body, html").stop().animate({
                    scrollTop: current
                }, function() {
                    flag = true;
                })
                // 点击之后 让当前的小li 条件current类名，其他姐妹移除current类名
            $(this).addClass("current").siblings().removeClass();
        })
        // 搜索框 search中 的input
    var text = document.querySelector('input');
    text.onfocus = function() {
        // console.log('得到焦点');
        if (this.value === '请搜索内容') {
            this.value = '';

        }
        this.style.color = '#333';
    }
    text.onblur = function() {
        // console.log('失去焦点');
        if (this.value === '') {
            this.value = '请搜索内容';

        }
        this.style.color = '#ccc';
    }
})