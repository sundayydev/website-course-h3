import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { AlertCircle, Upload, X, Image as ImageIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ImageUploadField = ({ value, onChange, id }) => {
  const [preview, setPreview] = useState(value || null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // Thêm state để lưu file gốc
  const fileInputRef = useRef(null);

  // Handle URL input change
  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    onChange(newUrl);
    setPreview(newUrl);
    setSelectedFile(null); // Reset file khi dùng URL
    setError(null);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  // Process the selected file
  const handleFile = (file) => {
    // Check file type
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
      setError("Chỉ chấp nhận file hình ảnh (JPEG, PNG, GIF, WEBP)");
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Kích thước file phải nhỏ hơn 5MB");
      return;
    }

    setError(null);
    setSelectedFile(file); // Lưu file gốc

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      setPreview(imageUrl);
      onChange(file); // Trả về file gốc thay vì URL preview
    };
    reader.readAsDataURL(file);
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Trigger file input click
  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  // Remove image
  const removeImage = () => {
    setPreview(null);
    setSelectedFile(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid w-full gap-2">
        <Label htmlFor="urlImage">URL Hình ảnh</Label>
        <Input
          id="urlImage"
          name="urlImage"
          placeholder="https://example.com/image.jpg"
          value={typeof value === 'string' ? value : ""} // Chỉ hiển thị nếu là URL string
          onChange={handleUrlChange}
        />
      </div>

      <div className="my-3">
        <Label>Hoặc tải lên file</Label>
        <div
          className={`mt-2 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-all ${
            dragActive 
              ? "border-blue-500 bg-blue-50" 
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            id="fileInput"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          
          <div className="flex flex-col items-center justify-center space-y-3">
            <Upload className="h-10 w-10 text-gray-400" />
            <div className="text-center">
              <p className="text-base font-medium">
                Kéo thả hình ảnh vào đây hoặc
              </p>
              <p className="text-sm text-gray-500">
                PNG, JPG, GIF tối đa 5MB
              </p>
            </div>
            <Button 
              type="button"
              variant="outline" 
              onClick={onButtonClick}
            >
              Chọn file
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {preview && (
        <Card className="relative overflow-hidden">
          <div className="absolute top-2 right-2 z-10">
            <Button 
              variant="destructive" 
              size="icon" 
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-center p-4">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 object-contain"
              onError={() => {
                setError("Không thể tải hình ảnh. Kiểm tra lại URL hoặc thử lại.");
                setPreview(null);
                setSelectedFile(null);
                onChange("");
              }}
            />
          </div>
        </Card>
      )}
      
      {!preview && (
        <div className="flex justify-center p-6 border rounded-lg bg-gray-50">
          <div className="flex flex-col items-center text-gray-400">
            <ImageIcon className="h-16 w-16 mb-2" />
            <p>Chưa có hình ảnh</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;