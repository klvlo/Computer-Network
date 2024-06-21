const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;
const uploadDir = path.join(__dirname, 'uploads');

// 정적 파일 제공을 위한 middleware 설정
app.use(express.static(path.join(__dirname, 'public')));

// 디렉토리가 없으면 생성
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log('업로드 디렉토리 생성:', uploadDir);
}

// 소켓 연결 설정
io.on('connection', (socket) => {
    console.log('새로운 사용자가 접속했습니다.');

    // 채팅 메시지 수신
    socket.on('chat message', (data) => {
        io.emit('chat message', data); // 모든 클라이언트에게 메시지 전송
    });

    // 파일 수신 및 저장
    socket.on('file', (data) => {
        const { nickname, filename, filesize, filetype, data: fileData } = data;
        const filePath = path.join(uploadDir, filename);

        fs.writeFile(filePath, Buffer.from(fileData.split(';base64,').pop(), 'base64'), (err) => {
            if (err) {
                console.error(`${filename} 파일 저장 오류:`, err);
                return;
            }
            console.log(`${filename} 파일 저장 완료`);

            const fileUrl = `/download/${filename}`;
            io.emit('file', { nickname, filename, filesize, filetype, data: fileUrl }); // 모든 클라이언트에게 파일 링크 전송
        });
    });
});

// 파일 다운로드 처리
app.get('/download/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).send('파일을 찾을 수 없습니다.');
    }
});

// 서버 시작
server.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
