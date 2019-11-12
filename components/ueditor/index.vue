<template>
    <div  class="res-ueditor" >
        <div class="emra-oak">
            <!--<div class="edui-default edui-util">
                <div  v-html="insertHtml"   class="edui-toolbar"></div>
                <div  v-html="emreHtml" class="edui-toolbar"> </div>
                <div  v-html="editHtml"  class="edui-toolbar"></div>
                 <div v-html="layoutHtml" class="edui-toolbar"> </div>
            </div>-->

          <div class="edui-default edui-util" style="border-bottom:1px solid #ccc">
            <template v-for="(item,i) in doType">
                <div v-show="item =='insert'"  v-html="insertHtml" class="edui-toolbar"></div>
                <div v-show="item =='edit'" v-html="editHtml" class="edui-toolbar"></div>
                <div v-show="item =='plugin'"  v-html="emreHtml" class="edui-toolbar" style="display: block"></div>
              <div v-show="i==doType.length-1" v-html="fixedHtml" class="edui-toolbar"></div>
            </template>
          </div>
            <div class="ueditor-oak" style="width:210mm;min-height:700px; margin:0 auto">
                <script class="ueditor-script-oak" :id="id" style="width: 100%;"  name="content" type="text/plain"></script>
            </div>
        </div>
    </div>

</template>

<script>
import sss from './innerHtml.js'
  export default {
    name:'Editor',
    props:{
        id:{
            //组件id
            type:String,
            default:'editor'
        },
        doType:{
            //操作模式 ,默认为空，只有最基本操作，提供的操作类型为eidt编辑模式,insert模式，plugin插件模式，
            type:Array,
            default() {
                return [];
            }
        },
        defaultContent:{
            //当前eidtor的默认值
            type:String,
            default:null
        },
        pattern:{
            //s试图模式，默认是设计模式
            type:String,
            default:'design'
        }

    },
    data () {
      return {
        detail:{},//内容
        editor:null,
        editHtml:{},
        fixedHtml : {},
        insertHtml : {},
        emreHtml : {},
        layoutHtml :{},
        html:{},
      }
    },
    watch:{
        pattern(newval,oldVal){
           this.changePattern(newval)
        }
    },
    beforeDestroy(){
        if(this.editor){
            this.editor.destroy()
        }
    },
    async created(){

    },
    mounted(){
        let that = this;
        this.$nextTick(()=>{
            let editor = UE.getEditor(this.id,{
            autoHeightEnabled: true,
            autoFloatEnabled: true,
            elementPathEnabled: false, //删除元素路径
            wordCount: false,    //删除字数统计
            tool_bars:{
                fixedHtml:['undo', 'redo','snapscreen', 'print',
                'preview', 'map', 'emotion', 'help']
            }
            });
            editor.ready(function() {
                if(that.defaultContent){
                    editor.setContent(that.defaultContent, false);
                } else {
                    //默认给的病例模板
                    editor.setContent('', false);
                }
                that.editor = editor
                setTimeout(()=>{
                //之所以延时，是因为工具栏的dom获取必须要在editor完全构建完成后才可以获取，否则报错
                    that.html = command(editor);
                    that.changePattern(that.pattern)
                    that.setState(that.html);
                },200);
            });
        })

    },
    methods:{
        //初始化数据
        setState(html){
            this.editHtml = html.editHtml
            this.fixedHtml = html.fixedHtml
            this.insertHtml = html.insertHtml
            this.emreHtml = html.emreHtml
            this.layoutHtml = html.layout
        },
        //变更模式
        changePattern(pattern){
            if(this.editor !=null){
                switch(pattern){
                    case 'design'://设计模式
                        this.designPattern()
                    break;
                    case 'edit'://编辑模式
                        this.editPattern()
                    break;
                    case 'readonly'://只读模式
                        this.readonlyPattern()
                    break;
                    case 'review'://审阅模式
                        this.reviewPattern()
                    break;
                }
            }
        },
        
        //获取editor的内容
        getEditorContent(){
            return {content:this.editor.getContent(),editor:this.editor}
        },
        //获取编辑器的控件控制器
        getChangeWidget(){
            let w=  new ChangeWidget(this.id)
                w.init()
                return w
           
        },

        /**
         * @method 设计模式
         */
        designPattern() {
            let editor = this.editor;

            editor.body.setAttribute('pattern','design');
            //editor.body.setAttribute('contenteditable','true');
            editor.setEnabled();
        },

        /**
         * @method 编辑模式
         */
        editPattern() {
            let editor = this.editor;
            editor.body.setAttribute('pattern','edit');
            //editor.body.setAttribute('contenteditable','false');
            editor.setDisabled();
        },

        /**
         * @method 只读模式
         */
        readonlyPattern(){
            let editor = this.editor;
            editor.body.setAttribute('pattern','readonly');
            //editor.body.setAttribute('contenteditable','false');
            editor.setDisabled();
        },

        /**
         * @method 审阅模式
         */
        reviewPattern(){
            let editor = this.editor;
            editor.body.setAttribute('pattern','review');
            //editor.body.setAttribute('contenteditable','false');
            //editor.setDisabled();
            editor.setEnabled();
        },
    }
  }
</script>
<style lang="scss" src="./index.scss">
</style>
