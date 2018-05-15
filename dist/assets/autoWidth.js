/**
 * Created by T on 2016/4/11.
 */



!function (win, option) {
    var count = 0,
        designWidth = option.designWidth,
        designHeight = option.designHeight || 0,
        designFontSize = option.designFontSize || 20,
        callback = option.callback || null,
        root = document.documentElement,
        body = document.body,
        rootWidth, newSize, t, self;
    root.style.width = "100%";
    //返回root元素字体计算结果
    function _getNewFontSize() {
        var scale = designHeight !== 0 ? Math.min((win.innerWidth>=750&&750||win.innerWidth) / designWidth, win.innerHeight / designHeight) : (win.innerWidth>=750&&750||win.innerWidth) / designWidth;
        return parseInt(scale * 10000 * designFontSize) / 10000;
    }

    !function () {
        rootWidth = root.getBoundingClientRect().width;
        self = self ? self : arguments.callee;
        //如果此时屏幕宽度不准确，就尝试再次获取分辨率，只尝试20次，否则使用win.innerWidth计算
        if (rootWidth !== win.innerWidth && count < 20) {
            win.setTimeout(function () {
                count++;
                self();
            }, 0);
        } else {
            newSize = _getNewFontSize();
            //如果css已经兼容当前分辨率就不管了
            if (newSize + 'px' !== getComputedStyle(root)['font-size']) {
                root.style.fontSize = newSize + "px";
                root.setAttribute("data-fontsize",newSize);
                return callback && callback(newSize);
            }
            ;
        }
        ;
    }();
    //横竖屏切换的时候改变fontSize，根据需要选择使用
    win.addEventListener("resize", function () {
        clearTimeout(t);
        t = setTimeout(function () {
            self();
        }, 300);
    }, false);
}(window, {
    designWidth: 750,
    designFontSize: 100,
    maxWidth:750,
    callback: function (argument) {
        //console.timeEnd("test")
    }
});
