<template>
  <div class="manage">

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
    <project-admin-table
      :tableData="tableData"
      :tableLabel="tableLabel"
      :config="config"
      @changePage="handlePageChange"
      @changeSize="handleSizeChange"
      id="out-table"
    ></project-admin-table>
  </div>
</template>

<script>
import CommonForm from "../../components/CommonForm";
import ProjectAdminTable from '../../components/ProjectAdminTable'
import FileSaver from "file-saver";
import XLSX from "xlsx";
import axios from '../../axios/ajax'

export default {
  components: {
    ProjectAdminTable,
    CommonForm
  },
  data () {
    return {
      elExport: '', // 导出el
      if_submit: '',
      if_issued: '',
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
        {
          prop: 'project_type',
          label: '审计大类类型',
        },
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
          prop: 'project_starttime',
          label: '项目开始时间',
        },
        {
          prop: 'project_endtime',
          label: '项目结束时间',
        },
        {
          prop: 'project_members',
          label: '组员',
        },
        {
          prop: 'project_accountant',
          label: '签字注册会计师',
        },
        {
          prop: 'project_costengineer',
          label: '签字注册造价师',
        },
        {
          prop: 'project_taxaccountant',
          label: '签字税务师',
        },
        {
          prop: 'project_comment',
          label: '报告意见类型',
        },
        {
          prop: 'project_construction',
          label: '施工单位',
        },
        {
          prop: 'project_assets',
          label: '资产总额(元)',
          width: 160
        },
        {
          prop: 'project_audit',
          label: '审定金额(元)',
          width: 160
        },
        {
          prop: 'project_reduction',
          label: '审减金额(元)',
          width: 160
        },
        {
          prop: "file_url",
          label: "下载链接",
          width: 150,
          type: "link"
        },
        {
          prop: 'staff_namej',
          label: '经办人',
          width: 100,
          type: "name"
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
        }
      ],
      config: {
        currentPage: 1,
        total: 0,
        pageSize: 20,
        loading: false
      },
      searchForm: {
        keyword: ''
      },
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
    getList (name = '') {
      this.config.loading = true
      axios._get("/project/getAdmin").then(res => {
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
      this.exportExcel(data, '导出数据')
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
  },
  created () {
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/common";
</style>
