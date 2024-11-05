import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setImageFile(selectedFile);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  // Upload image to Cloudinary
  async function uploadImageToCloudinary() {
    try {
      setImageLoadingState(true);

      const data = new FormData();
      data.append("my_file", imageFile);

      const response = await axios.post(
        `${process.env.REACT_APP_UPLOAD_URL}/api/admin/products/upload-image`,
        data
      );

      if (response?.data?.success) {
        const uploadedUrl = response.data.result.url;
        setUploadedImageUrl(uploadedUrl);
        saveImageUrlToDatabase(uploadedUrl); // Save to DB after upload
      } else {
        console.error("Upload failed:", response.data);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setImageLoadingState(false);
    }
  }

  // Save image URL to the database
  async function saveImageUrlToDatabase(imageUrl) {
    try {
      const saveResponse = await axios.post(
        `${process.env.REACT_APP_UPLOAD_URL}/api/admin/products/save-image`,
        { image: imageUrl }
      );

      if (!saveResponse?.data?.success) {
        console.error("Failed to save image URL to database:", saveResponse.data);
      }
    } catch (error) {
      console.error("Error saving image URL to database:", error);
    }
  }

  useEffect(() => {
    if (imageFile) {
      uploadImageToCloudinary();
    }
  }, [imageFile]);

  return (
    <div
      className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}
    >
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60" : ""
        } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className={`${
              isEditMode ? "cursor-not-allowed" : ""
            } flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-10 bg-gray-100" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="w-8 text-primary mr-2 h-8" />
            </div>
            <p className="text-sm font-medium">{imageFile.name}</p>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
