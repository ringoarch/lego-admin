<template>
  <div class="image-container">
    <div class="label">
      {{ label }}
      <span class="tips">
        {{ tips }}
        <template v-if="max">
          （最多只能上传{{ max - imageList.length }}张图片）
        </template>
      </span>
    </div>

    <div class="content">
      <flexbox class="images">
        <div
          v-for="(item, index) in imageList"
          :key="index"
          class="img-box">
          <img
            v-src="item.url"
            :key="item.url"
            class="img">
          <div
            class="img-model">
            <i
              class="el-icon-zoom-in set-img-zoom"
              @click.stop="previewImage(index)"/>
            <i
              class="el-icon-delete set-img-delete"
              @click.stop="deleteImg(index)"/>
          </div>
        </div>

        <div
          v-if="imageList.length < max"
          class="img-upload-box img-item"
          @click="upLoadImg">
          <input
            ref="detailImgInput"
            accept="image/*"
            type="file"
            multiple
            class="file-input"
            @change="upLoad">
          <el-button
            type="text"
            icon="el-icon-plus"
            class="cross"/>
        </div>
      </flexbox>
    </div>
  </div>
</template>

<script>
import {
  fileUploadAPI,
  fileDeleteAPI
} from '@/api/common'
import { guid, objDeepCopy } from '@/utils/index'

export default {
  name: 'ImageForm',
  props: {
    value: { // 绑定的 batchId
      type: String,
      default: ''
    },
    max: { // 最大上传图片数量，值为0时不限制
      type: Number,
      default: 9
    },
    label: { // 图片标题
      type: String,
      default: '图片信息'
    },
    tips: { // 图片提示
      type: String,
      default: ''
    },
    defaultValue: { // 默认图片数组
      type: Array,
      default: () => []
    },
    field: { // 附加辅助参数
      type: Object,
      default: () => {}
    },
    initBatchId: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imageList: [],
      batchId: null,
      oldBatchId: null
    }
  },
  watch: {
    defaultValue: {
      handler(val) {
        if (val.length > 0) {
          this.imageList = objDeepCopy(val || [])
          this.$nextTick(() => {
            this.batchId = this.defaultValue[0].batchId
            this.$emit('input', this.defaultValue[0].batchId)
            this.updateVal()
          })
        }
      },
      deep: true,
      immediate: true
    },
    value: {
      handler(val) {
        this.batchId = val || null
      },
      immediate: true
    }
  },
  methods: {
    previewImage(index) {
      this.$previewFile.preview({
        index: index,
        data: this.imageList
      })
    },

    deleteImg(index) {
      const params = {}
      params.id = this.imageList[index].fileId

      this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        fileDeleteAPI(params.id).then(res => {
          this.$message.success('删除成功')
          this.imageList.splice(index, 1)
          this.updateVal()
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },

    upLoadImg() {
      this.$refs.detailImgInput.click()
    },

    upLoad(event) {
      let files = Array.from(event.target.files)
      if (this.max && files.length + this.imageList.length > this.max) {
        files = files.slice(0, this.max - this.primaryList.length)
        this.$message.error(`最多只能上传${this.max}张图片`)
      }

      if (files.length === 0) return
      if (!this.batchId && files.length > 1) {
        this.batchId = guid()
      }
      for (let index = 0; index < files.length; index++) {
        const params = {}
        if (this.batchId) {
          params.batchId = this.batchId
        }
        // if (this.initBatchId && !this.oldBatchId) {
        //   delete params.batchId
        // }
        this.$legoUploadFile.upload({
          request: fileUploadAPI,
          file: files[index],
          params: params
        }).then(data => {
          const { res } = data
          this.batchId = res.data.batchId
          this.oldBatchId = this.batchId

          res.data.url = `/adminFile/down/${res.data.fileId}`
          this.imageList.push(res.data)
          this.loading = false
          this.updateVal()
        }).catch(() => {})
      }
    },

    updateVal() {
      if (this.imageList.length === 0) {
        this.$emit('change', this.field, null, [])
        this.$emit('input', '')
      } else {
        this.$emit('change', this.field, this.batchId, this.imageList)
        this.$emit('input', this.batchId)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.image-container {
  margin-left: 15px;
  .label {
    font-size: 13px;
    margin-top: 20px;

    .tips {
      color: #C1C1C1;
    }
  }

  .content {
    .images {
      overflow-x: auto;
      margin: 10px 0;
      .img-box {
        position: relative;
        margin-right: 20px;
        flex-shrink: 0;
        cursor: pointer;
        &:hover {
          .img-model {
            visibility: visible;
          }
        }

        .img {
          width: 100px;
          height: 80px;
          border-radius: $xr-border-radius-base;
        }
        .img-model {
          position: absolute;
          z-index: 10;
          line-height: 86px;
          background-color: #2d3037;
          opacity: 0.8;
          border-radius: 6px;
          visibility: hidden;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          .set-img-zoom {
            font-size: 20px;
            color: white;
            cursor: pointer;
            padding-left: 15px;
          }
          .set-img-delete {
            font-size: 20px;
            color: white;
            padding-left: calc(50% - 35px);
            cursor: pointer;
          }
        }
      }

      .img-upload-box {
        flex-shrink: 0;
        width: 100px;
        height: 80px;
        display: flex;
        cursor: pointer;
        border-radius: 6px;
        position: relative;
        text-align: center;
        border: 1px #c0ccda dashed;
        margin-bottom: 5px;
        .file-input {
          width: 0;
          height: 0;
          visibility: hidden;
        }
        .cross {
          color: #606266;
          font-size: 20px;
          margin-left: calc(50% - 10px);
        }
      }
    }
  }
}

::v-deep.el-icon-zoom-in {
  margin-right: 10px;
}
</style>
