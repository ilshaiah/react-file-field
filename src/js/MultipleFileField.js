import React from 'react';
import jQuery from 'jquery';


class MultipleFileField extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			files: {},
			data: {}
		};
		this.isCompMounted = false;
		this.clickHandler = this.clickHandler.bind(this);
		this.changeFieldHandler = this.changeFieldHandler.bind(this);
		this.dropAreaRef = React.createRef();
		this.fileFieldRef = React.createRef();
	}
	
	changeValue(){
		this.props.onChange(this.props.name, this.state.data);
	}
	
	clickHandler(){
		jQuery(this.fileFieldRef.current).trigger('click');
	}
	
	setDropHandler(){
		let thisObj = this;
		let dropArea = jQuery(this.dropAreaRef.current);
		dropArea.on('drag dragstart dragend dragover dragenter dragleave drop', function(e){
			e.preventDefault();
			e.stopPropagation();
		})
		.on('dragover dragenter', function(){
			dropArea.addClass('drag-over');
		})
		.on('dragleave dragend drop', function(){
			dropArea.removeClass('drag-over');
		})
		.on('drop', function(e){
		    let droppedFiles = e.originalEvent.dataTransfer.files;
		    thisObj.upload(droppedFiles);
		});
	}
	
	changeFieldHandler(e){
		this.upload(this.fileFieldRef.current.files);
	}
	
	removeFile(id){
		let state = Object.assign({}, this.state);
		delete state.files[id];
		this.setState({
			files: state.files
		});
		
		this.changeValue();
	}
	
	render(){
		let files = [];
		for(let id in this.state.files){
			files.push(this.renderUploadProgress(this.state.files[id]));
		}
		
		return (
			<React.Fragment>
				<input type="file" className="hidden" ref={this.fileFieldRef} onChange={this.changeFieldHandler} multiple />
				
				{this.renderDragDropArea()}
				
				{files}
			</React.Fragment>
		);
	}
	
	renderDragDropArea(){
		return (
			<div className="drag-drop-area" ref={this.dropAreaRef} onClick={this.clickHandler}>
				<div className="file-icon">
					<i className="fa fa-file-o" aria-hidden="true"></i>
					<span className="file-plus"><i className="fa fa-plus" aria-hidden="true"></i></span>
				</div>
				
				<div className="instruction">{translations.front.drag_drop_browse_files}</div>
			</div>
		);
	}
	
	renderUploadProgress(file){
		let size = (file.doneUploading === false)? this.prepareFileSize(file.uploadedSize) + ' ' + translations.front.of + ' ' + this.prepareFileSize(file.size) : this.prepareFileSize(file.size);
		let status = (file.doneUploading === false)? translations.front.uploading : ((file.succeedUploading === true)? translations.front.uploaded : translations.front.failed_uploading);
		let uploadingStatusCls = (file.doneUploading === false)? '' : ((file.succeedUploading === true)? 'status-done' : 'status-failed');
		
		return (
			<div className="p-t-20" key={file.id}>
				<div className={`file-upload-progress with-bottom-details ${uploadingStatusCls}`}>
					<span className="file-icon"><i className="fa fa-file-o" aria-hidden="true"></i></span>
					
					<div className="file-name">
						{file.fileName}
						<a className="delete-icon" href="javascript:void(0);" onClick={this.removeFile.bind(this, file.id)}>
							<i className="fa fa-times" aria-hidden="true"></i>
						</a>
					</div>
					
					<div className="upload-progress-bar">
						<div className="upload-progress" style={{width: file.progress + '%'}}></div>
					</div>
					
					<div className="bottom-details">
						<span className="size">{size}</span>
						<span className="status">{status}</span>
					</div>
				</div>
			</div>
		);
	}
	
	upload(files){
		let state = Object.assign({}, this.state);
		var formData = new FormData();
		let ids = [];
		for(let i = 0; i < files.length; i++){
			let id = this.uniqid();
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
		
		let thisObj = this;
		jQuery.ajax({
			xhr: function(){
				let xhr = new window.XMLHttpRequest();
				
				xhr.upload.addEventListener("progress", function(evt){
					if(evt.lengthComputable){
						let percentComplete = (evt.loaded / evt.total) * 100;
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
			success: function(data){
				thisObj.setUploadingResult(data);
			}
		});
	}
	
	componentDidMount(){
		this.isCompMounted = true;
		this.setDropHandler();
	}
	
	componentWillUnmount(){
		this.isCompMounted = false;
	}
	
	uniqid(){
		return (new Date()).getTime() + '' + Math.floor(Math.random() * 11111);
	}
	
	prepareFileSize(size){
		if(size == 0){
			return '';
		}
		
		let sizeUnit = 'KB';
		size = Math.ceil(size / 1024);
		
		if(size >= 1024){
			let sizeUnit = 'MB';
			size = (size % 1024 > 0)? (new Number(size / 1024)).toFixed(2) : size / 1024;
		}
		
		return size + ' ' + sizeUnit;
	}
	
	changeUploadingProgress(percentComplete, ids){
		let state = Object.assign({}, this.state);
		
		for(let i = 0; i < ids.length; i++){
			let file = Object.assign({}, state.files[ids[i]]);
			file.progress = percentComplete;
			file.uploadedSize = file.size * (percentComplete / 100)
			
			state.files[ids[i]] = file;
		}
		
		this.setState({
			files: state.files
		});
	}
	
	setUploadingResult(result){
		let state = Object.assign({}, this.state);
		
		for(let id in result){
			let file = Object.assign({}, state.files[id]);
			file.doneUploading = true;
			
			if(result[id].success === true){
				file.progress = 100;
				file.uploadedSize = file.size;
				file.succeedUploading = true;
				file.uploadedFileName = result[id].file_name;
				
				state.data[id] = {
					original_name: result[id].original_name,
					file_name: result[id].file_name,
					extension: result[id].extension
				};
			} else{
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
}

export default MultipleFileField;