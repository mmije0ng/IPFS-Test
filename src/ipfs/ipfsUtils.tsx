import ipfs from "./ipfsClient";
import fs from "fs";

// IPFS에 파일 업로드
// 실제 구현시에는 Es(bj, kbj)를 업로드 (kbj로 암호화된 sw 업데이트 바이너리 파일)
export const addIPFS = async (fileName: fs.PathOrFileDescriptor): Promise<{ cid: string, url: string } | null> => {
    try {
        // 파일을 버퍼 형식으로 읽기
        const fileContent: Buffer = fs.readFileSync(fileName);

        // IPFS 노드에 추가
        // CID: 콘텐츠를 기반으로 생성된 고유한 해시값, IPFS에서 해당 파일을 식별하는 키 역할
        const { cid } = await ipfs.add({ content: fileContent });

        // IPFS 게이트웨이 URL 생성
        // um의 UID에 포함됨
        const ipfsGatewayURL = `https://ipfs.io/ipfs/${cid.toString()}`;

        console.log("Added file CID:", cid.toString()); // CID: IPFS에서 파일의 고유 해시값
        console.log("IPFS Gateway URL:", ipfsGatewayURL); // 파일 접근 경로

        return { cid: cid.toString(), url: ipfsGatewayURL };
    } catch (error) {
        console.error("IPFS upload failed:", error);
        return null;
    }
};

// CID를 사용하여 IPFS에서 파일을 가져오기
export const getFile = async (cid: string): Promise<void> => {
    try {
        if (!cid) {
            console.error("No CID provided for retrieval.");
            return;
        }

        const fileBuffer: Uint8Array[] = [];
        for await (const chunk of ipfs.cat(cid)) {
            fileBuffer.push(chunk);
        }

        // Uint8Array[] -> Buffer 변환 후 출력
        const fileContent = Buffer.concat(fileBuffer).toString();

        console.log("--- Retrieved file content:");
        console.log(fileContent);
    } catch (error) {
        console.error("Error retrieving file from IPFS:", error);
    }
};

// URL을 사용하여 IPFS 게이트웨이에서 파일 가져오기
// IoT 소유자가 IPFS 노드를 실행하지 않아도 URL을 통해 (실제로는 암호화된)파일 다운
export const getFileFromURL = async (url: string): Promise<void> => {
    try {
        if (!url) {
            console.error("No URL provided for retrieval.");
            return;
        }

        // fetch를 사용하여 파일 다운로드
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch file from URL. Status: ${response.status}`);
        }

        const fileContent = await response.text(); // 파일을 텍스트로 변환

        console.log("--- Retrieved file content from URL:");
        console.log(fileContent);
    } catch (error) {
        console.error("Error retrieving file from IPFS gateway:", error);
    }
};
