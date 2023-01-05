import { useState } from "react";
import axios from "axios";
import "./FileUpload.css";
const FileUpload = ({ contract, account, provider }) => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("No image selected");
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (file) {
            try {
                const formData = new FormData();
                formData.append("file", file);

                const resFile = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                        pinata_api_key: `70ae28e822f9184da1ef`,
                        // pinata_secret_api_key: `439b374a81988788f0b648844acd649359109acc05df1b0d87c4c2f69eb86d68f`,
                        // pinata_secret_api_key: `e5f264dbe8aa78187e85d57e3a5a89f5ebd14ada6ae67ba95837989c9cf58ac3`,
                        pinata_secret_api_key: `d8d596f04f920997dcf7d4bd8d070d2143a76387f4a19edc11d8360591f74d17`,
                        "Content-Type": "multipart/form-data",
                    },
                });
                const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
                console.log(ImgHash);
                //const signer = contract.connect(provider.getSigner());
                const signer = contract.connect(provider.getSigner());
                signer.add(account, ImgHash);
            } catch (e) {
                console.log('error', e);
                alert("Unable to upload image to Pinata");
            }
        }
        alert("Successfully Image Uploaded");
        setFileName("No image selected");
        setFile(null);
    };
    const retrieveFile = (e) => {
        const data = e.target.files[0]; //files array of files object
        // console.log(data);
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(data);
        reader.onloadend = () => {
            setFile(e.target.files[0]);
        };
        setFileName(e.target.files[0].name);
        e.preventDefault();
    };
    return (
        <div className="top">
            <form className="form" onSubmit={handleSubmit}>
                <label htmlFor="file-upload" className="choose">
                    Choose Image
                </label>
                <input
                    disabled={!account}
                    type="file"
                    id="file-upload"
                    name="data"
                    onChange={retrieveFile}
                />
                <span className="textArea">Image: {fileName}</span>
                <button type="submit" className="upload" disabled={!file}>
                    Upload File
                </button>
            </form>
            
        </div>
    );
};
export default FileUpload;
