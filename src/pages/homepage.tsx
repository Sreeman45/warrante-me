import { FC, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { name } from "../App";
import { firebaseapp } from "../utils/utils";

const auth = getAuth(firebaseapp);

const Homepage: FC = () => {
  const navigate = useNavigate();
  const [colour, setColor] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [spinner, setSpinner] = useState<boolean>(false);
  const context = useContext(name);

  if (!context) {
    return <div>Context is not available!</div>;
  }

  const { nikname, setNickname } = context;

  useEffect(() => {
    const draft: string | null = localStorage.getItem("draft");
    if (draft) {
      setText(draft);
    }
    const accessToken = localStorage.getItem("googleAccessToken");

if (!accessToken) {
  alert("Google sign-in required. Please sign in again.");
  return;
}
  }, []);

  useEffect(() => {
    const userNickname =
      auth?.currentUser?.displayName || localStorage.getItem("nickname");
    setNickname(userNickname);

    if (!userNickname) {
      navigate("/signup");
    }
  }, [nikname]);


 
  

  const uploadToDrive = async (textContent: string) => {
    let accessToken = localStorage.getItem("googleAccessToken");
  
    if (!accessToken) {
      alert("❌ Google sign-in required. Please sign in again.");
      return;
    }
  
    console.log("🛠️ Using access token:", accessToken);
  
    try {
      
      const query = encodeURIComponent(
        "name='Letters' and mimeType='application/vnd.google-apps.folder' and trashed=false"
      );
      
      const folderResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${query}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
  
      const folderData = await folderResponse.json();
      if (folderData.error) {
        throw new Error(folderData.error.message);
      }
  
      let folderId = folderData.files?.[0]?.id;
      
   
      if (!folderId) {
        const createFolderResponse = await fetch(
          "https://www.googleapis.com/drive/v3/files",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: "Letters",
              mimeType: "application/vnd.google-apps.folder",
            }),
          }
        );
  
        const newFolder = await createFolderResponse.json();
        if (newFolder.error) {
          throw new Error(newFolder.error.message);
        }
        folderId = newFolder.id;
      }
  
 
      const metadata = {
        name: `Letter_${new Date().toISOString().split("T")[0]}`,
        mimeType: "application/vnd.google-apps.document",
        parents: [folderId],
      };
  
      const formData = new FormData();
      formData.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );
      formData.append(
        "file",
        new Blob([`<p>${textContent.replace(/\n/g, "<br>")}</p>`], {
          type: "text/html",
        })
      );
  
      const response = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: formData,
        }
      );
  
      const result = await response.json();
      if (result.id) {
        setSpinner(false)
        const fileLink = `https://drive.google.com/file/d/${result.id}/view`;
        alert("✅ Letter saved successfully in Google Drive!"+fileLink);
      } else {
        throw new Error("Failed to save letter.");
      }
    } catch (error) {
      console.error("❌ Error saving document:", error);
      alert("Error: " + error);
    }
  };
  
  const bold = () => {
    setIsBold((prev) => !prev);
  };

  const italic = () => {
    setIsItalic((prev) => !prev);
  };

  const none = () => {
    setIsBold(false);
    setIsItalic(false);
  };

  return (
    <>
      <header className="flex px-2 py-4 justify-end md:mx-12 mx-4">
        <button
          className="font-[poppins] text-xl md:text-2xl text-blue-600 font-bold border-[1.5px] border-gray-500 px-2 py-1 rounded cursor-pointer "
          onClick={() => {
            signOut(auth);
            localStorage.removeItem("nickname");
            setNickname(null);
            navigate("/signup");
          }}
        >
          Signout
        </button>
      </header>

      <main className="w-full flex justify-center items-center">
        <div className="flex flex-col leading-4 w-auto items-center">
          <div className="flex justify-between w-full">
            <div className="self-center font-semibold text-lg text-stone-700">
              {nikname}
            </div>
            <div className="flex justify-center items-center gap-2">
              <h3
                className="p-1 cursor-pointer text-2xl font-bold shadow-2xl shadow-gray-700"
                onClick={bold}
              >
                B
              </h3>
              <h3 className="p-1 cursor-pointer text-2xl font-bold shadow-2xl" onClick={italic}>
                <i>I</i>
              </h3>
              <h3 className="p-1 cursor-pointer text-2xl shadow-2xl" onClick={none}>
                none
              </h3>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your letter/text here..."
            onFocus={() => setColor("border-blue-500 border-2")}
            className={`${isBold ? "font-bold" : ""} ${isItalic ? "italic" : ""} scroll h-[50vh] md:h-[50vh] w-[80vw] md:w-[60vw] xl:w-[50vw] border-2 text-stone-900 active:border-2 border-gray-600 font-[poppins] text-lg ${colour}`}
          />

          <div className="w-full gap-2 flex justify-end mt-2">
            <button
              className="bg-blue-500 hover:bg-blue-400 cursor-pointer text-lg md:text-xl font-semibold text-white px-2 py-1 rounded-2xl"
              onClick={() => {
                localStorage.setItem("draft", text);
                alert("Draft saved");
              }}
            >
              Save Draft
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-400 cursor-pointer text-lg md:text-xl font-semibold text-white px-2 py-1 rounded-2xl"
              onClick={() => {
                uploadToDrive(text);
                setSpinner(true);
              }}
            >
              {spinner ? <span> ... </span> : "Save to Drive"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Homepage;
