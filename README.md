# 前端分词
## 典型应用场景 地址智能解析
使用方法：
```
    var data={
        '0':{
            '86':'中国'
        },
        '86':{
            '10000':'北京',
            '10001':'上海'
        }
    };
    GIS=GIS.index; //
    GIS.setStopLevel(4);  //设置最大解析深度
    GIS.setLibrary(data); //设置对照表
    //解析地址 类似 北京北京市朝阳区
    new GIS('中国上海').start().then(function(data){
        console.log(data)
    });
    //解析信息 类似 收件人：张三，联系电话：02112345678，手机号：19912345678，地址：北京北京市朝阳区
    new GIS('中国上海').splitInfomation().then(function(data){
        console.log(data)
    });
    //动态解析时需要
    GIS.on('noChildren',function (cityModel) {
        var code=cityModel.code;
        $.ajax({
            type: "POST",
            data: {
                areaCode:cityModel.code
            },
            dataType: "json",
            url: 'url',
            success: function (response) {
                data[cityModel.code]=$.isPlainObject(response)&&!$.isEmptyObject(response)&&response||false;
                cityModel.match();//加载完子集合后重新匹配自己
            }
        })
    });
    ```
[演示地址](https://11341684.github.io/splitWords/index.html)