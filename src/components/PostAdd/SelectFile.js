import React, { useEffect, useRef } from 'react'
import { AiOutlinePicture } from 'react-icons/ai'
import { Form, Button } from 'react-bootstrap'
import { postAddActions } from '../../store/post-add-slice'
import { useSelector, useDispatch } from 'react-redux'


function resizeImage(img) {
  var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    oWidth = img.naturalWidth,
    oHeight = img.naturalHeight,
    ratio = oWidth / oHeight,
    width = (ratio > 1) ? Math.min(200, oWidth) : Math.min(100, oWidth),
    height = Math.round(width / ratio);
  canvas.width = width;
  canvas.height = height;
  canvas.className = 'temp-cnv';
  document.body.appendChild(canvas);
  ctx.drawImage(img, 0, 0, width, height);
  return canvas;
}

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', error => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

function getImageDimensions(file) {
  return new Promise(function (resolved, rejected) {
    var i = new Image()
    i.onload = function () {
      resolved([i.naturalWidth, i.naturalHeight])
    };
    i.src = file
  })
}

const getResizedImg = async (img, panelHeight, panelWidth) => {
  const image = await createImage(img)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  /* setting canvas width & height allows us to 
  resize from the original image resolution */
  const [oWidth, oHeight] = await getImageDimensions(img)
  const ratio = oWidth / oHeight
  // if (ratio > 1) {
  //   canvas.height = panelHeight
  //   canvas.width = panelHeight * ratio
  // }
  // else {
  //   canvas.width = panelWidth
  //   canvas.height = panelWidth / ratio
  // }
  canvas.width = oWidth;
  canvas.height = oHeight;

  ctx.drawImage(
    image,
    0,
    0,
    canvas.width,
    canvas.height
  )

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob)
    }, 'image/jpeg')
  })
}

const SelectFile = () => {
  const dispatch = useDispatch();
  const selectFileRef = useRef(null);
  const ref = useRef(null);
  const panelHeight = useSelector(state => state.postAdd.panelHeight);
  const panelWidth = useSelector(state => state.postAdd.panelWidth);
  const handleSelectFileClick = () => selectFileRef.current.click();
  const handleFileChange = e => {
    if (!e.target.files) return;
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      const reader = new FileReader();
      reader.addEventListener('load', async () => {
        const resizedImage = await getResizedImg(reader.result, panelHeight, panelWidth);
        if (i === files.length - 1) {
          dispatch(postAddActions.addImage({ image: resizedImage, isLast: true }));
        }
        else {
          dispatch(postAddActions.addImage({ image: resizedImage, isLast: false }));
        }
      }, false);
      reader.readAsDataURL(file);
    }
    dispatch(postAddActions.setPage(1));
  };
  useEffect(() => {
    dispatch(postAddActions.setPanelSize({ height: ref.current.clientHeight, width: ref.current.clientWidth }));
  })

  return (
    <div ref={ref} className='post-add-select-file'>
      <div style={{ marginBottom: '1rem' }}><AiOutlinePicture size={50} /></div>
      <div className={'fade-text'} style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Drag photos and videos here</div>
      <div><Button onClick={handleSelectFileClick}>Select from computer</Button></div>
      <Form.Control ref={selectFileRef} onChange={handleFileChange} type="file" multiple="multiple" style={{ display: 'none' }} />

    </div>
  )
}

export default SelectFile