"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _jquery = _interopRequireDefault(require("jquery"));

require("font-awesome/css/font-awesome.min.css");

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

/*
- uploadURL (string)
- readOnly (boolean) (optional) (default: false)
- texts (object) (optional) (default: {
	drag_drop_browse_files: 'Drag and drop or browse your files',
	no_file_uploaded: 'No file uploaded'
}
- name (string) (field name)
- value (string) (field previous value) (default: '')
- filePath (string) (path of uploaded files)
- onChange (callback function) (accepts two parameters, 1- name of field, 2- current value)
- postingParamName (string) (name of uploaded file for posting to the server)
*/
var FileField = /*#__PURE__*/function (_React$Component) {
  _inherits(FileField, _React$Component);

  var _super = _createSuper(FileField);

  function FileField(props) {
    var _this;

    _classCallCheck(this, FileField);

    _this = _super.call(this, props);
    _this.state = {
      uploading: false,
      doneUploading: false,
      fileName: '',
      progress: 0,
      readOnly: false
    };
    _this.isCompMounted = false;
    _this.changeValue = _this.changeValue.bind(_assertThisInitialized(_this));
    _this.clickHandler = _this.clickHandler.bind(_assertThisInitialized(_this));
    _this.changeFieldHandler = _this.changeFieldHandler.bind(_assertThisInitialized(_this));
    _this.removeFile = _this.removeFile.bind(_assertThisInitialized(_this));
    _this.dropAreaRef = _react["default"].createRef();
    _this.fileFieldRef = _react["default"].createRef();
    _this.texts = _this.props.texts !== undefined ? _this.props.texts : {};
    _this.texts = _jquery["default"].extend({
      drag_drop_browse_files: 'Drag and drop or browse your files',
      no_file_uploaded: 'No file uploaded'
    }, _this.texts);
    return _this;
  }

  _createClass(FileField, [{
    key: "changeValue",
    value: function changeValue(value) {
      this.props.onChange(this.props.name, value);
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
        thisObj.upload(droppedFiles[0]);
      });
    }
  }, {
    key: "changeFieldHandler",
    value: function changeFieldHandler(e) {
      this.upload(this.fileFieldRef.current.files[0]);
    }
  }, {
    key: "removeFile",
    value: function removeFile() {
      this.changeValue('');
      this.setState({
        uploading: false,
        doneUploading: false,
        fileName: '',
        progress: 0
      });
    }
  }, {
    key: "render",
    value: function render() {
      var content = '';

      if (this.props.value != '' && this.state.uploading === false) {
        content = this.renderFileUploaded();
      } else if (this.props.value == '' && this.state.readOnly == true) {
        content = this.renderNoFileUploaded();
      } else if (this.props.value == '' && this.state.uploading === false) {
        content = this.renderDragDropArea();
      } else if (this.state.uploading === true) {
        content = this.renderUploadProgress();
      }

      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("input", {
        type: "file",
        className: "hidden",
        ref: this.fileFieldRef,
        onChange: this.changeFieldHandler
      }), content);
    }
  }, {
    key: "renderFileUploaded",
    value: function renderFileUploaded() {
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "file-uploaded"
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "file-icon"
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "fa fa-file-o",
        "aria-hidden": "true"
      })), /*#__PURE__*/_react["default"].createElement("div", {
        className: "file-name"
      }, /*#__PURE__*/_react["default"].createElement("a", {
        className: "file-link",
        href: this.props.filePath + this.props.value,
        target: "_blank"
      }, "Browse file"), this.state.readOnly == false && /*#__PURE__*/_react["default"].createElement("a", {
        className: "delete-icon",
        href: "javascript:void(0);",
        onClick: this.removeFile
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "fa fa-times",
        "aria-hidden": "true"
      }))));
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
      }, this.texts.drag_drop_browse_files));
    }
  }, {
    key: "renderUploadProgress",
    value: function renderUploadProgress() {
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "file-upload-progress ".concat(this.state.doneUploading === true ? 'status-done' : '')
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "file-icon"
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "fa fa-file-o",
        "aria-hidden": "true"
      })), /*#__PURE__*/_react["default"].createElement("div", {
        className: "file-name"
      }, this.state.fileName, /*#__PURE__*/_react["default"].createElement("a", {
        className: "delete-icon",
        href: "javascript:void(0);",
        onClick: this.removeFile
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "fa fa-times",
        "aria-hidden": "true"
      }))), /*#__PURE__*/_react["default"].createElement("div", {
        className: "upload-progress-bar"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "upload-progress",
        style: {
          width: this.state.progress + '%'
        }
      })));
    }
  }, {
    key: "renderNoFileUploaded",
    value: function renderNoFileUploaded() {
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "file-uploaded"
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "file-icon"
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "fa fa-file-o",
        "aria-hidden": "true"
      })), /*#__PURE__*/_react["default"].createElement("div", {
        className: "file-name"
      }, /*#__PURE__*/_react["default"].createElement("span", null, this.texts.no_file_uploaded)));
    }
  }, {
    key: "upload",
    value: function upload(file) {
      this.setState({
        uploading: true,
        doneUploading: false,
        fileName: file.name,
        progress: 0
      });
      var formData = new FormData();
      formData.append(this.props.postingParamName, file);
      var thisObj = this;

      _jquery["default"].ajax({
        xhr: function xhr() {
          var xhr = new window.XMLHttpRequest();
          xhr.upload.addEventListener("progress", function (evt) {
            if (evt.lengthComputable) {
              var percentComplete = evt.loaded / evt.total * 100;
              thisObj.setState({
                progress: percentComplete
              });
            }
          }, false);
          return xhr;
        },
        url: this.props.uploadURL,
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        type: 'POST',
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        success: function success(response) {
          if (response.success === true) {
            thisObj.setState({
              doneUploading: true,
              progress: 100
            });
            setTimeout(function () {
              thisObj.setState({
                uploading: false,
                doneUploading: false,
                fileName: '',
                progress: 0
              });
            }, 500);
            thisObj.changeValue(response.fileName);
          }
        }
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.isCompMounted = true;
      this.setState({
        readOnly: this.props.readOnly !== undefined ? this.props.readOnly : false
      });
      this.setDropHandler();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, snapshot) {
      if (prevProps.readOnly !== this.props.readOnly) {
        this.setState({
          readOnly: this.props.readOnly !== undefined ? this.props.readOnly : false
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.isCompMounted = false;
    }
  }]);

  return FileField;
}(_react["default"].Component);

var _default = FileField;
exports["default"] = _default;