//import Library from './addressLibrary';
import Util from './util'
let Library={};
let ROOTCODE='0';
let order=['country','province','city','district','town','address'];
let stopLevel=4;
let orderRegExp=[
    null,
    /(省|市|(壮族|回族|维吾尔族?)?自治区|特别行政区)((?=,)|$)/g,
    /(市|自治县|自治州|地区)((?=,)|$)/g,
    /(自治县|[县区市])((?=,)|$)/g,
    /(街道办|街道办事处|地区办事处|乡|镇|街道|办事处)((?=,)|$)/g,
];
class Dispatcher {
    static eventPool=[];
    static joiner='-';
    basePrefix=Util.getId();
    constructor(option){
        this.id=option.id||'';
    }
    on(type,callback,once,stop){
        return Dispatcher.on(type,this.id,callback,once,stop);
    }
    emit(type,data){
        return Dispatcher.emit(type,data,this.id,this);
    }
    off(type,callback){
        return Dispatcher.off(type,this.id,callback);
    }
    once(type,name,callback,stop){
        return Dispatcher.once(type,this.id,callback,stop);
    }
    onByObject(option,clipping=true){
        if(!Util.isObject(option))return false;
        for(let key in option){
            if(!option.hasOwnProperty(key)) continue;
            if(Util.isFunction(option[key])){
                this.on(key,option[key]);
                if(clipping){
                    delete option[key]
                }
            }else if(Util.isObject(option[key])){
                this.onByObject(option[key],clipping);
            }
        }
    }
    static once(type,name,callback,stop){
        return Dispatcher.on(type,name,callback,true,stop);
    }
    static on(type,name,callback,once=false,stop=true){
        let opt=type;
        const $events=Dispatcher.eventPool;
        if(typeof type==='string'){
            opt={};
            opt.type=type;
            if(typeof name ==='string'||Util.isFunction(callback)){
                opt.name=name;
                opt.callback=callback
            }else {
                opt.callback=name
            }
            opt.once=once;
            opt.stop=stop;
        }
        if(!Util.isFunction(opt.callback))return false;
        if(!opt.type||typeof opt.type!=='string')return false;
        opt.async=opt.type.split('!').length>1;
        for(let i=0,len=$events.length;i<len;i++){
            if(opt.name&&$events[i].name&&opt.name===$events[i].name&&opt.type===$events[i].type){
                return false
            }
        }
        $events.push(opt);
        return true
    }
    static emit(type,data,name,scope){
        scope=scope||this;
        const $events=Dispatcher.eventPool;
        let number=0;
        for(let i=0,len=$events.length;i<len;i++){
            let currentEvent=$events[i];
            if(type&&type===currentEvent.type){
                if(!(name&&currentEvent.name&&currentEvent.name!==name)){
                    number++;
                    currentEvent.callback.call(scope||{},data);
                    if(currentEvent.once===true){
                        setTimeout(()=>{Dispatcher.off(currentEvent.type,currentEvent.name,currentEvent.callback)},0)
                    }
                    if(currentEvent.stop===false&&currentEvent.name){
                        let eventNames=currentEvent.name.split('.');
                        if(eventNames.length>1){
                            for(let j=0;j<eventNames.length;j++){
                                let _eventNames=eventNames;
                                _eventNames.splice(eventNames.length-1-j,j+1);
                                if(Dispatcher.emit(type,data,_eventNames.join('.'),scope)!==0){
                                    break
                                }
                            }
                        }
                    }
                }
            }
        }
        return number;
    }
    static off(type,name,callback){
        let number=0;
        if(arguments.length===0){
            number=Dispatcher.eventPool.length;
            Dispatcher.eventPool=[];
            return number
        }
        let opt=type;
        const $events=Dispatcher.eventPool;
        if(typeof type==='string'){
            opt={};
            opt.type=type;
            if(typeof name ==='string'||callback){
                opt.name=name;
                opt.callback=callback
            }else {
                opt.callback=name
            }
        }
        for(let i=0;i<$events.length;i++){
            if(!(opt.name&&$events[i].name&&opt.name!==$events[i].name||(opt.type&&$events[i].type&&opt.type!==$events[i].type))){
                if(!opt.callback||opt.callback===$events[i].callback){
                    number++;
                    $events.splice(i,1);
                    i--;
                }
            }
        }
        Dispatcher.eventPool=$events;
        return number;
    }
    static publish(){

    }
}
class CityModel{
    constructor(option={}){
        //编码
        this.code=option.code;
        //重点子城市
        this.childrenNode=[];
        //父级
        this.parent=option.parent;
        //层
        this.level=option.level;
        //权重
        this.weights=option.weights;
        //值
        this.value=option.value;
        //父节点code
        this.parentCode=option.parentCode;
        //匹配前的字符
        this.matchText=option.matchText;
        //匹配后的字符
        this.matchedText=option.matchedText;
        //匹配到的字符
        this.matchToText=option.matchToText;
        //当前处理序列
        this.dealIndex=0;
        if(orderRegExp[this.level] instanceof RegExp&&this.matchText){
            this.matchTexts=option.matchText.split(orderRegExp[this.level]);
        }
    }
    getParentMatchText(){
        return this.parent&&this.parent.matchText
    }
    getChildrenMap(type){
        let childrenCity=this.getChildren();
        if(!childrenCity)return false;
        let arr=[];
        switch (type){
            case 'code':
                for(let key in childrenCity){
                    if(!childrenCity.hasOwnProperty(key)) continue;
                    arr.push(key);
                }
                break;
            case 'value':
                for(let key in childrenCity){
                    if(!childrenCity.hasOwnProperty(key)) continue;
                    arr.push(childrenCity[key]);
                }
                break;
            default:
                for(let key in childrenCity){
                    if(!childrenCity.hasOwnProperty(key)) continue;
                    arr.push([key,childrenCity[key]]);
                }
                break
        }
        return arr
    }
    getChildren(){
        const code=this.code||ROOTCODE;
        return Library[code]
    }
    getChildrenValues(){
        return this.getChildrenMap('value')
    }
    emitNext(){
        const parent=this.parent;
        if(parent){
            let dealIndex=parent.dealIndex;
            let length=parent.childrenNode.length;
            if((dealIndex+2>length||length===0)){
                if(parent.weights>=95&&parent.level>=0){
                    parent.childrenNodeSort();
                    let child=parent.childrenNode[0];
                    if(child&&child.weights>=95){
                        child.end()
                    }else {
                        parent.end();
                    }
                    return true
                }
                return parent.emitNext();
            }else {
                parent.dealIndex++;
                parent.childrenNode[parent.dealIndex].match();
            }
        }else {
            index.emit('splitError',null,this.getTopId());
        }
        return false
    }
    createChildNode(matchToText,weights,noMatch=false){
        let level=this.level+1;
        let parent=this;
        let parentCode=this.code;
        let matchToCity;
        let fullInfo=this.getFullInfoByValue(matchToText);
        if(new RegExp(fullInfo.value).test(this.matchText)){
            matchToText=fullInfo.value;
        }
        let matchTexts=this.matchText.split(matchToText);
        let matchText=this.matchText;
        if(matchTexts.length>1){
            matchText=matchTexts.slice(1).join(matchToText);
        }
        weights=weights||0;
        this.matchedText=matchText;
        if(noMatch){
            matchToText=null;
        }else if(/^(路|大道)/.test(matchText)||/(路)$/.test(matchToText)){
            matchText=matchToText+matchText;
        }
        if(fullInfo){
            let {code,value}=fullInfo;
            let cityNode=new CityModel({
                parentCode:parent.code,
                code:code,
                weights,
                matchToText,
                matchText,
                level,
                parent,
                value
            });
            this.childrenNode.push(cityNode);
            return cityNode
        }
        return false;
    }
    createChildrenNode(){
        let city=this.getChildren();
        let len=Util.getObjectLength(city);
        let weights=len===1&&this.weights||1;
        for(let key in city){
            if(!city.hasOwnProperty(key)) continue;
            this.createChildNode(city[key],weights,true)
        }
        return true
    }
    getFullInfoByValue(value){
        let city=this.getChildren();
        for(let key in city){
            if(!city.hasOwnProperty(key)) continue;
            if(new RegExp(value).test(city[key])){
                return {code:key,value:city[key]}
            }
        }
    }
    match(){
        let reg=orderRegExp[this.level];
        let matchText=this.matchText;
        if(!matchText)return this.end();
        let code=this.code;
        let parent=this.parent;
        let childrenValues=this.getChildrenValues();
        if(childrenValues){
            let libraryStr=childrenValues.join(",");
            if(reg){
                libraryStr=libraryStr.replace(reg,'');
            }
            const _library=libraryStr.split(',');
            const result=[];
            if(_library.length===1){
                this.createChildNode(_library[0],this.weights,true)
            }else if(_library.length===0){
                return this.end();
            }else {
                for (let i=0;i<_library.length;i++){
                    if(new RegExp(_library[i]).test(matchText)&&matchText.indexOf(_library[i])<=5){
                        let _index=matchText.indexOf(_library[i]);
                        let weights=100-_index;
                        let currentNode=this.createChildNode(_library[i],weights);
                        if(currentNode){
                            currentNode.weightsAdd();
                        }
                    }else if(parent&&new RegExp(_library[i]).test(parent.matchText)){
                        this.matchText=this.parent.matchText;
                        let _index=parent.matchText.indexOf(_library[i]);
                        let weights=50-_index;
                        let currentNode=this.createChildNode(_library[i],weights);
                        if(currentNode){
                            currentNode.weightsAdd();
                        }
                    }else {
                        this.createChildNode(_library[i],1,true)
                    }
                }
            }
            this.childrenNodeSort();
            const childrenNode=this.childrenNode[0];
            if(childrenNode&&childrenNode.weights<=1&&this.weights<=1){
                this.close();
                this.emitNext();
            }else {
                this.childrenNode[0].match();
            }
        }else if(typeof this.getChildren() ==='undefined'){
            if(this.level>=stopLevel||index.emit('noChildren',this,this.getTopId())===0){
                if(this.weights<=95){
                    this.close();
                    this.emitNext();
                }else {
                    this.end();
                }
            }
        }else {
            this.emitNext();
        }
    }
    childrenNodeSort(){
        const children=this.childrenNode;
        if(children.length>1){
            children.sort((a,b)=>{
                if(!b){
                    return -1
                }
                if(!a){
                    return 1
                }
                if(a.weights>b.weights){
                    return -1;
                }
                return 1
            })
        }
    }
    close(){
        let parent=this.parent;
        if(parent){
            for(let i=0;i<parent.childrenNode.length;i++){
                if(parent.childrenNode[i]===this){
                    parent.childrenNode[i]=null;
                    break
                }
            }
        }
    }
    getLastChild(){
        let children=this.getChildrenNode();
        if(children.length===0)return null;
        return children[children.length-1];
    }
    getChildrenNode(){
        let current=this;
        let children=[];
        while (current.childrenNode.length>0){
            let childrenNode=current.childrenNode[current.dealIndex];
            if(!childrenNode)break;
            current=childrenNode;
            children.push(current);
        }
        return children;
    }
    getTopParent(){
        let parent=this;
        while (parent.parent){
            parent=parent.parent
        }
        return parent
    }
    end(){
        let parent=this.getTopParent();
        let childrenNode=parent.getChildrenNode();
        let arr=[];
        childrenNode.forEach(value=>{
            if(value){
                arr.push(value.value);
            }
        });
        if(childrenNode.length>0){
            arr.push(childrenNode[childrenNode.length-1].matchText);
        }
        parent.complete=true;
        parent.result=arr;
        index.emit('splitSuccess',arr,parent.id);
    }
    getTopId(){
        let parent=this;
        while (parent.parent){
            parent=parent.parent
        }
        return parent.id;
    }
    getParentsWeights(){
        let parent=this;
        let weights=parent.weights||0;
        while (parent.parent){
            parent=parent.parent;
            weights+=(parent.weights||0);
        }
        return weights;
    }
    weightsAdd(){
        let parent=this.parent;
        while (parent){
            parent.weights+=50;
            parent=parent.parent;
        }
        return this;
    }
}
export class index extends Dispatcher{
    allowJumpInterval=2;
    constructor(matchText){
        const id=Util.getId();
        super({id});
        this.matchText=index.filterControlChar(matchText);
        this.matchText=this.matchText.replace(/[\r\n]/g,' ');
        this.level=0;
        this.id=id;
        this.tree=this.createRoot();
        this.tree.id=id;
    }
    static setRootId(id){
        if(!id)return false;
        ROOTCODE=String(id)
    }
    static setLibrary(library){
        Library=library;
    }
    static setStopLevel(level){
        stopLevel=level
    }
    static setAllowJumpInterval(num){
        if(isNaN(num)){
            return false
        }
        index.prototype.allowJumpInterval=num;
    }
    setAllowJumpInterval(num){
        if(isNaN(num)){
            return false
        }
        this.allowJumpInterval=num;
    }
    createRoot(){
        const root={
            parentCode:null,
            level:0,
            code:ROOTCODE,
            matchText:this.matchText,
            weights:100
        };
        return new CityModel(root)
    }
    start(callback){
        if(callback){
            this.on('splitSuccess',callback,true);
        }
        return new Promise((resolve,reject)=>{
            this.on('splitSuccess',resolve,true);
            this.on('splitError',reject,true);
            this.tree.match();
        });
    }
    getTree(){
        return this.tree
    }
    getMatchToTexts(){
        let childrenNodes=this.tree.getChildrenNode();
        let arr=[];
        childrenNodes.forEach(val=>{
            if(val.matchToText){
                arr.push(val.matchToText)
            }
        });
        if(childrenNodes.length>0){
            arr.push(childrenNodes[childrenNodes.length-1].matchText);
        }
        return arr;
    }
    splitInfomation(callback){
        if(callback){
            this.on('splitInfomationSuccess',callback,true);
        }
        return new Promise((resolve,reject)=>{
            this.on('splitInfomationSuccess',resolve,true);
            this.on('splitInfomationError',reject,true);
            if(this.tree.complete){
                return this.startSplitInfomation();
            }
            this.start().then(val=>{
                let result=this.startSplitInfomation();
                this.emit(result&&'splitInfomationSuccess'||'splitInfomationError',result,true);
            })
        });
    }
    matchPhone(txt,_address){
        txt=String(txt);
        _address=String(_address);
        let prevExpReg='([\\s,，、]*)?(手机|联系方式|电话|联系人)?号?(号码)?(、|:|：|\\s)?';//(\d{11}|(\d|-|转){8,30})
        let mobilePhoneExpReg='(([(（]?\\+86[)）]?)?1\\d{2}[ \\-]?\\d{4}[ \\-]?\\d{4})';
        let mobilePhoneFullExpReg=prevExpReg+mobilePhoneExpReg;
        let mobilePhone=txt.match(new RegExp(mobilePhoneFullExpReg,'g'));
        let trimSpace=/[^\d]/g;
        let data={};
        if(mobilePhone){
            txt=txt.replace(new RegExp(mobilePhoneFullExpReg,'g'),' ');
            _address=_address.replace(new RegExp(mobilePhoneFullExpReg,'g'),' ');
            data.mobilePhone=mobilePhone[0].match(new RegExp(mobilePhoneExpReg))[0].replace(trimSpace,'');
            if(mobilePhone[1]){
                data.phone=mobilePhone[1].match(new RegExp(mobilePhoneExpReg))[0].replace(trimSpace,'')+' ';
            }
        }
        let phoneExpReg='(\\d|([\\-转()（） ]{0,2}\\d){1}){8,30}';
        let phoneFullExpReg=prevExpReg+phoneExpReg;
        let phone=txt.match(new RegExp(phoneFullExpReg,'g'));
        if(phone){
            txt=txt.replace(new RegExp(phoneFullExpReg,'g'),' ');
            _address=_address.replace(new RegExp(phoneFullExpReg,'g'),' ');
            data.phone=(data.phone||'')+phone[0].match(new RegExp(phoneExpReg))[0];
            if(phone[1]){
                data.phone+=phone[1].match(new RegExp(phoneExpReg))[0];
            }
        }
        return [data.mobilePhone,data.phone,txt,_address]
    }
    static filterControlChar(txt){
        txt=String(txt);
        const controlChars=[30,31,8204,8205,8206,8207,8234,8236,8237,8238,8298,8299,8300,8301,8302,8303];
        controlChars.forEach(val=>{
            let _t=val.toString(16);
            _t=new Array(5-_t.length).join('0')+_t;
            txt=txt.replace(new RegExp('\\u'+_t,'g'),'');
        });
        return txt
    }
    static trimArray(arr){
        let newArr=[];
        if(Util.isArray(arr)){
            for(let i=0;i<arr.length;i++){
                if(arr[i]){
                    newArr.push(arr[i])
                }
            }
        }
        return newArr
    }
    startSplitInfomation(txt){
        txt=txt||this.matchText;
        const matchToTexts=this.getMatchToTexts();
        let first,last;
        if(matchToTexts.length>1){
            first=txt.match(new RegExp('.*?(?='+matchToTexts[0]+')'));
            last=matchToTexts[matchToTexts.length-1];//txt.match(new RegExp('(?<='+matchToTexts[matchToTexts.length-1]+').*$'));
        }else {
            first=txt;
            last='';
        }
        let merge=' '+first+" $$$$ "+last+' ';
        let address=[...this.tree.result];
        let _address=address[address.length-1];
        let mobilePhone,phone;
        [mobilePhone,phone,merge,_address]=this.matchPhone(merge,_address);
        let personExp=/(([^\u4e00-\u9fa5]*)?(姓名|名字|([收发][件货]人)|联系人)[:：\s]*)|([^a-zA-Z0-9\u4e00-\u9fa5()\-（）]*$)/g;
        let personMatchExps=/[^\u4e00-\u9fa5](姓名|名字|([收发][件货]人)|联系人)[:：\s]*[a-zA-Z0-9\u4e00-\u9fa5()\-（）]{1,15}[^a-zA-Z0-9\u4e00-\u9fa5()\-（）]*/g;
        let personLastExp=/[\s,，、][^\s,，、]{2,15}[（(]收[)）]/g;
        let splitSpace=/[^a-zA-Z0-9\u4e00-\u9fa5]+/g;
        let person=merge.match(personMatchExps);

        if(person){
            person=person[0].replace(personExp,'');
        }else {
            person=merge.match(personLastExp);
            if(person){
                person=person[0].replace(personExp,'');
            }
        }
        if(!person){
            let mayPerson=[];
            let merges=merge.split("$$$$");
            first=merges[0];
            last=merges[1];
            if(first){
                mayPerson=mayPerson.concat(first.split(splitSpace));
            }
            if(last){
                let persons=index.trimArray(last.split(splitSpace));
                if(persons.length>0&&!/谢谢/.test(persons[persons.length-1])){
                    persons=persons.reverse()
                }
                mayPerson=mayPerson.concat(persons);
            }
            for(let i=0;i<mayPerson.length;i++){
                let name=mayPerson[i].replace(personExp,'');
                if(name&&!/地址|[0-9a-zA-Z][楼号栋斤室]|电话|手机|号码|联系人/.test(name)&&(/(^[王李张刘陈杨黄赵周吴徐孙马朱胡林郭何高罗郑梁宋唐许邓冯韩曹])|(先生|女士|[^拒]收)$/.test(name)||name.length<=15)){
                    person=name;
                    break;
                }
            }
        }
        _address.replace(/[\s,，、]{2,}/,'');
        address[address.length-1]=_address;
        person=person||'';
        person=person.replace(/^\s*|\s*$/g,'');
        return {mobilePhone,phone,person,address};
    }
}


