<template>
  <div class="manage">
    <el-dialog
        title="更新文档"
        :visible.sync="isShow"
    >
      <common-form
          :inline = "false"
          :formLabel="operateFormLabel"
          :form="operateForm"
          :rules="rules"
          ref="commonForm"
      ></common-form>
      <!-- action表示文件要上传到的后台API地址 -->
      <el-upload
          class="upload-demo"
          action=""
          accept="
        image/jpeg,
        image/png,
        image/jpg,
        application/pdf,
        application/msword,
        application/vnd.openxmlformats-officedocument.wordprocessingml.document,
        application/vnd.ms-excel,
        application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
        .zip"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="1"
          :on-exceed="handleExceed"
          :on-change="handleChange"
          :file-list="fileList"
          :auto-upload="false"
          :show-file-list="true"
          :on-progress="uploadOnProgress"
          ref="uploadComponent"
      >
      </el-upload>
      <div>
        <el-button size="small" type="primary" @click="uploadCheck">上传文件</el-button>
        <div slot="tip" class="el-upload__tip">
          请上传格式为jpeg,png,jpg,pdf,doc,docx,xls,xlsx,zip的文件
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
    <div class="manage-header">
      <div>
        <a id="exportExcel"></a>
        <el-button type="primary" @click="exportRow">导出</el-button>
      </div>
      <common-form inline :formLabel="formLabel" :form="searchForm">
        <el-button type="primary" @click="searchKey(searchForm.keyword)"
        >搜索</el-button
        >
        <el-button type="info" @click="getList()">重置</el-button>
      </common-form>
    </div>
    <project-check-table
        :tableData="tableData"
        :tableLabel="tableLabel"
        :config="config"
        @edit="editRow"
        @pass="passProject"
        @refuse="refuseProject"
        @changePage="handlePageChange"
        @changeSize="handleSizeChange"
        id="out-table"
    ></project-check-table>
  </div>
</template>

<script>
import CommonForm from '../../components/CommonForm'
import ProjectCheckTable from '../../components/ProjectCheckTable'
import FileSaver from "file-saver";
import XLSX from "xlsx";
import axios from '../../axios/ajax'
import qs from 'qs'

export default {
  components: {
    CommonForm,
    ProjectCheckTable
  },
  data () {
    let isPriceValidator = (rule, value, callback) => {
      if (!value)
      {
        callback();
      } else
      {
        var reg = /^-?\d{1,252}(?:\.\d{1,3})?$/; //小数点左边最高4位，小数点右边最多4位
        if (reg.test(value))
        {
          callback();
        }
        else
        {
          callback(new Error("输入正确的数字,小数点后可1到3位"));
        }
      }
    };
    return {
      elExport: '', // 导出el
      loadProgress: 0, // 动态显示进度条
      progressFlag: false, // 关闭进度条
      tempData:[],
      if_submit: '',
      if_issued: '',
      operateType: 'edit',
      isShow: false,
      updateFile: false,
      tableData: [],
      tableLabel: [
        {
          prop: "project_id",
          label: "序号",
          width: 80
        },
        {
          prop: 'project_code',
          label: '项目编号',
        },
        // {
        //   prop: 'project_type',
        //   label: '审计大类类型',
        // },
        {
          prop: 'project_name',
          label: '项目名称'
        },
        {
          prop: 'project_client',
          label: '客户名称',
        },
        {
          prop: 'project_reportnumber',
          label: '审计报告编号'
        },
        {
          prop: 'project_class',
          label: '项目类型'
        },
        {
          prop: 'project_partner',
          label: '项目合伙人'
        },
        {
          prop: 'project_qualitycontroler',
          label: '质控负责人'
        },
        {
          prop: 'project_head',
          label: '项目负责人',
        },
        {
          prop: 'project_members',
          label: '组员',
        },
        {
          prop: 'project_accountant',
          label: '签字税务师1',
        },
        {
          prop: 'project_costengineer',
          label: '签字税务师2',
        },
        // {
        //   prop: 'project_taxaccountant',
        //   label: '签字税务师',
        // },
        // {
        //   prop: 'project_comment',
        //   label: '报告意见类型',
        // },
        {
          prop: 'project_starttime',
          label: '项目开始时间'
        },
        {
          prop: 'project_endtime',
          label: '项目结束时间'
        },
        {
          prop: 'project_assets',
          label: '送审金额(元)',
          width: 160
        },
        {
          prop: 'project_audit',
          label: '审定金额(元)',
          width: 160
        },
        // {
        //   prop: 'project_reduction',
        //   label: '审减金额(元)',
        //   width: 160
        // },
        {
          prop: "file_url",
          label: "下载链接",
          width: 150,
          type: "link"
        },
        {
          prop: 'submit_state',
          label: '提交状态',
          width: 100
        },
        {
          prop: 'issue_state',
          label: '审核状态',
          width: 100
        },
        {
          prop: 'staff_names',
          label: '审核人',
          width: 100,
          type: "name"
        },
        {
          prop: 'project_departmentmanager',
          label: '总审审核意见',
        },
        {
          prop: 'project_generalmanager',
          label: '合伙人审核意见',
        }
      ],
      config: {
        currentPage: 1,
        total: 0,
        pageSize: 20,
        loading: false
      },
      operateForm: {
        project_code: '',
        project_type: '',
        project_name: '',
        project_client: '',
        project_reportnumber: '',
        project_class: '',
        project_partner: '',
        project_qualitycontroler: '',
        project_head: '',
        project_members: '',
        project_accountant: '',
        project_costengineer: '',
        project_taxaccountant: '',
        project_comment: '',
        project_starttime: '',
        project_endtime: '',
        // project_construction: '',
        project_assets: '',
        project_audit: '',
        project_reduction: '',
        project_departmentmanager:'',
        project_generalmanager:''
      },
      operateFormLabel: [
        {
          model: 'project_code',
          label: '项目编号'
        },
        {
          model: 'project_name',
          label: '项目名称'
        },
        {
          model: 'project_class',
          label: '项目类型'
        },
        {
          model: 'project_client',
          label: '客户名称'
        },
        {
          model: 'project_reportnumber',
          label: '审计报告编号'
        },
        {
          model: 'project_qualitycontroler',
          label: '质控负责人'
        },
        {
          model: 'project_head',
          label: '项目负责人'
        },
        {
          model: 'project_starttime',
          label: '项目开始时间',
          type: 'date'
        },
        {
          model: 'project_endtime',
          label: '项目结束时间',
          type: 'date'
        },
        {
          model: 'project_partner',
          label: '项目合伙人'
        },
        {
          model: 'project_members',
          label: '组员'
        },
        {
          model: 'project_accountant',
          label: '签字税务师1'
        },
        {
          model: 'project_costengineer',
          label: '签字税务师2'
        },
        // {
        //   model: 'project_taxaccountant',
        //   label: '签字税务师'
        // },
        // {
        //   model: 'project_comment',
        //   label: '报告意见类型'
        // },
        {
          model: 'project_assets',
          label: '送审金额（元）'
        },
        {
          model: 'project_audit',
          label: '审定金额（元）'
        },
        {
          model: 'project_departmentmanager',
          label: '总审审核意见'
        },
        {
          model: 'project_generalmanager',
          label: '合伙人审核意见'
        }
      ],
      rules: {
        project_code: [
          { required: true, message: '请输入项目编号', trigger: 'blur' },
          { min: 10, max: 255, message: '项目编号长度需要在 10 到 255 个字符', trigger: 'blur' }
        ],
        project_name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { min: 4, max: 255, message: '项目名称长度需要在 4 到 255 个字符', trigger: 'blur' }
        ],
        project_class: [
          { required: true, message: '请输入项目类型', trigger: 'blur' },
          { min: 4, max: 255, message: '项目类型长度需要在 4 到 255 个字符', trigger: 'blur' }
        ],
        // project_type: [
        //   { type: "enum", enum: ['财务审计', '工程审计', '税务审计'], required: true, message: '请选择项目类型：财务审计，工程审计或税务审计', trigger: 'blur' }
        // ],
        project_client: [
          { required: true, message: '请输入客户名称', trigger: 'blur' },
          { max: 255, message: '客户名称长度最多 255 个字符', trigger: 'blur' }
        ],
        project_reportnumber: [
          { required: true, message: '请输入审计报告号', trigger: 'blur' },
          { max: 255, message: '审计报告号长度最多 255 个字符', trigger: 'blur' }
        ],
        project_qualitycontroler: [
          { required: true, message: '请输入质控负责人', trigger: 'blur' },
          { max: 255, message: '质控负责人长度最多 255 个字符', trigger: 'blur' }
        ],
        project_head: [
          { required: true, message: '请输入项目负责人', trigger: 'blur' },
          { max: 255, message: '项目负责人长度最多 255 个字符', trigger: 'blur' }
        ],
        project_starttime: [
          { required: true, message: '请输入项目开始时间', trigger: 'blur' },
        ],
        project_endtime: [
          { required: true, message: '请输入项目结束时间', trigger: 'blur' },
        ],
        project_assets:[
          { required: true, message: '请输入送审金额', trigger: 'blur' },
          { validator: isPriceValidator, message: '送审金额需输入数字（元）', trigger: 'blur'}
        ],
        project_audit:[
          { required: true, message: '请输入审定金额', trigger: 'blur' },
          { validator: isPriceValidator, message: '审定金额需输入数字（元）', trigger: 'blur'}
        ],
        project_accountant: [
          { required: true, message: '请输入签字税务师1', trigger: 'blur' },
        ],
        project_costengineer: [
          { required: true, message: '请输入签字税务师2', trigger: 'blur' },
        ],
        // project_reduction:[
        //   { validator: isPriceValidator, message: '审减金额需输入数字（元）', trigger: 'blur', transform: (value) => Number(value)}
        // ],
      },
      searchForm: {
        keyword: ''
      },
      fileList: [

      ],
      formLabel: [
        {
          model: 'keyword',
          label: ''
        }
      ],
      formData: "",
    }
  },
  mounted () {
    this.elExport = document.getElementById('exportExcel')
  },
  methods: {

    handleSizeChange: function(size) {
      this.config.pagesize = size
      // console.log(this.config.pagesize)// 每页下拉显示数据
    },
    handlePageChange: function(currentPage){
      this.config.currentPage = currentPage
      // console.log(this.config.currentPage) // 点击第几页
    },
    handleRemove (file, fileList) {
      this.$refs['uploadComponent'].clearFiles();
    },
    handlePreview (file) {
      console.log(file);
    },
    handleExceed (files, fileList) {
      this.$message.warning(
          `当前限制选择 1 个文件，本次选择了 ${files.length
          } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    uploadOnProgress(event,file,fileList){
      this.progressFlag = true; // 显示进度条
      this.loadProgress = parseInt(event.percent); // 动态获取文件上传进度
      if (this.loadProgress >= 100) {
        this.loadProgress = 100
        setTimeout( () => {this.progressFlag = false}, 1000) // 一秒后关闭进度条
      }
    },
    handleChange (file, fileList) {
      this.fileList = fileList;
    },
    uploadCheck(){
      var result = 0;
      for (let key in this.operateForm) {
        if (key === "file_url" && this.operateForm[key] != "NULL") {
          result = 1;
          break;
        }
      }

      if (this.fileList.length > 0)
      {
        result = 2;
      }

      if (result === 1) {
        this.$confirm("已经上传的旧文件将会被覆盖，请问确定要上传新的文件吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          // console.log(this.$refs['uploadComponent'].$refs['upload-inner']);
          this.$refs['uploadComponent'].$refs['upload-inner'].handleClick();
        })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消上传文件"
              });
            });
      }
      else if (result === 2)
      {
        this.$confirm("每次仅能上传一个文件，", "提示", {
          confirmButtonText: "确定",
          type: "warning"
        });
      }
      else
      {
        this.$refs['uploadComponent'].$refs['upload-inner'].handleClick();
      }
    },
    onBeforeUpload (file) {
      // console.log(file)

      const isIMAGE = (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg");
      const isDOCUMENT = (file.type === "application/pdf" ||
          file.type === "application/msword" ||
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.type === "application/vnd.ms-excel" ||
          file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      const isZip = (file.type === "application/x-zip-compressed");
      const isLt100M = file.size / 1024 / 1024 < 100;

      // console.log("isIMAGE",isIMAGE);
      // console.log("isDOCUMENT",isDOCUMENT);
      // console.log("isZip",isZip);
      // console.log("isLt100M",isLt100M);

      if (!isIMAGE && !isDOCUMENT && !isZip) {
        this.$message.error('不支持此格式文件上传！');
      }

      if (!isLt100M) {
        this.$message.error('上传文件大小不得大于100MB');
      }
      return (isIMAGE || isDOCUMENT || isZip) && isLt100M;
    },
    getList (name = '') {
      this.config.loading = true
      // axios._get("http://localhost:8080/project/getCheckProject").then(res => {
      axios._get("/project/getCheckProject?projectType=税务审计").then(res => {
        this.$message.success("获取项目列表成功！")
        this.tableData = res;

        for (var i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i]["file_url"] == null) {
            this.tableData[i]["file_url"] = "NULL";
          }
          else {
            this.tableData[i]["file_url"] = window.encodeURI(this.tableData[i]["file_url"]);
          }

          this.if_submit = this.tableData[i].if_submit;
          this.if_issued = this.tableData[i].if_issued;

          if (this.if_submit == '0')
          {
            this.tableData[i]["submit_state"] = '待提交';
          }
          else
          {
            this.tableData[i]["submit_state"] = '已提交';
            if (this.if_issued == '0')
            {
              this.tableData[i]["issue_state"] = '待审核';
            }
            else if (this.if_issued == '1')
            {
              this.tableData[i]["issue_state"] = '被退回';
            }
            else if (this.if_issued == '2')
            {
              this.tableData[i]["issue_state"] = '总审通过';
            }
            else
            {
              this.tableData[i]["issue_state"] = '已通过';
            }
          }
        }
        this.config.loading = false;
        this.config.total = this.tableData.length;
        if (this.tableData.length == 0)
        {
          this.config.currentPage = 0;
        }
      }, err => {
        alert("getlist error!!!");
      })
    },
    editRow (row) {
      this.operateType = 'edit'
      this.isShow = true
      this.operateForm = row
    },
    passProject (row) {
      this.$confirm("此操作将提交该项目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
          .then(() => {
            this.operateForm = row;
            let formdata = new FormData();
            for (var key2 in this.operateForm) {
              if (key2 != "issue_state" && key2 != "submit_state")
              {
                formdata.append(key2, this.operateForm[key2])
              }
            }

            axios._post('/project/pass', formdata).then(res => {
              if (res.code == "250") {
                this.$message({
                  type: "error",
                  message: "已有审核人处理此项目！"
                });
              }
              else {
                this.$message({
                  type: "success",
                  message: "审核结果保存成功!"
                });
              }

              this.getList();
            }, err => {
              this.$message({
                type: "error",
                message: "审核结果保存失败！"
              });
              this.getList();
            })
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消审核"
            });
          });
    },
    refuseProject (row) {
      this.$confirm("此操作将退回该项目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
          .then(() => {
            this.operateForm = row;
            let formdata = new FormData();
            for (var key3 in this.operateForm) {
              if (key3 != "issue_state" && key3 != "submit_state"){
                formdata.append(key3, this.operateForm[key3])
              }
            }
            axios._post('/project/refuse', formdata).then(res => {
              if (res.code == "250") {
                this.$message({
                  type: "error",
                  message: "已有审核人处理此项目！"
                });
              }
              else {
                this.$message({
                  type: "success",
                  message: "审核结果保存成功!"
                });
              }
              this.getList();
            }, err => {
              this.$message({
                type: "error",
                message: "审核结果保存失败"
              });
              this.getList();
            })
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消审核"
            });
          });
    },
    //定义导出Excel表格事件
    exportRow (){
      // 生成列名
      let data = []
      let len=this.tableLabel.length;
      let m=this.tableData.length;
      for(var i=0;i<=m;i++) data.push({})
      for (let i=0;i<len;i++) {
        let label=this.tableLabel[i]["label"]
        let prop=this.tableLabel[i]["prop"]
        data[0][label] = label
        for(let j=0;j<m;j++)
        {
          let value=this.tableData[j][prop]
          if(!value||value=='null'||value=='NULL') value=''
          data[j+1][label]=value
        }
      }
      this.exportExcel(data, '税务审计导出数据')
    },
    exportExcel (json, downName, type) {
      // 获取列名
      let keyMap = []
      for (let k in json[0]) {
        keyMap.push(k)
      }

      // 用来保存转换好的json
      let tmpdata = []
      json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
        v: v[k],
        position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
      }))).reduce((prev, next) => prev.concat(next)).forEach(function (v) {
        tmpdata[v.position] = {
          v: v.v
        }
      })
      let outputPos = Object.keys(tmpdata)  // 设置区域，比如表格从A1到D10
      let tmpWB = {
        SheetNames: ['mySheet'], // 保存的表标题
        Sheets: {
          'mySheet': Object.assign({},
              tmpdata, // 内容
              {
                '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] // 设置填充区域
              })
        }
      }

      // 创建二进制对象写入转换好的字节流
      let tmpDown = new Blob([this.s2ab(XLSX.write(tmpWB,
          { bookType: (type === undefined ? 'xlsx' : type), bookSST: false, type: 'binary' } // 这里的数据是用来定义导出的格式类型
      ))], {
        type: ''
      })

      this.elExport.download = downName + '.xlsx'  // 下载名称
      this.elExport.href = URL.createObjectURL(tmpDown)  // 绑定a标签到新创建对象超链接
      this.elExport.click()  // 模拟点击实现下载

      // 释放，用 URL.revokeObjectURL() 释放
      setTimeout(() => URL.revokeObjectURL(tmpDown), 100)
    },
    // 字符串转字符流
    s2ab (s) {
      var buf = new ArrayBuffer(s.length)
      var view = new Uint8Array(buf)
      for (var i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF
      }
      return buf
    },
    // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
    getCharCol (n) {
      let s = ''
      let m = 0
      while (n > 0) {
        m = n % 26 + 1
        s = String.fromCharCode(m + 64) + s
        n = (n - m) / 26
      }
      return s
    },
    searchKey (keyword) {
      if (keyword == "" || keyword == undefined || keyword == null) {
        this.getList();
      }
      else {
        this.config.loading = true;
        var dataList = [];

        for (var i = 0; i < this.tableData.length; i++) {
          for (var j = 0; j < this.tableLabel.length; j++) {
            var keyStr = this.tableLabel[j]["prop"];

            if (this.tableData[i][keyStr] != null && this.tableData[i][keyStr].toString().indexOf(keyword) != -1 && keyStr != "file_url") {
              dataList.push(this.tableData[i]);
              break;
            }
          }
        }
        this.tableData = dataList;
        this.config.loading = false;
        this.config.total = this.tableData.length;
        if (this.tableData.length == 0)
        {
          this.config.currentPage = 0;
        }
      }
    },
    confirm () {
      //console.log(this.$refs.commonForm.$children[0]);
      this.$refs.commonForm.$children[0].validate((valid) => {
        if (valid)
        {
          if (this.fileList.length != 0 &&!this.onBeforeUpload(this.fileList[0].raw))
          {
            this.fileList.splice(0, 1);
            return false;
          }
          if (this.operateType === 'edit')
          {
            let formdata = new FormData();
            for (var key2 in this.operateForm) {
              if (key2 != "issue_state" && key2 != "submit_state")
              {
                formdata.append(key2, this.operateForm[key2])
              }
            }

            if (this.fileList.length != 0) {
              for(var file of this.fileList){
                formdata.append("files", file.raw,file.raw.name)
              }
              this.fileList=[]
            }

            axios._post('/project/update', formdata).then(res => {
              this.$message.success("更新项目成功");
              this.isShow = false
              this.getList()
            },err => {
              alert("Update Error!");
              this.$message({
                message: "更新项目失败",
                type: "error"
              });
            })
          }
        } else {
          this.$message({
            type: "error",
            message: "表单填写不合法，请检查必填项！"
          });
          return false;
        }
      });
    },
    cancel() {
      this.isShow = false;
      this.getList();
    },
  },
  created () {
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/common";
</style>


