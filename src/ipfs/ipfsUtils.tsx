import ipfs from "./ipfsClient";
import fs from "fs";

// -IPFS에 파일 업로드
export const addIPFS = async (fileName: fs.PathOrFileDescriptor): Promise<{ cid: string, url: string } | null> => {
    try {
        // 파일을 Buffer 형식으로 읽기
        const fileContent: Buffer = fs.readFileSync(fileName);

        // IPFS에 추가
        const { cid } = await ipfs.add({ content: fileContent });

        // IPFS 게이트웨이 URL 생성
        const ipfsGatewayURL = `https://ipfs.io/ipfs/${cid.toString()}`;

        console.log("Added file CID:", cid.toString()); // CID: IPFS에서 파일의 고유 해시값
        console.log("IPFS Gateway URL:", ipfsGatewayURL); // 파일 접근 경로

        return { cid: cid.toString(), url: ipfsGatewayURL };
    } catch (error) {
        console.error("IPFS upload failed:", error);
        return null;
    }
};

// CID를 사용하여 IPFS에서 파일을 가져오기기
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

        console.log("Retrieved file content:");
        console.log(fileContent);
        console.log("File can be accessed at:", `https://ipfs.io/ipfs/${cid}`);
    } catch (error) {
        console.error("Error retrieving file from IPFS:", error);
    }
};
