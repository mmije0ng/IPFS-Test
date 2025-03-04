import { checkNode } from "./ipfs/checkNode";
import { addIPFS, getFile, getFileFromURL } from "./ipfs/ipfsUtils";

(async () => {
    // await checkNode(); // IPFS 노드 확인

    const result = await addIPFS("src/test.txt");
    // CID를 통해 파일 찾기
    if (result?.cid) {
        await getFile(result.cid); 
    }
})();


(async () => {
    // URL을 통해 파일 찾기
    await getFileFromURL("https://ipfs.io/ipfs/QmbrCxFnp3jrCpZhT8pyLjhYeRXVdocc38xNJrGK2xWDRd");
})();