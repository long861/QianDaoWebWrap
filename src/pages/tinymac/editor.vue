<template>
  <div class="app-container">
    <quill-editor
      class="editor needsclick"
      ref="myTextEditor"
      v-model="content"
      :options="editorOption"
      @change="onEditorChange($event)"
      @focus="onEditorFocus($event)"
      v-loading="loading"
    >
      <div id="toolbar" slot="toolbar">
        <select class="ql-size">
          <option value="small">小号</option>
          <!-- Note a missing, thus falsy value, is used to reset to default -->
          <option selected>默认字号</option>
          <option value="large">中号</option>
          <option value="huge">大号</option>
        </select>
        <!-- Add subscript and superscript buttons -->
        <span class="ql-formats" title="下标">
          <button class="ql-script" value="sub"></button>
        </span>
        <span class="ql-formats" title="上标">
          <button class="ql-script" value="super"></button>
        </span>
        <span class="ql-formats" title="加粗">
          <button type="button" class="ql-bold"></button>
        </span>
        <span class="ql-formats" title="斜体">
          <button type="button" class="ql-italic"></button>
        </span>
        <span class="ql-formats" title="斜体">
          <button type="button" class="ql-strike"></button>
        </span>
        <span class="ql-formats">
          <select class="ql-font" defaultValue="small">
            <option selected>默认字体</option>
            <option value="serif">衬线字体</option>
            <option value="monospace">等宽字体</option>
          </select>
        </span>
        <span class="ql-formats" title="对齐">
          <select class="ql-align">
            <option selected aria-placeholder="左对齐"></option>
            <option value="center" label="Center" title="居中对齐"></option>
            <option value="right" label="Right"></option>
            <option value="justify" label="Justify"></option>
          </select>
        </span>
        <span class="ql-formats" title="引用">
          <button type="button" class="ql-blockquote"></button>
        </span>
        <span class="ql-formats" title="有序列表">
          <button type="button" class="ql-list" value="ordered"></button>
        </span>
        <span class="ql-formats" title="无序列表">
          <button type="button" class="ql-list" value="bullet"></button>
        </span>
        <span class="ql-formats" title="超链接">
          <button type="button" class="ql-link"></button>
        </span>
        <span class="ql-formats" title="图片">
          <button type="button" @click="imgClick" style="outline:none">
            <svg viewBox="0 0 18 18">
              <rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect>
              <circle class="ql-fill" cx="6" cy="7" r="1"></circle>
              <polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline>
            </svg>
          </button>
        </span>
        <span class="ql-formats" title="视频">
          <button type="button" class="ql-video"></button>
        </span>
      </div>
    </quill-editor>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "../../../static/css/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import axios from "axios";
import { api } from "../../axios";
export default {
  name: "editor",
  props: {
    /*编辑器的内容*/
    value: {
      type: String
    },
    title:{type:String},
    /*图片大小*/
    maxSize: {
      type: Number,
      default: 1024 * 1024 * 1024 * 10 //kb
    },
    uploadUrl: {
      type: String,
      default: "/api/upload/One"
    },
    maxUploadSize: {
      type: Number,
      default: 1024 * 1024 * 1024 * 10
    },
    fileName: {
      type: String,
      default: "file"
    }
  },
  data: function() {
    return {
      content: this.value,
      // editorOption: {
      //   placeholder: "请输入内容"
      // },
      editorOption: {
        modules: {
          toolbar: "#toolbar"
        },
        placeholder: this.title || "请输入内容"
      },
      imgIndex: 0,
      loading: false
    };
  },
  components: {
    quillEditor
  },
  computed: {
    editor() {
      return this.$refs.myTextEditor.quill;
    }
  },
  watch: {
    value(newVal, oldVal) {
      if (this.editor) {
        if (newVal !== this.content) {
          this.content = newVal;
        }
      }
    }
  },
  methods: {
    onEditorChange({ editor, html, text }) {
      //内容改变事件
      var that = this;
      this.content = html;
      that.$emit("text_change", this.content);
    },
    onEditorFocus(editor) {
      //获得焦点事件
    },
    /*选择上传图片切换*/
    onFileChange(e) {
      var fileInput = e.target;
      this.loading = true;
      if (fileInput.files.length === 0) {
        this.loading = false;
        return;
      }
      if (fileInput.files[0].size > this.maxUploadSize) {
        this.$alert("图片不能大于500KB", "图片尺寸过大", {
          confirmButtonText: "确定",
          type: "warning"
        });
      }
      var data = new FormData();
      data.append(this.fileName, fileInput.files[0]);
      api.post(this.uploadUrl, data).then(res => {
        if (res.data) {
          // this.editor.insertEmbed(this.imgIndex, "image", res.data.data);
          this.editor.insertEmbed(
            this.editor.getSelection().index + 1,
            "image",
            res.data.data
          );
          // this.editor.setSelection(this.editor.getSelection().index+1);
          this.loading = false;
        }
      });
    },
    /*点击上传图片按钮*/
    imgClick() {
      this.imgIndex = this.editor.getSelection().index;
      if (!this.uploadUrl) {
        return;
      }
      /*内存创建input file*/
      var input = document.createElement("input");
      input.type = "file";
      input.name = this.fileName;
      input.accept = "image/jpeg,image/png,image/jpg,image/gif";
      input.onchange = this.onFileChange;
      input.click();
    }
  }
};
</script>
<style scoped>
.editor {
  /* max-width: 1100px; */
  overflow-x: auto;
  overflow-y: auto;
  padding: 0px;
}
.editor-btn {
  margin-top: 20px;
}
</style>