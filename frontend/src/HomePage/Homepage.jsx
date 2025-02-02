import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
// import Body from '../kanban/component/Body';
import Header from '../kanban/component/Header';
// import Chat from '../chat/Chat';
import { useState ,useRef} from 'react';
import { io } from "socket.io-client";
import { useEffect } from 'react';
import Contacts from '../chat/components/Contacts';
import { allUsersRoute, host } from "../utils/APIRoutes";
import axios from "axios";
import ChatContainer from "../chat/components/ChatContainer";
import { useNavigate } from "react-router-dom";
import Welcome from '../chat/components/Welcome';
// import Backlog from '../kanban/Backlog';
import Todo from '../kanban/Todo';
import Doing from '../kanban/Doing';
const Homepage = () => {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  // const [backlog,setBacklog]= useState(false);
  
  const [todo,setTodo]=useState(false);
  const [doing,setDoing]=useState(false);
  const handleOnClickBacklog=()=>{
    setTodo(false);
    setDoing(false);
    // setBacklog(true);    
  }
  const handleOnClickTodo=()=>{
    setTodo(true);
    // setBacklog(false);
    setDoing(false); 
  }
  const handleOnClickDoing=()=>{
    setDoing(true);
    setTodo(false);
    // setBacklog(false); 
  }
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  useEffect(() => {
    const temp=()=>{
      if (currentUser) {
        socket.current = io(host);
        socket.current.emit("add-user", currentUser._id);
      }
    }
    temp();
   
  }, [currentUser]);
  useEffect( () => {
    const temp=async()=>{
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      } else {
        setCurrentUser(
          await JSON.parse(
            localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
          )
        );
      }
    }
    temp();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const temp=async()=>{
      if (currentUser) {
        // if (currentUser.isAvatarImageSet) {
        //   const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        //   setContacts(data.data);
        // } else {
        //   navigate("/setAvatar");
        // }
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
          setContacts(data.data)

          // console.log(data.data);
          console.log("contacts")
          console.log(contacts);
      }
    }
    temp();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);
  
  return (
    <React.Fragment>
    <Header />  
<div style={{display:"flex" ,paddingTop:'70px'}}>
    <div style={{width:"30%" ,backgroundColor:"ButtonFace" }}>
            
            <Contacts contacts={contacts} changeChat={handleChatChange} />
    </div>

                                    {/* KANBAN BOARD */}
        
    <div style={{width:"50%",backgroundColor:"white" ,height:"18cm" , marginLeft:"10px"}}>
        <button type="button" onClick={handleOnClickBacklog} class="btn btn-outline-primary"style={{marginRight:"15px"}} >BACKLOG</button>
        
        <button type="button" class="btn btn-outline-secondary" onClick={handleOnClickTodo} style={{marginRight:"15 px"}} >TODO</button>

        <button type="button" onClick={handleOnClickDoing} class="btn btn-outline-success">DOING</button>
       {/* {(backlog===true)? <Backlog/>: <></>} */}
       {(doing===true)? <Doing/>: <></>}
       {(todo===true)? <Todo/>: <></>}
        {/* <Body /> */}

    </div>

                                      {/* CHAT */}

    <div style={{width:"30%",marginTop:"0%",backgroundColor:"ButtonShadow" }}>
           

           {/* <Chat /> */}
           <div className="container">
          {/* <Contacts contacts={contacts} changeChat={handleChatChange} /> */}
          {currentChat === undefined ? (
            <Welcome />
          ) : (
             <ChatContainer currentChat={currentChat} socket={socket} /> 
          )}
          
        </div>
    </div>
</div>
</React.Fragment>
  )
}

export default Homepage;