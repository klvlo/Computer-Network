//App.js
import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
// 0. 클라이언트 소캣 생성
import io from "socket.io-client";

// React 창이 새롭게 생설될 때 마다, 클라이언트 또한 새롭게 생성됨
// 1. 서버로 소켓 conncet 요청
const socket = io.connect("http://127.0.0.1:15000");

// 2. 클라이언트에서 서버쪽으로 데이터를 전달 (데이터  송/수신 확인)
socket.emit("init", "[init] Client -> Server");

function App() {
  // State
  // chartArr = [];
  const [chatArr, setChatArr] = useState([]);
  // chat = { name: "", message: "" };
  const [chat, setChat] = useState({ name: "", message: "" });
  
  // useEffect : [deps] 컴포넌트가 랜더링 될 때마다 특정 작업을 수행하도록 함.  (function, [deps])로 구성 됨
  // [deps] 배열에 여러 컴포넌트들이 들어 있다면 해당 컴포턴트가 변경된 개수 만큼 실행
  // [deps]에 빈 배열 -> 최초 한번만 실행
  // 3. 소켓 종료
  useEffect(() => {
    return () => {
      socket.close();
    };
  }, []);



  // [수신] 서버로부터 온 메세지를 받음
  useEffect(() => {
    socket.on("receive message", (message) => {
      // chatArr 배열에 chatArr 콜백함수를 뒤에 붙여줌. (추가해줌)
      setChatArr((chatArr) => chatArr.concat(message));
    }); //receive message이벤트에 대한 콜백을 등록해줌
  }, []);



  // [요약] 한 클라이언트가 서버로 메세지를 전송하고, 해당 메세지는 서버에서 연결된 모든 클라이언트들에게 보낸다.
  // useCallback : deps가 변경될 때만 기억해둔 콜백함수를 새로 생성해서 사용 
  // 즉, 모든 렌더링 마다 만드는 것이 아니라, 함수내용을 기억해놓고 특정 조건(의존성 변경)에서만 함수를 재 생성해서 사용하도록 하는 것.

  // [송신] 서버로 메세지를 전달.
  //전송 버튼을 눌렀을 때 send message이벤트 발생
  const buttonHandler = useCallback((e) => {
    socket.emit("send message", { name: chat.name, message: chat.message }); 
  }, [chat]);

  
  // setChat으로 State를 변경
  
  // 내용이 변경될 때 -> 현재 이벤트가 발생한 객체에서의 변경되는 부분을 가지고 옴
  const changeMessage = useCallback((e) => {
    setChat({ name: chat.name, message: e.target.value });
  },[chat]);


  // 이름이 변경될 때 -> 현재 이벤트가 발생한 객체에서의 변경되는 부분을 가지고 옴
  const changeName = useCallback((e) => {
      setChat({ name: e.target.value, message: chat.message });
  },[chat]);


  return (
    <div className="App">
      <div className="Box">
      {/* 메세지 출력 창 */}
        <div className="ChatBox">
          {console.log(chatArr, "< 현재 입력된 채팅 배열 ")}
          {chatArr.map((ele) => (
            <div className="Chat">
              <div className="ChatName">[{ele.name}]</div>
              <div className="ChatLog">{ele.message}</div>
            </div>
          ))}
        </div>


        {/* 입력 창 */}
        <div className="InputBox">
          
          <input className="InputName" placeholder="이름" onChange={changeName}></input>
          <span></span>
          <input className="InputText" placeholder="내용" onChange={changeMessage}></input>
          <button onClick={buttonHandler}>등록</button>
        </div>
        
      </div>
    </div>
  );
}
export default App;