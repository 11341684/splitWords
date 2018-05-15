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
    new GIS('中国上海').start().then(function(data){
        console.log(data)
    })
    ```
[演示地址](https://11341684.github.io/splitWords/index.html)