import React, { Fragment,useContext,useState } from 'react';
import './Create.css';
import Header from '../Header/Header';
import {Context,FirebaseContext,AuthContext} from '../../store/FirebaseContext';
import { getDownloadURL, uploadBytes,ref } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from "firebase/firestore";
import { firestore } from '../../firebase/config';

const Create = () => {
  const {firestore,storage } = useContext(FirebaseContext)
  const {user}= useContext(AuthContext)
  const [name,setName]=useState('')
  const [category,setCategory]=useState('')
  const [price,setPrice]=useState(0)
  const [image,setImage]=useState(null)

  const navigate = useNavigate();

  const date = new Date();  
  const handleSubmit = async ()=>{

    const storageRef = ref(storage, `images/${image.name}`);
    uploadBytes(storageRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
         addDoc(collection(firestore, "products"),{
          name:name,
          category:category,
          price:price,
          url:url,
          userId: user.uid,
          createdAt: date.toDateString(),
        }).then(()=>{
        navigate('/')

        })
      })
    })
 
  }
  return (
    <Fragment>
      <Header />
      <card>
        <div className="centerDiv">
            <label htmlFor="fname">Name</label>
            <br />
            <input
              className="input"
              type="text"
              id="fname"
              value={name}
              onChange={(e)=>{
                setName(e.target.value)
              }}
              name="Name"
              defaultValue="John"
            />
            <br />
            <label htmlFor="fname">Category</label>
            <br />
            <input
              className="input"
              type="text"
              id="fname"
              value={category}
              onChange={(e)=>{
                setCategory(e.target.value)
              }}
              name="category"
              defaultValue="John"
            />
            <br />
            <label htmlFor="fname">Price</label>
            <br />
            <input className="input" type="number"
            value={price}
              onChange={(e)=>{
                setPrice(e.target.value)
              }} id="fname" name="Price" />
            <br />
          <br />
          <img alt="Posts" src={image ? URL.createObjectURL(image):'' } width="200px" height="200px" ></img>
            <br />
            <input onChange={(e)=>{
              setImage(e.target.files[0])
            }} type="file" />
            <br />
            <button onClick={handleSubmit} className="uploadBtn">upload and Submit</button>
        </div>
      </card>
    </Fragment>
  );
};

export default Create;
