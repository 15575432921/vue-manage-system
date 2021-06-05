<template>
  <div class="app-container">
    <!--表单-->
    <el-form :inline="true" class="demo-form-inline" :rules="rules" :model="searchObj"  >

      <!--      <el-form-item>-->
      <!--        <el-select v-model="searchObj.type" clearable placeholder="请选择">-->
      <!--          <el-option label="项目" value="project"/>-->
      <!--          <el-option label="文档" value="file"/>-->
      <!--          <el-option label="合同" value="contract"/>-->
      <!--          <el-option label="投标" value="tender"/>-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->

      <el-form-item prop="begin" label="开始日期">
        <el-date-picker
            v-model="searchObj.begin"
            type="date"
            placeholder="选择开始日期"
            value-format="yyyy-MM-dd"/>
      </el-form-item>
      <el-form-item prop="end" label="截止日期">
        <el-date-picker
            v-model="searchObj.end"
            type="date"
            placeholder="选择截止日期"
            value-format="yyyy-MM-dd"/>
      </el-form-item>
      <el-form-item label="经办人">
        <el-input
            v-model="searchObj.projectHead" placeholder="请输入经办人"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="项目类型">
        <el-select v-model="searchObj.projectType" clearable placeholder="请选择项目类型">
          <el-option label="财务审计" value="财务审计"/>
          <el-option label="工程审计" value="工程审计"/>
          <el-option label="税务审计" value="税务审计"/>
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="searchObj.if_issued" clearable placeholder="请选择">
          <el-option label="待审核" value="0"/>
          <el-option label="被退回" value="1"/>
          <el-option label="总审通过" value="2"/>
          <el-option label="合伙人通过" value="3"/>
        </el-select>
      </el-form-item>
      <el-button
          :disabled="btnDisabled"
          type="primary"
          icon="el-icon-search"
          @click="showChart()">查询
      </el-button>
    </el-form>

    <div class="chart-container">
      <div id="barChart" class="chart" style="height:500px;width:100%"/>
      <div id="pieChart" class="chart" style="height:500px;width:100%"/>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import axios from '../../axios/ajax'

export default {
  data() {
    return {
      searchObj: {
        type: 'project',
        begin: '',
        end: '',
        projectHead: '',
        projectType: '',
        if_issued: ''
      },
      rules: {
        begin: [
          {required: true, message: '请选择开始日期', trigger: 'blur'},
        ],
        end: [
          {required: true, message: '请选择截止日期', trigger: 'blur'},
        ]
      },
      btnDisabled: false,
      // chart: null,
      title: '',
      xData: [],
      yData: [],
      end: 1200
    }
  },
  methods: {
    showChart() {
      this.initChartData()
    },

    // 准备图表数据
    initChartData() {
      console.log(this.searchObj);
      // axios._post("http://8.129.86.121:80/sta/getAll",this.searchObj).then(res=>{
      axios._post("/sta/getAll", this.searchObj).then(res => {
        this.$message.success("获取文档列表成功！")
        this.xData = res.xData
        this.yData = res.yData
        let n = this.xData.length
        if (n > 12)
          this.end = 1200 / n;
        this.setBarChart()
        // this.setPieChart()
      }).catch()
      {
      }

    },

    // 设置图标参数
    setBarChart() {
      // 基于准备好的dom，初始化echarts实例
      var barChart = echarts.init(document.getElementById('barChart'))
      // console.log(this.chart)

      // 指定图表的配置项和数据
      var option = {
        tooltip: {
          trigger: 'axis',
        },
        dataZoom: [
          {
            show: true,
            realtime: true,
            start: 0,
            end: this.end
          }
        ],
        color: ['#61a0a8'],
        // x轴是类目轴（离散数据）,必须通过data设置类目数据
        xAxis: {
          type: 'category',
          data: this.xData
        },
        // y轴是数据轴（连续数据）
        yAxis: {
          type: 'value'
        },
        // 系列列表。每个系列通过 type 决定自己的图表类型
        series: [{
          // 系列中的数据内容数组
          data: this.yData,
          // 折线图
          // type: 'line'
          // 柱状图
          type: 'bar'
        }]
      }
      barChart.setOption(option)
    },
    setPieChart() {
      // 基于准备好的dom，初始化echarts实例
      var pieChart = echarts.init(document.getElementById('pieChart'))
      // console.log(this.chart)

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '某站点用户访问来源',
          subtext: '纯属虚构',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: '经办人',
            type: 'pie',
            radius: '50%',
            center: ['30%', '50%'],
            data: [
              {value: 1048, name: '搜索引擎'},
              {value: 735, name: '直接访问'},
              {value: 580, name: '邮件营销'},
              {value: 484, name: '联盟广告'},
              {value: 300, name: '视频广告'}
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          },
          {
            name: '项目类型',
            type: 'pie',
            radius: '50%',
            center: ['70%', '50%'],
            data: [
              {value: 1048, name: '财务审计'},
              {value: 735, name: '工程审计'},
              {value: 580, name: '竣工决算审计'},
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      pieChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
//@import '~@/assets/scss/home';
</style>
