define(function () {
    return function (e) {
        function t(o) {
            if (n[o]) return n[o].exports;
            var r = n[o] = {exports: {}, id: o, loaded: !1};
            return e[o].call(r.exports, r, r.exports, t), r.loaded = !0, r.exports
        }

        var n = {};
        return t.m = e, t.c = n, t.p = "/assets/", t(0)
    }([function (e, t) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        Object.defineProperty(t, "__esModule", {value: !0});
        var o = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var o = t[n];
                        o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
                    }
                }

                return function (t, n, o) {
                    return n && e(t.prototype, n), o && e(t, o), t
                }
            }(), r = null,
            i = Object.assign({}, {driveURL: ["http://localhost:18000/CLodopfuncs.js?priority=0", "http://localhost:8000/CLodopfuncs.js?priority=1"]}),
            l = function () {
                try {
                    var e = navigator.userAgent;
                    if (null !== e.match(/Windows\sPhone/i)) return !0;
                    if (null !== e.match(/iPhone|iPod/i)) return !0;
                    if (null !== e.match(/Android/i)) return !0;
                    if (null !== e.match(/Edge\D?\d+/i)) return !0;
                    var t = e.match(/Trident\D?\d+/i), n = e.match(/MSIE\D?\d+/i), o = e.match(/OPR\D?\d+/i),
                        r = e.match(/Firefox\D?\d+/i), i = e.match(/x64/i);
                    if (!(null !== t && void 0 !== t || null !== n && void 0 !== n || null === i)) return !0;
                    if (null !== r) {
                        var l = r[0].match(/\d+/);
                        if (l[0] >= 41 || null !== i) return !0
                    } else if (null !== o) {
                        var a = o[0].match(/\d+/);
                        if (a[0] >= 32) return !0
                    } else if (!(null !== t && void 0 !== t || null !== n && void 0 !== n)) {
                        var u = e.match(/Chrome\D?\d+/i);
                        if (null !== u) {
                            var d = u[0].match(/\d+/);
                            if (d[0] >= 41) return !0
                        }
                    }
                    return !1
                } catch (e) {
                    return !0
                }
            }(), a = function (e) {
                return new Promise(function (e, t) {
                    function n(r) {
                        if (o[r]) {
                            var i = document.createElement("script");
                            i.onLoad = function () {
                                e(i)
                            }, i.onError = function () {
                                n(r + 1)
                            };
                            var l = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
                            l.insertBefore(i, l.firstChild), i.src = o[r]
                        } else t(!1)
                    }

                    var o = o || i.driveURL;
                    "string" == typeof o && (o = [o]), n(0)
                })
            }, u = function (e, t) {
                var n = "<br><span style=\"color: #FF00FF\">打印控件未安装!点击这里<a href='install_lodop32.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</span>",
                    o = "<br><span style='color: #FF00FF'>打印控件需要升级!点击这里<a href='install_lodop32.exe' target='_self'>执行升级</a>,升级后请重新进入。</span>",
                    i = "<br><span style='color: #FF00FF'>打印控件未安装!点击这里<a href='install_lodop64.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</span>",
                    a = "<br><span style='color: #FF00FF'>打印控件需要升级!点击这里<a href='install_lodop64.exe' target='_self'>执行升级</a>,升级后请重新进入。</span>",
                    u = "<br><br><span style='color: #FF00FF'>（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）</span>",
                    d = "<br><br><span style='color: #FF00FF'>(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）</span>",
                    c = "<br><span style='color: #FF00FF'>CLodop云打印服务(localhost本地)未安装启动!点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>执行安装</a>,安装后请刷新页面。</span>",
                    s = "<br><span style='color: #FF00FF'>CLodop云打印服务需升级!点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>执行升级</a>,升级后请刷新页面。</span>",
                    f = void 0;
                try {
                    var p = navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0,
                        m = p && navigator.userAgent.indexOf("x64") >= 0;
                    if (l) {
                        try {
                            var h = window.getCLodop || null;
                            h && (f = h())
                        } catch (e) {
                        }
                        if (!f && "complete" !== document.readyState) return void alert("C-Lodop没准备好，请稍后再试！");
                        if (!f) return void(p ? document.write(c) : document.body.innerHTML = c + document.body.innerHTML);
                        window.CLODOP.CVERSION < "3.0.3.7" && (p ? document.write(s) : document.body.innerHTML = s + document.body.innerHTML), t && t.parentNode && t.parentNode.removeChild(t), e && e.parentNode && e.parentNode.removeChild(e)
                    } else if (void 0 !== e && null !== e || void 0 !== t && null !== t ? f = p ? e : t : null === r ? (f = document.createElement("object"), f.setAttribute("width", "0"), f.setAttribute("height", "0"), f.setAttribute("style", "position:absolute;left:0px;top:-100px;width:0px;height:0px;"), p ? f.setAttribute("classid", "clsid:2105C259-1E0C-4534-8141-A753534CB4CA") : f.setAttribute("type", "application/x-print-lodop"), document.documentElement.appendChild(f), r = f) : f = r, null === f || void 0 === f || "undefined" == typeof f.VERSION) return navigator.userAgent.indexOf("Chrome") >= 0 && (document.body.innerHTML = d + document.body.innerHTML), navigator.userAgent.indexOf("Firefox") >= 0 && (document.body.innerHTML = u + document.body.innerHTML), m ? document.write(i) : p ? document.write(n) : document.body.innerHTML = n + document.body.innerHTML, f;
                    return f.VERSION < "6.2.2.1" ? (l || (m ? document.write(a) : p ? document.write(o) : document.body.innerHTML = o + document.body.innerHTML), f) : f
                } catch (e) {
                    alert("getLodop出错:" + e)
                }
            }, d = function () {
                function e(t) {
                    var o = this;
                    n(this, e);
                    var r = function () {
                    };
                    this.option = Object.assign(i, {
                        beforeBuild: r,
                        afterBuild: r,
                        errorBuild: r,
                        mounted: r,
                        renderTemplate: r
                    }, t), e.LODOP ? this.option.mounted.call(this) : (this.option.beforeBuild.call(this), a(null).then(function () {
                        e.LODOP = o.LODOP = u(), o.option.afterBuild.call(o), o.option.mounted.call(o)
                    }).catch(function (e) {
                        o.option.errorBuild.call(o, e)
                    }))
                }

                return o(e, [{
                    key: "push", value: function () {
                    }
                }, {
                    key: "registerTemplate", value: function (e) {
                        this.templates = []
                    }
                }], [{
                    key: "renderTemplate", value: function (e) {
                        this.option.renderTemplate(e)
                    }
                }]), e
            }();
        d.LODOP = null, t.default = d
    }])
});
//# sourceMappingURL=app.js.map
