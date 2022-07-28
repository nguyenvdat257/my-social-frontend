import React, { useEffect, useRef } from 'react'
import { AiOutlinePicture } from 'react-icons/ai'
import { Form, Button } from 'react-bootstrap'
import { postAddActions } from '../../store/post-add-slice'
import { useSelector, useDispatch } from 'react-redux'

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
  const handleSelectFileClick = () => selectFileRef.current.click();
  const handleFileChange = e => {
    if (!e.target.files) return;
    const files = e.target.files;
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
  };

  return (
    <>
      <div className='modal-custom-header'>
        <div></div>
        <div className='bold-text'>Create new {type === 'post' ? 'post' : 'story'}</div>
        <div></div>
      </div>
      <div ref={ref} className='post-add-select-file'>
        <div style={{ marginBottom: '1rem' }}><AiOutlinePicture size={50} /></div>
        <div className={'fade-text'} style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Drag photos and videos here</div>
        <div><Button onClick={handleSelectFileClick}>Select from computer</Button></div>
        <Form.Control ref={selectFileRef} onChange={handleFileChange} type="file"
          multiple={type === 'post' ? 'multiple' : false} style={{ display: 'none' }} />

      </div>
    </>
  )
}

export default SelectFile