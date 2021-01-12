import React, { useRef, useState, useEffect } from "react";

import Button from "./Button";
import "./ImageUpload.css";

const ImageUpload = (props) => {
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);

    const filePickerRef = useRef(); //handling button->input relation

    useEffect(() => {
        //handling preview
        if (!file) {
            return;
        }
        //Browser has a default FileReader api
        //FileReader does not work with callbacks, doen't give a promise

        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    }, [file]);

    const pickedHandler = (event) => {
        //console.log("event.target", event.target);
        //there's default property event.target.files
        let pickedFile;
        let fileIsValid = isValid; //managing timing of isValid change, needs to be set manualy
        if (event.target.files && event.target.files.length === 1) {
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            setIsValid(true);
            fileIsValid = true; //manual handling
        } else {
            setIsValid(false);
            fileIsValid = false; //manual handling
        }
        props.onInput(props.id, pickedFile, fileIsValid);
    };

    const pickImageHandler = () => {
        filePickerRef.current.click();
    };

    return (
        <div className="form-control">
            <input
                id={props.id}
                ref={filePickerRef}
                style={{ display: "none" }}
                type="file"
                accept=".jpeg, .png, .jpeg"
                onChange={pickedHandler}
            />
            <div className={`image-upload ${props.center && "center"}`}>
                <div className="image-upload__preview">
                    {previewUrl && <img src={previewUrl} alt="Preview" />}
                    {!previewUrl && <p>Please Pick An Image.</p>}
                </div>
                <Button type="button" onClick={pickImageHandler}>
                    PICK IMAGE
                </Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    );
};

export default ImageUpload;
