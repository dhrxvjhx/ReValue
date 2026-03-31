import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();

export const uploadProofImage = async (file, pickupId) => {
    const storageRef = ref(storage, `proofs/${pickupId}`);

    await uploadBytes(storageRef, file);

    const url = await getDownloadURL(storageRef);

    return url;
};