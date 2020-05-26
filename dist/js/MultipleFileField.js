"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _jquery = _interopRequireDefault(require("jquery"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var MultipleFileField = /*#__PURE__*/function (_React$Component) {
  _inherits(MultipleFileField, _React$Component);

  var _super = _createSuper(MultipleFileField);

  function MultipleFileField(props) {
    var _this;

    _classCallCheck(this, MultipleFileField);

    _this = _super.call(this, props);
    _this.state = {
      files: {},
      data: {}
    };
    _this.isCompMounted = false;
    _this.clickHandler = _this.clickHandler.bind(_assertThisInitialized(_this));
    _this.changeFieldHandler = _this.changeFieldHandler.bind(_assertThisInitialized(_this));
    _this.dropAreaRef = _react["default"].createRef();
    _this.fileFieldRef = _react["default"].createRef();
    return _this;
  }

  _createClass(MultipleFileField, [{
    key: "changeValue",
    value: function changeValue() {
      this.props.onChange(this.props.name, this.state.data);
    }
  }, {
    key: "clickHandler",
    value: function clickHandler() {
      (0, _jquery["default"])(this.fileFieldRef.current).trigger('click');
    }
  }, {
    key: "setDropHandler",
    value: function setDropHandler() {
      var thisObj = this;
      var dropArea = (0, _jquery["default"])(this.dropAreaRef.current);
      dropArea.on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
      }).on('dragover dragenter', function () {
        dropArea.addClass('drag-over');
      }).on('dragleave dragend drop', function () {
        dropArea.removeClass('drag-over');
      }).on('drop', function (e) {
        var droppedFiles = e.originalEvent.dataTransfer.files;
        thisObj.upload(droppedFiles);
      });
    }
  }, {
    key: "changeFieldHandler",
    value: function changeFieldHandler(e) {
      this.upload(this.fileFieldRef.current.files);
    }
  }, {
    key: "removeFile",
    value: function removeFile(id) {
      var state = Object.assign({}, this.state);
      delete state.files[id];
      this.setState({
        files: state.files
      });
      this.changeValue();
    }
  }, {
    key: "render",
    value: function render() {
      var files = [];

      for (var id in this.state.files) {
        files.push(this.renderUploadProgress(this.state.files[id]));
      }

      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("input", {
        type: "file",
        className: "hidden",
        ref: this.fileFieldRef,
        onChange: this.changeFieldHandler,
        multiple: true
      }), this.renderDragDropArea(), files);
    }
  }, {
    key: "renderDragDropArea",
    value: function renderDragDropArea() {
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "drag-drop-area",
        ref: this.dropAreaRef,
        onClick: this.clickHandler
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "file-icon"
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "fa fa-file-o",
        "aria-hidden": "true"
      }), /*#__PURE__*/_react["default"].createElement("span", {
        className: "file-plus"
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "fa fa-plus",
        "aria-hidden": "true"
      }))), /*#__PURE__*/_react["default"].createElement("div", {
        className: "instruction"
      }, translations.front.drag_drop_browse_files));
    }
  }, {
    key: "renderUploadProgress",
    value: function renderUploadProgress(file) {
      var size = file.doneUploading === false ? this.prepareFileSize(file.uploadedSize) + ' ' + translations.front.of + ' ' + this.prepareFileSize(file.size) : this.prepareFileSize(file.size);
      var status = file.doneUploading === false ? translations.front.uploading : file.succeedUploading === true ? translations.front.uploaded : translations.front.failed_uploading;
      var uploadingStatusCls = file.doneUploading === false ? '' : file.succeedUploading === true ? 'status-done' : 'status-failed';
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "p-t-20",
        key: file.id
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "file-upload-progress with-bottom-details ".concat(uploadingStatusCls)
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "file-icon"
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "fa fa-file-o",
        "aria-hidden": "true"
      })), /*#__PURE__*/_react["default"].createElement("div", {
        className: "file-name"
      }, file.fileName, /*#__PURE__*/_react["default"].createElement("a", {
        className: "delete-icon",
        href: "javascript:void(0);",
        onClick: this.removeFile.bind(this, file.id)
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "fa fa-times",
        "aria-hidden": "true"
      }))), /*#__PURE__*/_react["default"].createElement("div", {
        className: "upload-progress-bar"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "upload-progress",
        style: {
          width: file.progress + '%'
        }
      })), /*#__PURE__*/_react["default"].createElement("div", {
        className: "bottom-details"
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "size"
      }, size), /*#__PURE__*/_react["default"].createElement("span", {
        className: "status"
      }, status))));
    }
  }, {
    key: "upload",
    value: function upload(files) {
      var state = Object.assign({}, this.state);
      var formData = new FormData();
      var ids = [];

      for (var i = 0; i < files.length; i++) {
        var id = this.uniqid();
        formData.append('uploads[' + id + ']', files[i]);
        state.files[id] = {
          id: id,
          doneUploading: false,
          succeedUploading: false,
          fileName: files[i].name,
          uploadedFileName: '',
          progress: 0,
          size: files[i].size,
          uploadedSize: 0
        };
      }

      this.setState({
        files: state.files
      });
      var thisObj = this;

      _jquery["default"].ajax({
        xhr: function xhr() {
          var xhr = new window.XMLHttpRequest();
          xhr.upload.addEventListener("progress", function (evt) {
            if (evt.lengthComputable) {
              var percentComplete = evt.loaded / evt.total * 100;
              thisObj.changeUploadingProgress(percentComplete, ids);
            }
          }, false);
          return xhr;
        },
        url: app_url + '/upload-media',
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        type: 'POST',
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        success: function success(data) {
          thisObj.setUploadingResult(data);
        }
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.isCompMounted = true;
      this.setDropHandler();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.isCompMounted = false;
    }
  }, {
    key: "uniqid",
    value: function uniqid() {
      return new Date().getTime() + '' + Math.floor(Math.random() * 11111);
    }
  }, {
    key: "prepareFileSize",
    value: function prepareFileSize(size) {
      if (size == 0) {
        return '';
      }

      var sizeUnit = 'KB';
      size = Math.ceil(size / 1024);

      if (size >= 1024) {
        var _sizeUnit = 'MB';
        size = size % 1024 > 0 ? new Number(size / 1024).toFixed(2) : size / 1024;
      }

      return size + ' ' + sizeUnit;
    }
  }, {
    key: "changeUploadingProgress",
    value: function changeUploadingProgress(percentComplete, ids) {
      var state = Object.assign({}, this.state);

      for (var i = 0; i < ids.length; i++) {
        var file = Object.assign({}, state.files[ids[i]]);
        file.progress = percentComplete;
        file.uploadedSize = file.size * (percentComplete / 100);
        state.files[ids[i]] = file;
      }

      this.setState({
        files: state.files
      });
    }
  }, {
    key: "setUploadingResult",
    value: function setUploadingResult(result) {
      var state = Object.assign({}, this.state);

      for (var id in result) {
        var file = Object.assign({}, state.files[id]);
        file.doneUploading = true;

        if (result[id].success === true) {
          file.progress = 100;
          file.uploadedSize = file.size;
          file.succeedUploading = true;
          file.uploadedFileName = result[id].file_name;
          state.data[id] = {
            original_name: result[id].original_name,
            file_name: result[id].file_name,
            extension: result[id].extension
          };
        } else {
          file.succeedUploading = false;
        }

        state.files[id] = file;
      }

      this.setState({
        files: state.files,
        data: state.data
      });
      this.changeValue();
    }
  }]);

  return MultipleFileField;
}(_react["default"].Component);

var _default = MultipleFileField;
exports["default"] = _default;