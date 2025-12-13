import { IKContext, IKUpload } from "imagekitio-react";
import axios from "axios";
import axiosInstance from "../api/axiosApi";

const ImageUpload = () => {
  const authenticator = async () => {
    const res = await axiosInstance.get("/images/imagekit");
    return res.data;
  };

  return (
    <IKContext
      publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <IKUpload
        fileName="profile.jpg"
        folder="/profiles"
        onSuccess={(res) => console.log("Uploaded:", res)}
        onError={(err) => console.error(err)}
      />
    </IKContext>
  );
};

export default ImageUpload;
