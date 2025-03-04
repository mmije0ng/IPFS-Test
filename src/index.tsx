import { create } from "ipfs-http-client";
import fs from "fs";

// IPFS 클라이언트 생성
const ipfs = create({ url: "http://127.0.0.1:5001" });

// 파일을 IPFS에 추가하는 함수
async function addIPFS(): Promise<string | null> {
    try {
        // 파일 내용을 읽어 Buffer로 변환
        const fileContent: Buffer = fs.readFileSync("src/test.txt");

        // IPFS에 추가
        const { cid } = await ipfs.add({ content: fileContent });

        console.log("Added file CID:", cid.toString());

        // CID 반환
        return cid.toString();
    } catch (error) {
        console.error("IPFS upload failed:", error);
        return null;
    }
}

// CID를 사용하여 IPFS에서 파일을 가져오는 함수
async function getFile(cid: string): Promise<void> {
    try {
        if (!cid) {
            console.error("No CID provided for retrieval.");
            return;
        }

        const fileBuffer: Uint8Array[] = [];
        for await (const chunk of ipfs.cat(cid)) {
            fileBuffer.push(chunk);
        }

        // Uint8Array[] -> Buffer 변환 후 문자열로 출력
        const fileContent = Buffer.concat(fileBuffer).toString();
        console.log("File content:", fileContent);
    } catch (error) {
        console.error("Error retrieving file from IPFS:", error);
    }
}

// 실행
(async () => {
    const cid: string | null = await addIPFS(); // 파일을 추가하고 CID를 얻음
    if (cid) {
        await getFile(cid); // 해당 CID로 파일을 다운로드
    }
})();
