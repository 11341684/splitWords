/**
 * 自增ID
 * @type {number}
 */
let id=0;
export default {
    /**
     * 检测参数类型是否为数组
     * @param a {*}
     * @return {boolean}
     */
    isArray: (a) => {
        return Object.prototype.toString.call(a) === '[object Array]'
    },
    /**
     * 检测参数类型是否为原生对象
     * @param a
     * @return {boolean}
     */
    isObject: (a) => {
        return Object.prototype.toString.call(a) === '[object Object]'
    },
    /**
     * 检测参数类型是否为函数
     * @param a
     * @return {boolean}
     */
    isFunction: (a) => {
        return Object.prototype.toString.call(a) === '[object Function]'
    },
    /**
     * 检查是否包含在数组中
     * @param val {*}
     * @param array {Array}
     * @return {number} -1为没有，其他为有
     */
    inArray: (val, array) => {
        for (let i = 0; i < array.length; i++) {
            if (array[i] === val) {
                return i
            }
        }
        return -1;
    },
    inArrayTwo: (val, array, type) => {
        type = type || 'id';
        for (let i = 0; i < array.length; i++) {
            if (array[i][type] === val) {
                return i
            }
        }
        return -1;
    },
    extend: function (target, ...parms) {
        parms.forEach(val => {
            for (let key in val) {
                if (!val.hasOwnProperty(key)) continue;
                if (!this.isObject(val[key]) && !this.isArray(val[key])) {
                    target[key] = val[key]
                } else {
                    target[key] = target[key] || {};
                    this.extend(target[key], val[key]);
                }
            }
        });
        return target
    },
    /**
     * 可选参数 传如字符串可以生成带前缀的唯一ID
     * @return {string}
     */
    getId: (p)=>{
        id++;
        return typeof p==='string'&&(p+id)||String(id);
    },
    getObjectLength: data => {
        let length=0;
        for(let key in data){
            if (!data.hasOwnProperty(key)) continue;
            length++;
        }
        return length
    }
}
