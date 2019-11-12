1、将目标文件（lib文件夹）放入发布路径内，在vue-cli3.0以后就放入public内，以前就放入static内
2、在根html引入路径，入下
    ####<script type="text/javascript" src="/zhzf/lib/UEditor/ueditor.config.js"></script>
    ####<script type="text/javascript" src="/zhzf/lib/UEditor/ueditor.parse.js"></script>
    ####<script type="text/javascript" src="/zhzf/lib/UEditor/ueditor.all.js"></script>
    ####<script type="text/javascript" src="/zhzf/lib/UEditor/lang/zh-cn/zh-cn.js"></script>
    ####<script type="text/javascript" src="/zhzf/lib/UEditor/third-plugin/kityformula-plugin/addKityFormulaDialog.js"></script>
    ####<script type="text/javascript" src="/zhzf/lib/UEditor/third-plugin/kityformula-plugin/getKfContent.js"></script>
    ####<script type="text/javascript" src="/zhzf/lib/UEditor/ueditor.plugin.oak.js"></script>
    ####<script type="text/javascript" src="/zhzf/lib/My97DatePicker/WdatePicker.js"></script>
    ####<script type="text/javascript" src="/zhzf/lib/UEditor/ueditor.oak.js"></script>
    
插件扩展分析：
1、需要在工具栏有自定义命令按钮能够供使用者创建控件
2、我的控件有一些自定义属性，所以点击命令按钮后，需要一个弹窗，配置我们的控件的属性
3、根据配置属性要在编辑器上生成对应的dom
4、需要可以修改我的控件的属性
5、需要可以删除我的控件

自定义控件源码解读：
1、扩展ueditor的工具栏，通过扩展ueditor的command去扩展
2、工具栏命令打开弹窗，通过阅读ueditor的源码和官网推荐的第三方发现，扩展UE的plugins就是打开弹窗
   根据自定义命令扩展plugins，扩展的plugin实际就是1、创建了一个dialog对象，通过对这个对象的传参，去创建
   弹窗，对象的参数包括模板路径，确认和取消回调等一系列；2、包含对控件在编辑器内的操作栏。
3、在弹窗内填写好内容，调用dialog的确认，调用editor的插入命令，将htmL插入html的光标位置
4、在编辑器里面点击控件的编辑，可以调用扩展plugins的时候的编辑操作，重新打开弹窗

编写控件需要注意的是：1、控件最终是插入在被ifreame包裹的编辑器里面，所以和页面是两个独立的windows, 编辑器里面和外面做交互通信要么通过编辑本身
要么通过dom身上绑定属性，通过document去获取dom再获取attribute

