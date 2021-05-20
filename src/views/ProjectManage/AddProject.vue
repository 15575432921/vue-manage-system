<template>
  <div class="app-container">
    <el-form label-width="140px" style="width: 90%;">
      <el-form-item label-width="0px">
      <el-col :span="12">
        <el-form-item label="项目编号">
          <el-input
              v-model="operateForm.project_code"
              :placeholder="'请输入项目编号'"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="项目名称">
          <el-input
              v-model="operateForm.project_name"
              :placeholder="'请输入项目名称'"
          ><
          </el-input>
        </el-form-item>
      </el-col>
      </el-form-item>
      <el-form-item label="审计大类">
        <el-select
            v-model="operateForm.project_type"
            placeholder="请选择审计大类类型"
        >
          <el-option
              :key="'财务审计'"
              :label="'财务审计'"
              :value="'财务审计'"
          ></el-option>
          <el-option
              :key="'工程审计'"
              :label="'工程审计'"
              :value="'工程审计'"
          ></el-option>
          <el-option
              :key="'税务审计'"
              :label="'税务审计'"
              :value="'税务审计'"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目类型">
        <el-input
            v-model="operateForm.project_class"
            :placeholder="'请输入项目类型'"
        ></el-input>
      </el-form-item>
      <el-form-item label="客户名称">
        <el-input
            v-model="operateForm.project_client"
            :placeholder="'请输入客户名称'"
        ></el-input>
      </el-form-item>
      <el-form-item label="审计报告编号">
        <el-input
            v-model="operateForm.project_reportnumber"
            :placeholder="'请输入审计报告编号'"
        ></el-input>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-col :span="12">
      <el-form-item label="质控负责人">

        <el-input
            v-model="operateForm.project_qualitycontroler"
            :placeholder="'请输入质控负责人'"
        ></el-input>

      </el-form-item>
        </el-col>
        <el-col :span="12">
      <el-form-item label="项目负责人">
        <el-input
            v-model="operateForm.project_head"
            :placeholder="'请输入项目负责人'"
        ></el-input>
      </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label-width="0px"  style="width: 50%;">
        <el-col :span="12">
      <el-form-item label="项目开始时间">
        <el-date-picker
            v-model="operateForm.project_starttime"
            type="date"
            placeholder="选择项目开始时间"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
        >
        </el-date-picker>
      </el-form-item>
        </el-col>
        <el-col :span="12">
      <el-form-item label="项目结束时间" >
        <el-date-picker
            v-model="operateForm.project_endtime"
            type="date"
            placeholder="选择项目结束时间"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
        >
        </el-date-picker>
      </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-col :span="12">
      <el-form-item label="项目合伙人">
        <el-input
            v-model="operateForm.project_partner"
            :placeholder="'请输入项目合伙人'"
        ></el-input>
      </el-form-item>
        </el-col>
        <el-col :span="12">
      <el-form-item label="组员">
        <el-input
            v-model="operateForm.project_members"
            :placeholder="'请输入组员'"
        ></el-input>
      </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-col :span="8">
      <el-form-item label="签字注册会计师">
        <el-input
            v-model="operateForm.project_accountant"
            :placeholder="'请输入签字注册会计师'"
        ></el-input>
      </el-form-item>
        </el-col>
        <el-col :span="8">
      <el-form-item label="签字注册造价师">
        <el-input
            v-model="operateForm.project_costengineer"
            :placeholder="'请输入签字注册造价师'"
        ></el-input>
      </el-form-item>
        </el-col>
        <el-col :span="8">
      <el-form-item label="签字税务师">
        <el-input
            v-model="operateForm.project_taxaccountant"
            :placeholder="'请输入签字税务师'"
        ></el-input>
      </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="报告意见类型">
        <el-input
            v-model="operateForm.project_comment"
            :placeholder="'请输入报告意见类型'"
        ></el-input>
      </el-form-item>
      <el-form-item label="施工单位">
        <el-input
            v-model="operateForm.project_construction"
            :placeholder="'请输入施工单位'"
        ></el-input>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-col :span="8">
      <el-form-item label="资产总额（万元）">
        <el-input
            v-model="operateForm.project_assets"
            :placeholder="'请输入资产总额（万元）'"
        ></el-input>
      </el-form-item>
        </el-col>
        <el-col :span="8">
      <el-form-item label="审定金额（万元）">
        <el-input
            v-model="operateForm.project_audit"
            :placeholder="'请输入审定金额（万元）'"
        ></el-input>
      </el-form-item>
        </el-col>
        <el-col :span="8">
      <el-form-item label="审减金额（万元）">
        <el-input
            v-model="operateForm.project_reduction"
            :placeholder="'请输入审减金额（万元）'"
        ></el-input>
      </el-form-item>
        </el-col>
        <el-form-item label="部门审核意见">
          <el-input
              v-model="operateForm.project_departmentmanager"
              :placeholder="'请输入部门审核意见'"
          ></el-input>
        </el-form-item>
        <el-form-item label="总经理审核意见">
          <el-input
              v-model="operateForm.project_generalmanager"
              :placeholder="'请输入总经理审核意见'"
          ></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item label="上传文件" style="width: 50%;">
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
            :before-upload="onBeforeUpload"
            action=""
            multiple
            :on-change="handleChange"
            :file-list="fileList"
            :auto-upload="false"
            :show-file-list="true"
            :on-progress="uploadOnProgress"
            ref="uploadComponent"
        >
          <el-button type="primary">上传文件</el-button>
          <div slot="tip" class="el-upload__tip">
            请上传格式为jpeg,png,jpg,pdf,doc,docx,xls,xlsx,zip的文件
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="confirm">确 定</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "@/axios/ajax";

export default {
  data() {
    return {
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
        project_construction: '',
        project_assets: '',
        project_audit: '',
        project_reduction: '',
        project_departmentmanager:'',
        project_generalmanager:''
      },
      loadProgress: 0, // 动态显示进度条
      progressFlag: false, // 关闭进度条
      fileList: [],
    }
  },
  methods: {
    handleChange(file, fileList) {
      this.fileList = fileList;
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

    onBeforeUpload(file) {
      // console.log(file)
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
    confirm() {
      //console.log(this.$refs.commonForm.$children[0]);

      let formdata = new FormData();
      console.log(this.fileList)
      if (this.fileList.length != 0) {
        for (var file of this.fileList) {
          formdata.append("files", file.raw, file.raw.name)
        }
        this.fileList = []
      }

      // axios._post('http://localhost:8080/project/insert', formdata).then(res => {
      //   this.$message.success("新建项目成功！");
      //this.$router.push({path:'/project'})
      // }, err => {
      //   alert("Add Error!");
      //   this.$message({
      //     message: "新建项目失败",
      //     type: "error"
      //   });
      // })
      this.$router.push({path:'/project'})
    }

  },
}

</script>

<style scoped>

</style>
