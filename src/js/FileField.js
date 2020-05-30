import React from 'react';
import jQuery from 'jquery';
import 'font-awesome/css/font-awesome.css';


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
class FileField extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			uploading: false,
			doneUploading: false,
			fileName: '',
			progress: 0,
			readOnly: false
		};
		this.isCompMounted = false;
		this.changeValue = this.changeValue.bind(this);
		this.clickHandler = this.clickHandler.bind(this);
		this.changeFieldHandler = this.changeFieldHandler.bind(this);
		this.removeFile = this.removeFile.bind(this);
		this.dropAreaRef = React.createRef();
		this.fileFieldRef = React.createRef();
		this.texts = (this.props.texts !== undefined)? this.props.texts : {};
		this.texts = jQuery.extend({
			drag_drop_browse_files: 'Drag and drop or browse your files',
			no_file_uploaded: 'No file uploaded'
		}, this.texts);
	}
	
	changeValue(value){
		this.props.onChange(this.props.name, value);
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
		    thisObj.upload(droppedFiles[0]);
		});
	}
	
	changeFieldHandler(e){
		this.upload(this.fileFieldRef.current.files[0]);
	}
	
	removeFile(){
		this.changeValue('');
		this.setState({
			uploading: false,
			doneUploading: false,
			fileName: '',
			progress: 0
		});
	}
	
	render(){
		let content = '';
		if(this.props.value != '' && this.state.uploading === false){
			content = this.renderFileUploaded();
		}
		else if(this.props.value == '' && this.state.readOnly == true){
			content = this.renderNoFileUploaded();
		}
		else if(this.props.value == '' && this.state.uploading === false){
			content = this.renderDragDropArea();
		}
		else if(this.state.uploading === true){
			content = this.renderUploadProgress();
		}
		
		return (
			<React.Fragment>
				<input type="file" className="hidden" ref={this.fileFieldRef} onChange={this.changeFieldHandler} />
				
				{content}
			</React.Fragment>
		);
	}
	
	renderFileUploaded(){
		return (
			<div className="file-uploaded">
				<span className="file-icon"><i className="fa fa-file-o" aria-hidden="true"></i></span>
				
				<div className="file-name">
					<a className="file-link" href={this.props.filePath + this.props.value} target="_blank">Browse file</a>
					
					{this.state.readOnly == false && 
					<a className="delete-icon" href="javascript:void(0);" onClick={this.removeFile}>
						<i className="fa fa-times" aria-hidden="true"></i>
					</a>}
				</div>
			</div>
		);
	}
	
	renderDragDropArea(){
		return (
			<div className="drag-drop-area" ref={this.dropAreaRef} onClick={this.clickHandler}>
				<div className="file-icon">
					<i className="fa fa-file-o" aria-hidden="true"></i>
					<span className="file-plus"><i className="fa fa-plus" aria-hidden="true"></i></span>
				</div>
				
				<div className="instruction">{this.texts.drag_drop_browse_files}</div>
			</div>
		);
	}
	
	renderUploadProgress(){
		return (
			<div className={`file-upload-progress ${(this.state.doneUploading === true)? 'status-done' : ''}`}>
				<span className="file-icon"><i className="fa fa-file-o" aria-hidden="true"></i></span>
				
				<div className="file-name">
					{this.state.fileName}
					<a className="delete-icon" href="javascript:void(0);" onClick={this.removeFile}>
						<i className="fa fa-times" aria-hidden="true"></i>
					</a>
				</div>
				
				<div className="upload-progress-bar">
					<div className="upload-progress" style={{width: this.state.progress + '%'}}></div>
				</div>
			</div>
		);
	}
	
	renderNoFileUploaded(){
		return (
			<div className="file-uploaded">
				<span className="file-icon"><i className="fa fa-file-o" aria-hidden="true"></i></span>
				
				<div className="file-name">
					<span>{this.texts.no_file_uploaded}</span>
				</div>
			</div>
		);
	}
	
	upload(file){
		this.setState({
			uploading: true,
			doneUploading: false,
			fileName: file.name,
			progress: 0
		});
		var formData = new FormData();
		formData.append(this.props.postingParamName, file);
		
		let thisObj = this;
		jQuery.ajax({
			xhr: function(){
				let xhr = new window.XMLHttpRequest();
				
				xhr.upload.addEventListener("progress", function(evt){
					if(evt.lengthComputable){
						let percentComplete = (evt.loaded / evt.total) * 100;
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
			success: function(response){
				if(response.success === true){
					thisObj.setState({
						doneUploading: true,
						progress: 100
					});
					
					setTimeout(function(){
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
	
	componentDidMount(){
		this.isCompMounted = true;
		this.setState({
			readOnly: (this.props.readOnly !== undefined)? this.props.readOnly : false
		});
		this.setDropHandler();
	}
	
	componentDidUpdate(prevProps, prevState, snapshot){
		if(prevProps.readOnly !== this.props.readOnly){
			this.setState({
				readOnly: (this.props.readOnly !== undefined)? this.props.readOnly : false
			});
		}
	}
	
	componentWillUnmount(){
		this.isCompMounted = false;
	}
}


export default FileField;