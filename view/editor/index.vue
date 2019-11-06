<template>
    <div  class="editor">
        <div>
            <el-button type="primary" @click="changePatter('design')">设计模式</el-button>
            <el-button type="primary" @click="changePatter('edit')">编辑模式</el-button>
            <el-button type="primary" @click="changePatter('readonly')">只读模式</el-button>
            <el-button type="primary" @click="getContent">获取内容</el-button>
            <el-button type="primary" @click="changUtil(['edit'])">切换操作栏-edit</el-button>
            <el-button type="primary" @click="changUtil(['insert'])">切换操作栏-insert</el-button>
            <el-button type="primary" @click="changUtil(['plugin'])">切换操作栏-plugin</el-button>
            <el-button type="primary" @click="modify()">modify值</el-button>
        </div>
        <ueditro :id="id" :pattern="pattern" ref="testeditor":defaultContent="content"  :doType="doType"></ueditro>
    </div>
    
</template>

<script>
import docApi from "@/api/system/doc";
import innerHtml from './innerHtml.js'
import ueditro from '@/components/ueditor/index.vue'
  export default {
    components:{
        ueditro
    },
    name:'EditorDemo',
    /**
     * eidt编辑模式,insert模式，plugin插件模式
     * case 'design'://设计模式
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
     * 
    */
   
    data () {
      return {
        id:'testeditor',
        pattern:'design',
        doType:[],
        content:'111',
        weig:null
      }
    },
    
    mounted(){

    },
    methods:{
        changePatter(param){
            this.pattern = param
        },
        getContent(){
            let data = this.$refs.testeditor.getEditorContent()
            console.log(data)
        },
        changUtil(param){
            this.doType= param
        },
        modify(){
            this.weig = this.$refs.testeditor.getChangeWidget()
            this.weig.allwidgets[0]//第一个控件
            let pluginId = this.weig.allwidgets[0].data.orgID//控件的唯一身份id
            this.weig.setChange(this.weig.allwidgets[0],`dhsadhuisahdiusa\ndsadsadsjka\n`)
            
        }
    }
  }
</script>
