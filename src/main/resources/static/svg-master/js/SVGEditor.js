/*!
 * svg v1.0.0
 * Copyright 2017.12, Inc.
 * Producer chenglong
 */


;(function () {
    //获取元素
    var svg = Snap("#svg");
    var showShape = document.querySelector('.action-show'), //展示元素
        createShape = document.querySelector('.create-shape'), //创建形状
        create = document.querySelector('.create'), //创建按钮
        face = document.querySelector('.face'), //填充和边框
        hengshu = document.querySelector('.hengshu'), //横竖转换
        transform = document.querySelector('.transform'),
        selected = null, //当前作用的图形元素
        fillValue = 0,
        strokeValue = 0,
        strokeWidth = 0,
        translateX = document.getElementById('translate-x'),
        translateY = document.getElementById('translate-y'),
        scale = document.getElementById('scale'),
        rotate = document.getElementById('rotate'),

        //默认属性值
        ax2 = 50,
        astrokeWidth = 5,
        awidth = 10,
        aheight = 30,
        arotate = 1,
        atext = "函数栈",
        textId=0,
        height  = 30;
        start = 20;

        width = 80;

        s1=0,
        s2=0,
        //外观记录参数
        // waiguan1,waiguan2,waiguan3,

        // 创建默认的svg图形和元素,ns===namespace命名空间
        svgNS = 'http://www.w3.org/2000/svg',
        defaultShape = {
            rect: '50, 50, 100, 60, 0',
            image: '200,200,50',
            line: '50,50,150,50',
            text: '50,50'
        },
        // 默认图形的公共属性
        defaultAttrs = {
            fill: '#fff',
            stroke: '#007fff'
        };
        var p1 = svg.paper.path("M0,2 L7,5 L0,8").attr({
            fill: "#000"
        });
        var m2 = p1.marker(0, 0, 13, 13, 2, 5);

    //绑定点击元素事件
    svg.paper.click(function (e) {
        document.getElementById('xz').innerHTML = '';
        var ele;
        // 创建多个图形，点击后选择当前图形
        if (e.target.localName == 'text') {
            ele = e.target;
            selected = Snap(ele);
            selected.drag();
            var att = Snap(selected).attr();
            createHandler(e.target.tagName, e.target.tagName, att);
            s1=Snap(selected).matrix.e;
            s2=Snap(selected).matrix.f;
        } else if (e.target.parentElement.localName == 'g') {
            ele = e.target.parentElement;
            selected = Snap(ele);
            selected.drag();
            // var attrs = defaultShape[e.target.tagName].split(',');
            //
            // createHandler(e.target.tagName, e.target.tagName, attrs);
            s1=Snap(selected).matrix.e;
            s2=Snap(selected).matrix.f;
        } else {
            ele = e.target;
            selected = Snap(ele);
            selected.drag();
            if (e.target.tagName == 'line') {
                ax2 = Snap(e.target).attr('x2');
                astrokeWidth = parseInt(Snap(e.target).attr('strokeWidth'));
            } else if (e.target.tagName == 'rect') {
                awidth = parseInt(Snap(e.target).attr('width'));
                aheight = parseInt(Snap(e.target).attr('height'));
            } else if (e.target.tagName == 'image') {
                awidth = parseInt(Snap(e.target).attr('width'));
                aheight = parseInt(Snap(e.target).attr('height'));
            }
            createHandler(e.target.tagName, e.target.tagName);
            s1=Snap(selected).matrix.e;
            s2=Snap(selected).matrix.f;
        }



        if (e.target.tagName.toLowerCase() == 'image') {
            $('.ihide').hide();
        } else {
            $('.ihide').show();
        }

        $('#fill').val(RGBToHex(Snap(selected).attr('fill')))
        $('#stroke').val(RGBToHex(Snap(selected).attr('stroke')))
        $('#stroke-width').val(parseInt(Snap(selected).attr('strokeWidth')));

    });

    //绑定键盘删除事件
    $(document).bind('keydown', function (e) {
        if (e.which == 46) {
            if(selected==''){
                alert('请选中图中元素')
                return face
            }
            var r = confirm("是否删除该元素")
            if (r == true) {
                Snap(selected).remove();
                selected='';
            }
            else {

            }
        }

    })
    //复制按钮 复制svg
    var clipboard = new Clipboard('#fuzhi', {
        text: function() {
            return $(".action-show").html();
        }
    });

    clipboard.on('success', function(e) {
        alert('成功复制！')
    });

    clipboard.on('error', function(e) {
        alert('复制失败！')
    });


    //保存记录按钮
    $('#save').click(function () {
        window.localStorage.setItem('vhtml',$("#svg").html());
        alert('保存成功！')
    });
    //清楚记录按钮
    $('#qingchu').click(function () {
        window.localStorage.removeItem('vhtml');
        alert('清除成功！')
    });
    //一键清除
    $('#clear').click(function () {
        $("#svg").html('')
    });
    //创建元素前，选择selcet来进行赋值给按钮
    $('.selectChange').bind('change', function (e) {
        if ($(this).val() == 'image') {
            $('.ihide').hide();
        } else {
            $('.ihide').show();
        }
        $('.changeName').attr({
            'id': $(this).val(),
            'sname': $('.selectChange').find('option:selected').attr('t'),

        })
    })


    // 创建图形的按钮事件
    create.addEventListener('click', createShapeF, false);

    // 图形的按钮事件
    function createShapeF(e) {
        if (e.target.tagName.toLowerCase() === 'button') {
            // 创建图形
            var shape = e.target.id;
            var imgStr = $(e.target).attr('sname');

            // 创建选择的图形
            selectShape(shape, imgStr);
        }
    }

    // 创建图形和默认属性
    function selectShape(shape, imgStr) {
        // 绘制默认图形的所以属性用逗号分开为一个数组
        // var attrs = defaultShape[shape].split(',');
        // 绘制图形后，根据所绘制的图形的参数，生成控制参数
        // 的操作按钮
        createShape.innerHTML = '';

        var attr, //获取每一个图形的属性
            name,  //设置每一个图形的属性
            value; //每一个图形的属性值
        var str = "img/" + imgStr + ".svg"

        // if (shape == 'line') {
        //     selected = svg.paper.line(attrs[0], attrs[1], attrs[2], attrs[3]).attr({
        //         fill: "#000" ,
        //         stroke: "#000",
        //         strokeWidth: 3,
        //     }).drag();
        //
        // } else if (shape == 'rect') {
        //     selected = svg.paper.rect(attrs[0], attrs[1], attrs[2], attrs[3], attrs[4]).attr({
        //         fill: "#fff" ,       // 红色
        //         stroke:"#000"
        //     }).drag();
        // } else if (shape == 'text') {
        //     var str1='"'+(new Date().getTime())+'"';
        //     var strData='D'+str1.substring(8,13);
        //     textId=textId+1;
        //     selected = svg.paper.text(attrs[0], attrs[1], atext).attr({dataid:strData,id:'text'+textId}).attr({
        //         fill: "#000" ,       // 红色
        //         stroke:"#000"
        //     }).drag();
        //     // dataid
        // } else if (shape == 'image') {
        //     selected = svg.paper.image(str, 10, 10, 80, 80).drag();
        // } else
        if (shape == 'func') {

            selected = svg.paper.g();

            for (var i = 0; i < 2; i++) {
                var c = svg.paper.rect(start+0, start+i*height, width, height, 0).attr(
                    {
                        fill:"#fff",
                        stroke:"#000"
                    }
                );
                selected.add(c);

                var text = svg.paper.text(start+15, start+20+i*height, atext).attr({
                    fill: "#000" ,
                    stroke:"#000"
                }).drag();
                selected.add(text);

            }
        } else if (shape == 'array') {
            var ainfo = prompt("请输入数组名称和大小，用,隔开", "a,3");
            var name = ainfo.split(",")[0];
            var size = ainfo.split(",")[1];
            selected = svg.paper.g();
            var nameWidth = 50;
            for (var i = 0; i < size; i++) {

                var a = svg.paper.text(start, start+20+i*height, name+"["+(size-i-1)+"]").attr({
                    fill: "#000" ,
                    stroke:"#000"
                }).drag();
                selected.add(a);

                var c = svg.paper.rect(start+nameWidth, start+i*height, width, height, 0).attr(
                    {
                        fill:"#fff",
                        stroke:"#000"
                    }
                );
                selected.add(c);

                var text = svg.paper.text(start+nameWidth+15, start+20+i*height, "值").attr({
                    fill: "#000" ,
                    stroke:"#000"
                }).drag();
                selected.add(text);
            }
        } else if (shape == 'var') {
            var name = "a";
            var type = "type";
            selected = svg.paper.g();

            var c = svg.paper.rect(start+0, start+height, width, height, 0).attr(
                {
                    fill:"#fff",
                    stroke:"#000"
                }
            );
            selected.add(c);

            var text = svg.paper.text(start+15, start+20+height, type+" " +name).attr({
                fill: "#000" ,
                stroke:"#000"
            }).drag();
            selected.add(text);

        } else {
            var a = "20,20 40,20 40,80 22,80";
            selected = svg.paper.polyline(a).attr({
                fill: "#fff" ,
                stroke: "#000",
                strokeWidth: 1,
                "marker-end": m2
            }).drag();
        }

        // value = attrs;
        // 	// 创建图形处理按钮
        createHandler(shape, shape, value);

    }

    // 创建形状区域的控制器
    function createHandler(shape, name, value) {
        var odiv = document.createElement('div');
        if (shape == 'polyline') {
            odiv.innerHTML = '<button type="button" class="hengshu">旋转</button><button type="button" class="jiantou">加箭头</button><label>长 <input type="range" min="1" max="800" value="' + ax2 + '" name="chang" /><span class="changS">'+ax2+'</span></label>' + '<label>宽 <input type="range" min="1" max="50" value="' + astrokeWidth + '" name="kuan" /><span class="kuanS">'+astrokeWidth+'</span></label>';
        } else if (shape == 'rect') {
            var sstr='空心'
            if(Snap(selected).attr("fill-opacity")==0){
                var sstr='实心'
            }

            odiv.innerHTML = '<button type="button" class="kongxin">'+sstr+'</button><label>宽 <input type="range" min="1" max="500" value="' + awidth + '" name="chang" /><span class="changS">'+awidth+'</span></label>' + '<label>高 <input type="range" min="1" max="500" value="' + aheight + '" name="kuan" /><span class="kuanS">'+aheight+'</span></label>';

        } else if (shape == 'text') {
            if(Snap(selected).attr("text")!='text'){
                atext=Snap(selected).attr("text");
            }
            if(Snap(selected).attr("font-size")){
                awidth=parseInt(Snap(selected).attr("font-size"));
            }
            odiv.innerHTML = '<label>大小 <input type="range" min="1" max="200" value="' + awidth + '" name="chang" /><span class="changS">'+awidth+'</span></label><label>文字 <input type="text" maxlength="30" value="' + atext + '" name="kuan" /></label>';
        }
        createShape.appendChild(odiv);
    }

    // zindex 元素层级控制
    $('#zindex_1').click(function () {
        var obj = document.getElementById("svg").lastChild
        Snap(obj).after(Snap(selected));
    })
    $('#zindex_2').click(function () {
        var obj = document.getElementById("svg").firstElementChild
        Snap(obj).before(Snap(selected));
    })

    // 形状的控制手柄的事件
    // html5新增的输入框改变的事件，对于onchange事件来说，不用等到用户释放鼠标
    // 再改变值
    createShape.addEventListener('input', function (e) {
        if (e.target.tagName.toLowerCase() === 'input') {
            if (selected.type == 'line') {
                if (e.target.name == 'chang') {
                    $('.changS').text(parseInt(e.target.value) + 50)
                    Snap(selected).attr({
                        x2: parseInt(e.target.value) + 50,
                    });
                } else if (e.target.name == 'kuan') {
                    $('.kuanS').text(parseInt(e.target.value))
                    Snap(selected).attr({
                        strokeWidth: parseInt(e.target.value),
                    });
                }
            } else if (selected.type == 'rect') {
                if (e.target.name == 'chang') {
                    $('.changS').text(parseInt(e.target.value))
                    Snap(selected).attr({
                        width: parseInt(e.target.value),
                    });
                } else if (e.target.name == 'kuan') {
                    $('.kuanS').text(parseInt(e.target.value))
                    Snap(selected).attr({
                        height: parseInt(e.target.value),
                    });
                }
            } else if (selected.type == 'text') {
                if (e.target.name == 'chang') {
                    $('.changS').text(parseInt(e.target.value))
                    Snap(selected).attr({
                        fontSize: parseInt(e.target.value),
                    });
                } else if (e.target.name == 'kuan') {

                    Snap(selected).attr({
                        text: e.target.value,
                    });
                }
            } else if (selected.type == 'polyline') {
                if (e.target.name == 'chang') {
                    $('.changS').text(parseInt(e.target.value) + 50);
                    var des = Snap(selected);
                    Snap(selected).attr({
                        x2: parseInt(e.target.value) + 50,
                    });
                } else if (e.target.name == 'kuan') {
                    $('.kuanS').text(parseInt(e.target.value))
                    Snap(selected).attr({
                        strokeWidth: parseInt(e.target.value),
                    });
                }
            }
        }
    }, false);

    //横竖转换按钮
    $(document).on('click', '.hengshu', function (e) {
        if ($(this).attr('t') == 1) {
            Snap(selected).transform(new Snap.Matrix().translate(s1,s2).rotate(180, 50, 50));
            $(this).attr('t', '2');
        } else if ($(this).attr('t') == 2){
            $(this).attr('t', '3');
            Snap(selected).transform(new Snap.Matrix().translate(s1,s2).rotate(270, 50, 50));
        } else if ($(this).attr('t') == 3){
            $(this).attr('t', '4');
            Snap(selected).transform(new Snap.Matrix().translate(s1,s2).rotate(0, 50, 50));
        } else {
            $(this).attr('t', '1');
            Snap(selected).transform(new Snap.Matrix().translate(s1,s2).rotate(90, 50, 50));
        }
    });
    //按钮加箭头
    $(document).on('click', '.jiantou', function (e) {
        Snap(selected).attr({
            "marker-end": m2
        })
    });
    //按钮空心
    $(document).on('click', '.kongxin', function (e) {
        if(Snap(selected).attr("fill-opacity")==0){
            $(this).text('空心');
            Snap(selected).attr({
                "fill-opacity": 1
            })
        }else{
            $(this).text('实心');
            Snap(selected).attr({
                "fill-opacity": 0
            })
        }

    });

    // 外观事件
    face.addEventListener('input', function (e) {
        // 如果当前没有选中任何元素的话，弹出提示框
        if (!selected) {
            alert('请先创建图形');
            // selected为null,非null则为true
            return;
        }

        if (e.target.tagName.toLowerCase() === 'input') {
            var oname = e.target.id;
            switch (oname) {
                case 'fill':
                    Snap(selected).attr({
                        fill: e.target.value,
                    });
                    break;
                case 'stroke':
                    Snap(selected).attr({
                        stroke: e.target.value,
                    });
                    break;
                case 'stroke-width':
                    Snap(selected).attr({
                        strokeWidth: e.target.value,
                    });
                    break;
            }

        }
    }, false);

    $(document).ready(function () {
        if(window.localStorage.getItem('vhtml')!=null){
            // $('#svg').html(window.localStorage.getItem('vhtml'));
        }
    })

    function RGBToHex(rgb){
        var regexp = /[0-9]{0,3}/g;
        var re = rgb.match(regexp);
        var hexColor = "#"; var hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
        for (var i = 0; i < re.length; i++) {
            var r = null, c = re[i], l = c;
            var hexAr = [];
            while (c > 16){
                r = c % 16;
                c = (c / 16) >> 0;
                hexAr.push(hex[r]);
            } hexAr.push(hex[c]);
            if(l < 16&&l != ""){
                hexAr.push(0)
            }
            hexColor += hexAr.reverse().join('');
        }
        return hexColor;
    }
})()