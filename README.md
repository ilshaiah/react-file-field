# react-file-field

React file/multiple files field components with drop area and progress bar

## Installation

`npm install --save git+https://github.com/ilshaiah/react-file-field.git`

## Usage

First, you need import

```js
import {FileField, MultipleFileField} from 'react-file-field';
import 'react-file-field/dist/style.css';
```
You need to use css and files loader with webpack. webpack.config.js will contain

```js
...
module.exports = {
    ...
    module: {
        rules: [
        ...
        {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
            ]
        },{
            test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
            use: [
                'file-loader'
            ]
        }]
    ...
    }
```

## Component usage

```js
const props = {
    name: 'attach',
    value: '',
    filePath: 'http://localhost/api_test/',
    onChange: '',
    postingParamName: 'upload',
    uploadURL: 'http://localhost/api_test/upload.php'
};

...

<FileField {...props} />
```

As for having a field for multiple files

```js
<MultipleFileField name="attachments" postingParamName="upload" uploadURL="http://localhost/api_test/upload.php" />
```

## Props:

Parameters of FileField component:

| Property               | Type   | Description                                                                                          |
| :--------------------- | :----- | :--------------------------------------------------------------------------------------------------- |
| name                   | string | Field name. It is used when parent form gets submitted.          |
| value (default: '')    | string | Setting the value of the field value, in edit mode               |
| filePath               | string | The path of uploaded files                                       |
| onChange               | func   | Callback function, which is called whenever there is a change of value, must accept two parameters, 1) name of field, 2) current value                                            |
| postingParamName       | string | Name of uploaded file for posting to the server.                 |
| uploadURL              | string | URL to post uploaded file to                                     |
| readOnly (default: false)| boolean| For read only field. For the case of non editable form         |
| texts                  | object | Texts and messages. the default value is: {drag_drop_browse_files: 'Drag and drop or browse your files', no_file_uploaded: 'No file uploaded'}                                                                                                    |

Parameters of MultipleFileField component:

| Property               | Type   | Description                                                                                          |
| :--------------------- | :----- | :--------------------------------------------------------------------------------------------------- |
| name                   | string | Field name. It is used when parent form gets submitted.          |
| onChange               | func   | Callback function, which is called whenever there is a change of value, must accept two parameters, 1) name of field, 2) current value                                            |
| postingParamName       | string | Name of uploaded file for posting to the server.                 |
| uploadURL              | string | URL to post uploaded file to                                     |
| texts                  | object | Texts and messages. the default value is: {drag_drop_browse_files: 'Drag and drop or browse your files', uploading: 'Uploading', uploaded: 'Uploaded', failed_uploading: 'Failed uploading', of: 'of'}

## Example

```js
import React from 'react';
import {FileField, MultipleFileField} from 'react-file-field';
import 'react-file-field/dist/style.css';
import jQuery from 'jquery';


class Form extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: {
                oneFile: '',
                manyFiles: []
            }
        };
        
        this.handleFileFieldChange = this.handleFileFieldChange.bind(this);
    }
    
    handleFileFieldChange(name, value){
        let data = Object.assign({}, this.state.data);
        data[name] = value;
        
        this.setState({
            data
        });
    }
    
    render(){
        return (
            <div>
                <div>
                    <label htmlFor="oneFile">One file upload</label>
                    <FileField name="oneFile" value={this.state.data.oneFile} filePath="http://localhost/api_test/" onChange={this.handleFileFieldChange} postingParamName="upload" uploadURL="http://localhost/api_test/upload.php" />
                </div>
                <br />
                
                <div>
                    <label htmlFor="manyFiles">Many files upload</label>
                    <MultipleFileField name="manyFiles" onChange={this.handleFileFieldChange} postingParamName="upload" uploadURL="http://localhost/api_test/upload2.php" />
                </div>
                <br />
            </div>
        );
    }
}


export default Form;
```

As for server side implementation and response. Here's an example written in PHP.
The first code snippet is for single file upload.

```php
<?php ob_start();
header("Content-Type: application/json");

$extension = strtolower(substr(strrchr($_FILES['upload']['name'], '.'), 1));
$fileName = uniqid() . '.' . $extension;
$success = @move_uploaded_file($_FILES['upload']['tmp_name'], $fileName);

$response = ['success' => $success, 'fileName' => $fileName];

echo json_encode($response);
```

And here is another example for multiple files upload

```php
<?php ob_start();
header("Content-Type: application/json");

$response = [];
foreach($_FILES['upload']['tmp_name'] as $id => $vals){
    $extension = strtolower(substr(strrchr($_FILES['upload']['name'][ $id ], '.'), 1));
    $fileName = uniqid() . '.' . $extension;
    $success = @move_uploaded_file($_FILES['upload']['tmp_name'][ $id ], $fileName);
    
    $response[ $id ] = [
        'success' => $success,
        'originalName' => $_FILES['upload']['name'][ $id ],
        'fileName' => $fileName,
        'extension' => $extension,
    ];
}

echo json_encode($response);
```

## License

MIT