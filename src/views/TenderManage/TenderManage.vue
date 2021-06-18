<template>
  <div class="manage">
    <el-dialog
      :title="operateType === 'add' ? '新增投标' : '更新投标信息'"
      :visible.sync="isShow"
    >
      <tender-form
        :inline="false"
        :formLabel="operateFormLabel"
        :tenderForm="operateForm"
        :rules="rules"
        ref="tenderForm"
      ></tender-form>
      <!-- action表示文件要上传到的后台API地址 -->
      <el-upload
          class="upload-demo"
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
          :before-remove="beforeRemove"
          action=""
          multiple
          :on-change="handleChange"
          :file-list="fileList"
          :auto-upload="false"
          :show-file-list="true"
          :on-progress="uploadOnProgress"
          ref="uploadComponent"
      >
      </el-upload>

      <div>
        <el-button size="small" type="primary" @click="uploadCheck"
          >上传文件</el-button
        >
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
        <el-button type="primary" @click="addRow">新增</el-button>
        <el-button type="primary" @click="exportRow">导出</el-button>
      </div>

      <common-form inline :formLabel="formLabel" :form="searchFrom">
        <el-button type="primary" @click="searchKey(searchFrom.keyword)"
          >搜索</el-button
        >
        <el-button type="info" @click="getList()">重置</el-button>
      </common-form>
    </div>

    <project-table
      :tableData="tableData"
      :tableLabel="tableLabel"
      :config="config"
      @edit="editRow"
      @del="delRow"
      @sub="submitTender"
      @changePage="handlePageChange"
      @changeSize="handleSizeChange"
      id="out-table"
    ></project-table>
  </div>
</template>

<script>
import CommonForm from "../../components/CommonForm";
import ProjectTable from "../../components/ProjectTable";
import TenderForm from "../../components/TenderForm";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import axios from "../../axios/ajax";
import qs from "qs";
export default {
  components: {
    CommonForm,
    ProjectTable,
    TenderForm,
  },
  data() {
    let isLessTenDigits = (rule, value, callback) => {
      setTimeout(() => {
        if (!value) {
          callback();
        } else if (!Number(value)) {
          callback(new Error("请输入数字！"));
        } else {
          const re = /^\d{0,1}(\d{0,9})(\.\d*)?$/;
          const rsCheck = re.test(value);
          if (!rsCheck) {
            callback(new Error("小数点前最多10位数字"));
          } else {
            callback();
          }
        }
      }, 1000);
    };

    let isSpecialChar = (rule, value, callback) => {
      setTimeout(() => {
        if (!value) {
          return callback();
        } else if (value.length > 255) {
          callback(new Error("输入长度需要在255 个字符以内！"));
        } else {
          // const re = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/;
          const re = /[【】]/;
          const rsCheck = re.test(value);
          if (rsCheck) {
            callback(new Error("输入不能包含【】，请重新输入！"));
          } else {
            callback();
          }
        }
      }, 1000);
    };

    return {
      elExport: '', // 导出el
      loadProgress: 0, // 动态显示进度条
      progressFlag: false, // 关闭进度条
      if_submit: "",
      if_issued: "",
      operateType: "add",
      isShow: false,
      updateFile: false,
      tableData: [],
      tableLabel: [
        {
          prop: "id",
          label: "投标编号",
          width: 80,
        },
        // {
        //   prop: "file_code",
        //   label: "文档编号",
        //   width: 150
        // },
        {
          prop: "tender_date",
          label: "投标时间",
          width: 120,
        },
        {
          prop: "project_name",
          label: "项目名称",
          width: 180,
        },
        {
          prop: "audit_type",
          label: "投标类型",
          width: 80,
        },
        {
          prop: "tender_block",
          label: "标段",
          width: 80,
        },
        {
          prop: "tender_offer",
          label: "投标报价(万元)",
          width: 80,
        },
        {
          prop: "tender_block_sum",
          label: "含税标段预估金额(万元)",
          width: 80,
        },
        {
          prop: "tender_flag",
          label: "是否中标",
          width: 80,
        },
        {
          prop: "tender_share",
          label: "中标份额",
          width: 80,
        },

        {
          prop: "tender_ceiling",
          label: "含税中标合同上限(万元)",
          width: 80,
        },
        {
          prop: "tender_discount",
          label: "中标折扣",
          width: 80,
        },
        {
          prop: "file_url",
          label: "下载链接",
          width: 150,
          type: "link",
        },
        {
          prop: "submit_state",
          label: "提交状态",
          width: 100,
        },
        {
          prop: "issue_state",
          label: "审核状态",
          width: 100,
        },
        {
          prop: "staff_names",
          label: "审核人",
          width: 100,
          type: "name",
        },
      ],
      config: {
        currentPage: 1,
        total: 0,
        pageSize: 20,
        loading: false,
      },
      operateForm: {
        tender_date: "",
        project_name: "",
        audit_type: "",
        tender_block: "",
        tender_offer: "",
        tender_block_sum: "",
        tender_share: "",
        tender_flag: "",
        tender_ceiling: "",
        tender_discount: "",
      },
      operateFormLabel: [
        {
          model: "tender_date",
          label: "投标时间",
          width: 160,
          type: "date",
        },
        {
          model: "project_name",
          label: "项目名称",
          width: 160,
        },
        {
          model: "audit_type",
          label: "投标类型",
          width: 160,
        },
        {
          model: "tender_offer",
          label: "投标报价",
          width: 160,
        },
        {
          model: "tender_block",
          label: "标段",
          width: 160,
        },
        {
          model: "tender_block_sum",
          label: "含税标段预估金额",
          width: 160,
        },
        {
          model: "tender_flag",
          label: "是否中标",
          width: 160,
          type: "select",
          opts: [
            {
              label: "是",
              value: "是",
            },
            {
              label: "否",
              value: "否",
            },
          ],
        },
        {
          model: "tender_share",
          label: "中标份额",
          width: 160,
        },

        {
          model: "tender_ceiling",
          label: "含税中标合同上限",
          width: 200,
        },
        {
          model: "tender_discount",
          label: "中标折扣",
          width: 100,
        },
      ],
      rules: {
        tender_date: [
          { required: true, message: "请输入投标时间", trigger: "blur" },
        ],
        project_name: [
          { required: true, message: "请输入项目名称", trigger: "blur" },
          { validator: isSpecialChar, trigger: "blur" },
        ],
        audit_type: [
          { required: true, message: "请输入投标类型", trigger: "blur" },
          { validator: isSpecialChar, trigger: "blur" },
        ],
        tender_block: [
          { required: true, message: "请输入标段", trigger: "blur" },
          { validator: isSpecialChar, trigger: "blur" },
        ],
        tender_offer: [
          { required: true, message: "请输入投标报价", trigger: "blur" },
          { validator: isSpecialChar, trigger: "blur" },
        ],
        tender_block_sum: [
          { required: true, message: "请输入标段预估金额", trigger: "blur" },
          { validator: isLessTenDigits, trigger: "blur" },
        ],
        tender_share: [{ validator: isSpecialChar, trigger: "blur" }],
        tender_ceiling: [{ validator: isSpecialChar, trigger: "blur" }],
        tender_discount: [{ validator: isSpecialChar, trigger: "blur" }],
        tender_flag: [
          { required: true, message: "请选择是否中标", trigger: "blur" },
          {
            type: "enum",
            enum: ["是", "否"],
            message: "请选择是否中标：是，否",
            trigger: "blur",
          },
        ],
      },
      searchFrom: {
        keyword: "",
      },
      formLabel: [
        {
          model: "keyword",
          label: "",
        },
      ],
      fileList: [],
      formData: "",
    };
  },
  mounted () {
    this.elExport = document.getElementById('exportExcel')
  },
  methods: {
    handleSizeChange: function (size) {
      this.config.pagesize = size
      // console.log(this.config.pagesize)// 每页下拉显示数据
    },
    handlePageChange: function (currentPage) {
      this.config.currentPage = currentPage
      // console.log(this.config.currentPage) // 点击第几页
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    uploadOnProgress(event, file, fileList) {
      this.progressFlag = true; // 显示进度条
      this.loadProgress = parseInt(event.percent); // 动态获取文件上传进度
      if (this.loadProgress >= 100) {
        this.loadProgress = 100
        setTimeout(() => {
          this.progressFlag = false
        }, 1000) // 一秒后关闭进度条
      }
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
    },
    uploadCheck() {
      this.$refs['uploadComponent'].$refs['upload-inner'].handleClick();
    },
    onBeforeUpload(file) {
      //console.log(file)
      const isIMAGE = (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg");
      const isDOCUMENT = (file.type === "application/pdf" ||
          file.type === "application/msword" ||
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.type === "application/vnd.ms-excel" ||
          file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      const isZip = (file.type === "application/x-zip-compressed");
      const isLt100M = file.size / 1024 / 1024 < 100;
      if (!isIMAGE && !isDOCUMENT && !isZip) {
        this.$message({
          type: "error",
          message: "不支持此格式文件上传！"
        });
      }

      if (!isLt100M) {
        this.$message({
          type: "error",
          message: "上传文件大小不得大于100MB！"
        });
      }

      return (isIMAGE || isDOCUMENT || isZip) && isLt100M;
    },
    getList(name = "") {
      this.config.loading = true;
      name ? (this.config.page = 1) : "";
      axios._get("/tender/getAllTender").then(
        // axios._get("").then(
        (res) => {
          this.$message.success("获取投标列表成功！");
          this.tableData = res;

          for (var i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i]["file_url"] == null) {
              this.tableData[i]["file_url"] = "NULL";
            } else {
              this.tableData[i]["file_url"] = window.encodeURI(
                this.tableData[i]["file_url"]
              );
            }

            this.if_submit = this.tableData[i].if_submit;
            this.if_issued = this.tableData[i].if_issued;

            if (this.if_submit == "0") {
              this.tableData[i]["submit_state"] = "待提交";
              this.tableData[i]["issue_state"] = "-";
            } else {
              this.tableData[i]["submit_state"] = "已提交";
              if (this.if_issued == "0") {
                this.tableData[i]["issue_state"] = "待审核";
              } else if (this.if_issued == "1") {
                this.tableData[i]["issue_state"] = "被退回";
              } else {
                this.tableData[i]["issue_state"] = "已通过";
              }
            }
          }
          this.config.loading = false;
          this.config.total = this.tableData.length;
          if (this.tableData.length == 0) {
            this.config.currentPage = 0;
          }
        },
        (err) => {
          // alert("未能获取投标列表，请稍后再试！");
          this.$message({
            type: "error",
            message: "未能获取投标列表，请稍后再试！",
          });
        }
      );
    },
    addRow() {
      this.operateForm = {};
      this.operateType = "add";
      this.isShow = true;
    },
    editRow(row) {
      this.operateType = "edit";
      this.isShow = true;
      this.operateForm = row;
    },
    confirm() {
      this.$refs.tenderForm.$children[0].validate((valid) => {
        if (valid) {
          if (this.fileList.length != 0 && !this.onBeforeUpload(this.fileList[0].raw)) {
            this.fileList.splice(0, 1);
            return false;
          }

          if (this.operateType === "edit") {
            let formdata = new FormData();
            for (var key in this.operateForm) {
              if (key != "issue_state" && key != "submit_state") {
                formdata.append(key, this.operateForm[key])
              }
            }

            if (this.fileList.length != 0) {
              for(var file of this.fileList){
                formdata.append("files", file.raw,file.raw.name)
              }
              this.fileList=[]
            }

            axios._post('/tender/update', formdata).then(res => {
              this.$message.success("更新投标成功");
              this.isShow = false;
              console.log("Inserted " + res);//res是返回插入数据的id
              this.getList()
            }, err => {
              alert("error!!!");
              this.$message({
                message: "更新文档失败",
                type: "error"
              });
            })
          } else if (this.operateType === "add") {
            let formdata = new FormData();
            for (var key2 in this.operateForm) {
              if (key2 != "issue_state" && key2 != "submit_state") {
                formdata.append(key2, this.operateForm[key2])
              }
            }
            if (this.fileList.length != 0) {
              for(var file of this.fileList){
                formdata.append("files", file.raw,file.raw.name)
              }
              this.fileList=[]
            }
            axios._post('/tender/insert', formdata).then(res => {
              this.$message.success("新建投标成功");
              this.isShow = false;
              this.getList()
            }, err => {
              alert("error!!!");
              this.$message({
                message: "添加文档失败",
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
    delRow(row) {
      this.$confirm("此操作将永久删除该投标信息及文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.operateForm = row;
          let formdata = new FormData();
          for (var key3 in this.operateForm) {
            if (key3 != "issue_state" && key3 != "submit_state") {
              formdata.append(key3, this.operateForm[key3]);
            }
          }

          axios._post("/tender/delete", formdata).then(
            (res) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getList();
            },
            (err) => {
              this.$message({
                type: "error",
                message: "删除失败",
              });
              this.getList();
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    submitTender(row) {
      this.$confirm("此操作将提交投标信息及文件至审核人, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.operateForm = row;
          let formdata = new FormData();
          for (var key4 in this.operateForm) {
            if (key4 != "issue_state" && key4 != "submit_state") {
              formdata.append(key4, this.operateForm[key4]);
            }
          }

          axios._post("/tender/submit", formdata).then(
            (res) => {
              this.$message({
                type: "success",
                message: "提交成功!",
              });
              this.getList();
            },
            (err) => {
              this.$message({
                type: "error",
                message: "提交失败",
              });
              this.getList();
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消提交",
          });
        });
    },
    //定义导出Excel表格事件
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
      this.exportExcel(data, '投标管理导出数据')
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
    searchKey(keyword) {
      if (keyword == "" || keyword == undefined || keyword == null) {
        this.getList();
      } else {
        this.config.loading = true;
        var dataList = [];

        for (var i = 0; i < this.tableData.length; i++) {
          for (var j = 0; j < this.tableLabel.length; j++) {
            var keyStr = this.tableLabel[j]["prop"];

            if (
              this.tableData[i][keyStr] != null &&
              this.tableData[i][keyStr].toString().indexOf(keyword) != -1 &&
              keyStr != "file_url"
            ) {
              dataList.push(this.tableData[i]);
              break;
            }
          }
        }
        this.tableData = dataList;
        this.config.loading = false;
        this.config.total = this.tableData.length;
      }
    },
  },
  created() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/common";
</style>
