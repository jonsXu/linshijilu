
/**
 * Created by liulingli on 2017/7/21.
 * desc OAK电子病历编辑器，事件绑定 ，实现痕迹保留
 * 痕迹保留实现思路
 * 电子病历编辑器中只有审阅模式可以操作痕迹保留，
 * 审阅模式下以控件值的改变来判断是否改变
 * 控件类型目前包含单选控件、多选控件、下拉控件、文本域、时间控件
 */

/**
 * @method 分别给不同的控件绑定方法
 * @param
 */

/** 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * 例子：
 * (new Date()).Format("yyyy-MM-dd HH:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).Format("yyyy-M-d H:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
Date.prototype.format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "H+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

/**
 *传入id其实是因为为了应对不同的
 * @param {*} id
 */
window.ChangeWidget = function (id){
  /**
   * 改变格式
   * this.changes = [{
   *   date : '2017-07-21 18:40:21',
   *   author : '刘伶俐',
   *   type : '插入了内容'
   *   desc : '知乎'
   * }];
   */
  this.changes = [];
  this.allwidgets = [];
  
  this.editor = window.top.UE.getEditor(id); //获取编辑器实例
  /* 获取编辑器内所有控件的原始值 */
  this.init = function (){
    var that = this;
    that.editor.ready(function(){
      var allwidgets = this.execCommand('allwidgets');
      that.allwidgets = allwidgets;
      window.top.allwidgets = allwidgets;
    })
  }
  this.showChange = function(){
    var that = this;
    window.top.changes = that.changes;
    that.editor.focus();
  }
  /**
   *动态修改值
  * @param {*，目标组件Dom} target    {type:'类型',value:'',target:htmldom,data:obj的对象}
  * @param {*变更的值} value
  */
  this.setChange = function(target,value){
    let type = target.type
    switch (type){
      case 'input' : setInput(target.target,value,target.data);break;
      case 'select' : setSelect(target.target,value,target.data);break;
      case 'checkbox' : this.setCheckBox(target.target,value,target.data);break;
      case 'radio' : setRadio(target.target,value,target.data);break;
      case 'textarea' : setTextArea(target.target,value,target.data);break;
      default:break;
    }
  }
  /**
   *动态设置input的值
  * @param {*，目标组件Dom} target
  * @param {*变更的值} value
  * @param {*原始数据} data
  */
  setInput = function(target,value,data){
    var that = this;
    if(!target){
      //如果目标组件不存在，则阻止操作
      console.log('目标组件不存在')
      return
    }
    if(data){
      let targetObj = JSON.parse(JSON.stringify(data))
      targetObj.defaultValue = value //重置defaultValue
      target.setAttribute("obj",JSON.stringify(targetObj))//重置obj
    }
    let valueNode = target.querySelector('.oak-field-value')
    if(valueNode){
      valueNode.innerHTML = value//重新设置html内容
    }
    data.defaultValue = value//修改默认值
  }
  /**
   *动态设置select的值
  * @param {*，目标组件Dom} target
  * @param {*变更的值} value
  * @param {*原始数据} key
  */
  setSelect = function(target,value,data){
    if(!target){
      //如果目标组件不存在，则阻止操作
      console.log('目标组件不存在')
      return
    }
    if(data){
      let targetObj = JSON.parse(JSON.stringify(data))
      let flag = false //判断标志，判断当前的赋值在select原有选项中是否存在，存在则进行正常赋值；不存在则，赋值'未查询到匹配数据，请删除当前组件，重新录入',
      targetObj.bindData.map(item=>{
        //如果全部都是false，只能证明 bindData内的数值和value没有匹配的
        if(item.VALUE === value) {
          item.SELECTED = true
          !flag?flag = true:''
          targetObj.defaultValue = value //重置defaultValue
        } else{
          item.SELECTED = false
        }
      })
      let valueNode = target.querySelector('.oak-field-value')
      if(flag){
        target.setAttribute("obj",JSON.stringify(targetObj))//重置obj
        valueNode.innerHTML = value//重新设置html内容
        data.defaultValue = value//修改默认值
      } else {
        valueNode.innerHTML = '未查询到匹配数据，请删除当前组件，重新录入'
      }
      
    }
  }

  /**
   *动态设置radio的值
  * @param {*，目标组件Dom} target
  * @param {*变更的值} value
  * @param {*原始数据} key
  */
  setRadio = function(target,value,data){
  if(!target){
    //如果目标组件不存在，则阻止操作
    console.log('目标组件不存在')
    return
  }
  if(data){
    let targetObj = JSON.parse(JSON.stringify(data))
    let flag = false //判断标志，判断当前的赋值在select原有选项中是否存在，存在则进行正常赋值；不存在则，赋值'未查询到匹配数据，请删除当前组件，重新录入',
    let radioIndex = 0;//需要修改的radio的下标
    targetObj.bindData.map((item,i)=>{
      //如果全部都是false，只能证明 bindData内的数值和value没有匹配的
      if(item.VALUE === value) {
        item.SELECTED = true
        !flag?flag = true:''
        radioIndex = i
      } else{
        item.SELECTED = false
      }
    })
    let valueNode = target.getElementsByTagName('input')//获取所有的input标签的dom对象
    if(valueNode.length!=targetObj.bindData.length){
      target.innerHTML = '选项查询错误'
      return
    }

    if(flag){
      //将所有input设置为false
      for(let i=0;i<valueNode.length;i++){
        let item = valueNode[i]
        item.setAttribute('checked',"false")
      }
      //将目标设置为选中
      valueNode[radioIndex].setAttribute('checked',"true")
      target.setAttribute("obj",JSON.stringify(targetObj))//重置obj
    } else {
      target.innerHTML = '未查询到匹配数据，请删除当前组件，重新录入'
    }
    
  }
  }
/**
   *动态设置checkbox的值
  * @param {*，目标组件Dom} target
  * @param {*变更的值，数组} value 
  * @param {*原始数据} key
  */
 setCheckBox = function(target,value,data){
  if(!target){
    //如果目标组件不存在，则阻止操作
    console.log('目标组件不存在')
    return
  }
  if(type(value) != 'array'){
      target.innerHTML = '参数格式不正确，checkbox修改的值必须是数组'
      return
  }
  if(data){
    debugger
    let targetObj = JSON.parse(JSON.stringify(data))
    let flag = true //判断标志，判断当前的赋值在select原有选项中是否存在，存在则进行正常赋值；不存在则，赋值'未查询到匹配数据，请删除当前组件，重新录入',
    let checkBoxIndex = [];//需要修改的checkBox的下标数组
    let valueNode = target.getElementsByTagName('input')//获取所有的input标签的dom对象
    if(valueNode.length!=targetObj.bindData.length){
      target.innerHTML = '选项查询错误'
      return
    }
    let tValue = []//检测当前value值是否包含需要修改的值的数组
    targetObj.bindData.forEach(item=>{
      tValue.push(item.VALUE)
    })
    //修改bindData内的值
    for(let j=0;j<value.length;j++){
      let item  = value[j]
      let targetItemIndex  = tValue.indexOf(item)
      if(targetItemIndex>-1){
        targetObj.bindData[targetItemIndex].SELECTED = true
        checkBoxIndex.push(targetItemIndex)
      } else {
        flag = false
        break;
      }
    }
    if(!flag){
        target.innerHTML = '未查询到匹配数据，请删除当前组件，重新录入'
        return 
    } 
      //将所有input设置为false
      for(let i=0;i<valueNode.length;i++){
        let item = valueNode[i]
        item.removeAttribute('checked')
      }
      target.setAttribute("obj",JSON.stringify(targetObj))//重置obj
      //将目标设置为选中
      checkBoxIndex.forEach(item=>{
        valueNode[item].setAttribute('checked',"true")
      })
    }
  }
  /**
   *动态设置checkbox的值
  * @param {*，目标组件Dom} target
  * @param {*变更的值，数组} value 
  * @param {*原始数据} key
  */
  setTextArea = function(target,value,data){
    var pStyle= `margin: 0;
      width: 100%;
      white-space: pre-wrap;
      min-height: 23px;
      line-height: 23px;
      height:auto;`
      if(!target){
        //如果目标组件不存在，则阻止操作
        console.log('目标组件不存在')
        return
      }
      if(type(value) != 'string'){
          target.innerHTML = '参数格式不正确，textarea控件的值必须是字符串'
          return
      }
      let targetObj = JSON.parse(JSON.stringify(data))
      targetObj.defaultValue = value
      let valueNode = target.querySelector('.oak-field-value')
      target.setAttribute("obj",JSON.stringify(targetObj))//重置obj
      valueNode.innerHTML = `<p style="${pStyle} height:auto;">${targetObj.defaultValue}</p><p style="${pStyle}"></p><p style="${pStyle}"></p>` 
  
 }

  /**
   *销毁当前ChangeWidget,清楚全局变量防止内存溢出
  * @param {*} target
  * @param {*} value
  * @param {*} key
  */
  this.destroy = function(){
    
  }

  //变更后的回调
  this.changeBack = function(widget,func){
    let type = widget.type;
    let val = {}
    if(func){
      switch (type){
        case 'input' : val = oinputChange(target,func);break;
        case 'select' : val = oselectChange(widget,func);break;
        case 'timeinput' :val =  otimeinputChange(target,func);break;
        case 'checkbox' : val = ocheckboxChange(target,value,i);break;
        case 'radio' : val =  oradioChange(target,value,i);break;
        default:break;
      }
    } else {
      switch (type){
        case 'input' : val =  oinputChange(target);break;
        case 'select' : val =  oselectChange(widget);break;
        case 'timeinput' : val =  otimeinputChange(target);break;
        case 'checkbox' : val =  ocheckboxChange(target,func);break;
        case 'radio' : val = oradioChange(target,func);break;
        default:break;
      }
    }
    
    
  }
  function inputChange(){
    
  }
  function oselectChange(target,func){
    if(type(func)!='function'){
      console.log('回调函数类型错误')
      return
    }
    let targetNode = target.target;
    let objTarget = targetNode.querySelector('.oak-select')
    var selectVal = ''
    target.data.selectVal  = ''
    objTarget.onclick = function(ev){
      var ev = ev || window.event;
      var nowtarget = ev.target || ev.srcElement;// target表示在事件冒泡中触发事件的源元素，在IE中是srcElement  
      if(nowtarget.nodeName.toLowerCase() == 'span') {
        let targetParent = target
        let parentNode = targetNode
        selectVal= nowtarget.getAttribute('value')
        targetParent.data.selectVal = selectVal
        parentNode.setAttribute('selectval',selectVal)
        if(func){
          //select值change的回调函数
          func(targetParent)
        }
      }
    }
  }

  //判断原型的对象类型
  function type(obj) {  
    var class2type = {},     //用于记录[object class]样式  
    objs = "Boolean Number String Function Array Date RegExp Null Undefined".split(" ");  
    for (var i = 0, l = objs.length; i < l; i++) {  
      class2type[ "[object " + objs[i] + "]" ] = objs[i].toLowerCase();  
    }  
    return class2type[ Object.prototype.toString.call(obj) ] || "object";  //使用了对象的原型prototype
  } 

}

ChangeWidget.prototype = {
  change:function(){
    debugger;
    var allwidgets = window.top.allwidgets||this.allwidgets;
    //绑定事件
    for(var i=0;i<allwidgets.length;i++){
      var widget = allwidgets[i];
      var type = widget.type;
      var target = widget.target;
      var value = widget.value;
      switch (type){
        case 'input' : this.inputChange(target,value,i);break;
        case 'select' : this.selectChange(target,value,i);break;
        case 'timeinput' : this.timeinputChange(target,value,i);break;
        case 'checkbox' : this.checkboxChange(target,value,i);break;
        case 'radio' : this.radioChange(target,value,i);break;
        default:break;
      }
    }
  },
  inputChange : function(target,value,key){ //input控件监听
    var that = this;
    var oldValue = value;
    /* 用定时器监听，节流，优化效率 */
    var timer = null;
    function diff(oldValue,newValue){
      var time = new Date().format("yyyy-MM-dd HH:mm:ss");
      if(newValue != oldValue && newValue!=''){
        that.changes[key] = {
          date : time,
          author : '刘伶俐',
          type : '修改了内容',
          desc : oldValue+'修改成'+newValue
        };
      }else if(newValue != oldValue && newValue==''){
        that.changes[key] = {
          date : time,
          author : '刘伶俐',
          type : '删除了内容',
          desc : '删除'+oldValue
        };
      }else{
        delete that.changes[key];
      }
      that.showChange();
    }
    target.addEventListener('keyup',function(e){
      var newValue = e.target.innerHTML;
      clearTimeout(timer)
      timer = setTimeout(function(){
        diff(oldValue,newValue)
      },400);
    });

  },
  selectChange : function (target,value,key){ // slect下拉控件监听
    
    var that = this;
    var oldValue = value;
    target.addEventListener('click',function(e){
      var className = e.target.className||'';
      if(className.indexOf('li') > -1){
        newValue = e.target.innerText;
        if(oldValue != newValue){ //改变
          var time = new Date().format("yyyy-MM-dd HH:mm:ss");
          that.changes[key] = {
            date : time,
            author : '刘伶俐',
            type : '修改了内容',
            desc : oldValue+'修改成'+newValue
          };
        }else{
          delete that.changes[key];
        }
        that.showChange();
      }
    });
  },
  timeinputChange : function (target,value,key){
    var that = this;
    var oldValue = value;
    var input = target.getElementsByTagName('input')[1];
    var _my97DP = $dp.focusArr[0] ;
    _my97DP.addEventListener('click',function(e){
      var newValue = input.value;
      if(newValue != oldValue){
        var time = new Date().format("yyyy-MM-dd HH:mm:ss");
        that.changes[key] = {
          date : time,
          author : '刘伶俐',
          type : '修改了时间',
          desc : oldValue+'修改成'+newValue
        };
      }else{
        delete that.changes[key];
      }
      that.showChange();
    })
  },
  checkboxChange : function (target,value,key){
    var that = this;
    var oldValue = value;
    target.addEventListener('click',function(e){
      if(e.target.tagName == 'INPUT'){
        //查找所有input[type='checkbox'的元素]
        var newValue = [];
        var input = target.getElementsByTagName('input');
        for(var i=0;i<input.length;i++){
          if(input[i].checked){
            newValue.push(input[i].value);
          }
        }
        if(newValue != oldValue){
          var time = new Date().format("yyyy-MM-dd HH:mm:ss");
          that.changes[key] = {
            date : time,
            author : '刘伶俐',
            type : '修改',
            desc : oldValue+'修改成'+ newValue
          };
        }else{
          delete that.changes[key];
        }
        that.showChange();
      }
      //this.showChange();
    })
  },
  radioChange : function (target,value,key){
    var that = this;
    var oldValue = value;
    target.addEventListener('click',function(e){
      if(e.target.tagName == 'INPUT'){
        //查找所有input[type='checkbox'的元素]
        var newValue = [];
        var input = target.getElementsByTagName('input');
        for(var i=0;i<input.length;i++){
          if(input[i].checked){
            newValue.push(input[i].value);
          }
        }
        if(newValue != oldValue){
          var time = new Date().format("yyyy-MM-dd HH:mm:ss");
          that.changes[key] = {
            date : time,
            author : '刘伶俐',
            type : '修改',
            desc : oldValue+'修改成'+ newValue
          };
        }else{
          delete that.changes[key];
        }
        that.showChange();
      }
      //this.showChange();
    })
  }
};


function ceshi(){
  console.log(ceshi)
}

