<template>
  <el-form-item label="封面图片" required>
    <el-upload
      class="avatar-uploader"
      action="/api/upload/One"
      :show-file-list="false"
      accept="image/jpeg,image/png"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="Img_upload" :src="Img_upload" class="cover" style="width:100px;height:100px;">
      <i
        class="el-icon-plus avatar-uploader-icon"
        style="border: 1px dashed #d9d9d9;width:100px;height:100px;position: relative;line-height: 100px;"
      ></i>
    </el-upload>
  </el-form-item>
</template>

<script>
export default {
  data() {
    return {
      Img_upload: this.Img_upload
    };
  },
  components: {},
  props: ["Img_upload"],
  mounted() {},
  methods: {
    handleAvatarSuccess(res, file) {
      this.avatarUploading = false;
      if (res.code === 0) {
        this.Img_upload = res.data;
        this.$emit("cover", this.Img_upload);
      } else {
        this.$message.error(res.msg);
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = (file.type == "image/jpeg") || (file.type == "image/png");
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 10MB!");
      }
      if (isJPG && isLt2M) this.avatarUploading = true;
      return isJPG && isLt2M;
    }
  }
};
</script>

<style scoped>
</style>