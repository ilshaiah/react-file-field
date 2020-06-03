# react-file-field

React file field component with drop area and progress bar

## Installation

`npm install --save git+https://github.com/ilshaiah/react-file-field.git`

## Usage

```js
import React from 'react';
import {FileField} from 'react-file-field';
import 'react-file-field/dist/style.css';

const props = {
	name: 'attach',
	value: '',
	filePath: 'http://localhost/api_test/',
	onChange: '',
	postingParamName: 'upload',
	uploadURL: 'http://localhost/api_test/upload.php'
	
};

<FileField {...props} />
```

## Props:

| Property               | Type   | Description                                                                                          |
| :--------------------- | :----- | :--------------------------------------------------------------------------------------------------- |
| name                   | string | Field name. It is used when parent form gets submitted.          |
| value (default: '')    | string | Setting the value of the field value, in edit mode               |
| filePath               | string | The path of uploaded files                                       |
| onChange               | func   | Callback function, which is called whenever there is a change of value, must accept two parameters, 1) name of field, 2) current value                                            |
| postingParamName       | string | Name of uploaded file for posting to the server.                 |

| uploadURL              | string | URL to post uploaded file to                                     |
| readOnly (default: false)| boolean| For read only field. For the case of non editable form         |
| texts                  | object | Texts and messages. the default value is: {
	drag_drop_browse_files: 'Drag and drop or browse your files',
	no_file_uploaded: 'No file uploaded'
}                                                                                                    |
