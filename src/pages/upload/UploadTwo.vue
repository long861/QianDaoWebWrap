<template>
  <div class="weui-cells weui-cells_form">
    <div class="weui-cell">
      <div class="weui-cell__bd">
        <div class="weui-uploader">
          <div class="weui-uploader__bd">
            <ul class="weui-uploader__files" id="uploaderFiles">
              <li class="weui-uploader__file" :style="'background-image:url(' + imgs + ')'"></li>
            </ul>
            <div class="weui-uploader__input-box">
              <input
                id="uploaderInput"
                class="weui-uploader__input"
                type="file"
                accept="image/*"
                name="file"
                @change="upload($event)"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { api } from "../../axios";
export default {
  data() {
    return {
      imgs: this.img
    };
  },
  components: {},
  watch: {},
  props: ["img"],
  methods: {
    upload(e) {
      var data = $(e.target).val();
      api.post("/api/upload/One", { file: data }).then(res => {
        // console.log("res", res);
      });
    }
  }
};
</script>

<style scoped>
.weui-cells.weui-cells_form {
  margin-top: 0px;
}
.weui-cells:before {
  display: none;
}
.weui-cells:after {
  display: none;
}
</style>