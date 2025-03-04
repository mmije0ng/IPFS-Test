import { checkNode } from "./ipfs/checkNode";
import { addIPFS, getFile } from "./ipfs/ipfsUtils";

(async () => {
    await checkNode(); // IPFS 노드 확인

    const result = await addIPFS("src/test.txt"); // 파일을 추가하고 CID를 얻음
    if (result?.cid) {
        await getFile(result.cid); // 🔹 getFile에 string 값만 전달
    }
})();
