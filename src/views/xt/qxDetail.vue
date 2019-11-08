<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-19 10:45:31
 * @LastEditTime: 2019-09-19 10:45:31
 * @LastEditors: your name
 -->
<template>
  <div>
    <el-button type="text" size="small" @click="getTemplate">
      {{ btnText }}
    </el-button>

    <el-dialog
      :title="btnText"
      :visible.sync="centerDialogVisible"
      width="1200px"
      center
    >
      <div class="form-card">
        <div class="form-title">
          <div class="form-rectangle">
            <div class="form-prefix"></div>
            <a>模版信息</a>
            <div class="form-triangle"></div>
          </div>
        </div>
        <div class="form-content">
          <el-row :gutter="0">
            <el-col :md="24" :lg="24" :xl="24">
              <div class="item">
                <div class="label">模版名称：</div>
                <div class="content">{{ form.templateName }}</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="form-card">
        <div class="form-title">
          <div class="form-rectangle">
            <div class="form-prefix"></div>
            <a>字段信息</a>
            <div class="form-triangle"></div>
          </div>
        </div>
        <div class="form-content">
          <el-table :data="form.referenceInfo.fields">
            <el-table-column label="别名" prop="fieldAlias"></el-table-column>
            <el-table-column
              label="字段名称"
              prop="fieldName"
            ></el-table-column>
            <el-table-column label="行政区划">
              <template slot-scope="scope">
                {{ scope.row.isXzqh === 1 ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column label="可编辑">
              <template slot-scope="scope">
                {{ scope.row.isEdit === 1 ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column label="APP必填">
              <template slot-scope="scope">
                {{ scope.row.isAppRequired === 1 ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column label="PC必填">
              <template slot-scope="scope">
                {{ scope.row.isPcRequired === 1 ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column label="在PC展示">
              <template slot-scope="scope">
                {{ scope.row.isPcShow === 1 ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column label="在APP展示">
              <template slot-scope="scope">
                {{ scope.row.isAppShow === 1 ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column label="字段类型">
              <template slot-scope="scope">
                {{ scope.row.fieldType === 1 ? '下拉框' : '输入框' }}
              </template>
            </el-table-column>
            <el-table-column label="枚举值">
              <template slot-scope="scope">
                <el-tooltip
                  effect="dark"
                  :content="getDictionaryInfo(scope)"
                  placement="top"
                >
                  <span>{{ getDictionaryKey(scope) }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { task } from 'api';

export default {
  data() {
    return {
      centerDialogVisible: false,
      form: {
        name: '',
        referenceInfo: {
          fields: [],
        },
      },
      dictionaryKeyList: [],
    };
  },
  props: {
    btnText: {
      type: String,
      default: '详情',
    },
    id: {
      type: [Number, String],
    },
  },
  methods: {
    async getTemplate() {
      this.getDictionaryKeyList();
      let data = {
        id: this.id,
      };
      let res = await task.getTemplateDetail(data);
      this.form = Object.assign({}, this.form, res.data);
      this.centerDialogVisible = true;
    },
    async getDictionaryKeyList() {
      let res = await task.getDictionaryKey();
      this.dictionaryKeyList = res;
    },
    getDictionaryKey(scope) {
      for (let item of this.dictionaryKeyList) {
        if (item.dictionaryKey === scope.row.dictionaryKey) {
          return item.dictionaryName;
        }
      }
    },
    getDictionaryInfo(scope) {
      for (let item of this.dictionaryKeyList) {
        if (item.dictionaryKey === scope.row.dictionaryKey) {
          return item.referenceInfo
            .map(item => {
              return item.optionValue;
            })
            .join(';');
        }
      }
    },
  },
};
</script>
<style lang="scss">
.form-card {
  margin: 20px 0;
  .form-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    line-height: 42px;
    letter-spacing: 0px;
    color: #fff;
    margin-bottom: 10px;
    background-color: #eef2f7;
    .form-rectangle {
      display: inline-block;
      align-items: center;
      height: 42px;
      background-color: #0094ec;
      .form-prefix {
        float: left;
        height: 14px;
        border-right: 4px solid #fff;
        margin: 14px 0px 14px 30px;
      }
      a {
        margin: 0 30px 0 10px;
      }
      .form-triangle {
        float: right;
        width: 0px;
        height: 0px;
        border-top: 21px solid #eef2f7;
        border-right: 21px solid #eef2f7;
        border-bottom: 21px solid #0094ec;
        border-left: 21px solid #0094ec;
      }
    }
  }
  .form-content {
    margin: 25px 30px;
    .item {
      display: flex;
      margin: 0 0 10px 0;
      justify-content: flex-start;
      font-size: 14px;
      .label {
        width: 120px;
        padding: 5px 0;
        text-align: left;
        color: rgb(103, 105, 105);
      }
      .content {
        width: 50%;
        padding: 5px 0 5px 8px;
      }
    }
  }
}
</style>
