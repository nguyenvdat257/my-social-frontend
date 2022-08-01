import React, { useEffect, useRef, useState } from 'react'
import { AiOutlinePicture } from 'react-icons/ai'
import { Form, Button } from 'react-bootstrap'
import { postAddActions } from '../../store/post-add-slice'
import { useSelector, useDispatch } from 'react-redux'
import { FileUploader } from "react-drag-drop-files";
const fileTypes = ["JPG", "PNG", "GIF"];
const getImageDimensions = file => {
  return new Promise(function (resolved, rejected) {
    var i = new Image()
    i.onload = function () {
      resolved([i.naturalWidth, i.naturalHeight])
    };
    i.src = file
  })
}

const SelectFile = () => {
  const dispatch = useDispatch();
  const type = useSelector(state => state.postAdd.type);
  const selectFileRef = useRef(null);
  const ref = useRef(null);
  const processFiles = files => {
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      const reader = new FileReader();
      reader.addEventListener('load', async () => {
        // const resizedImage = await getResizedImg(reader.result, panelHeight, panelWidth);
        const imgSrc = reader.result;
        const [oWidth, oHeight] = await getImageDimensions(imgSrc);
        if (i === files.length - 1) {
          dispatch(postAddActions.addImage({ image: { src: imgSrc, width: oWidth, height: oHeight }, isLast: true }));
        }
        else {
          dispatch(postAddActions.addImage({ image: { src: imgSrc, width: oWidth, height: oHeight }, isLast: false }));
        }
      }, false);
      reader.readAsDataURL(file);
    }
    dispatch(postAddActions.setPage(1));
  }
  const handleChangeDropFiles = (files) => {
    processFiles(files);
  };
  const handleSelectFileClick = () => selectFileRef.current.click();
  const handleFileChangeChoose = e => {
    const files = e.target.files;
    processFiles(files);
  };

  return (
    <>
      <div className='modal-custom-header'>
        <div></div>
        <div className='bold-text-medium'>Create new {type === 'post' ? 'post' : 'story'}</div>
        <div></div>
      </div>
      <div ref={ref} className='post-add-select-file'>
        <div style={{ marginBottom: '1rem' }}><AiOutlinePicture size={50} /></div>
        <FileUploader handleChange={handleChangeDropFiles} name="file" multiple types={fileTypes} >
          <div className={'fade-text-larger'} style={{width: '100%', paddingBottom: '1rem' }}>Drag photos and videos here</div>
        </FileUploader>
        <div><Button onClick={handleSelectFileClick}>Select from computer</Button></div>
        <Form.Control ref={selectFileRef} onChange={handleFileChangeChoose} type="file"
          multiple={type === 'post' ? 'multiple' : false} style={{ display: 'none' }} />
      </div>
    </>
  )
}

export default SelectFile