"use client";

import * as React from "react";
import NextImage from "next/image";

import { ImageUp, Scissors } from "lucide-react";
import Cropper, { type Area } from "react-easy-crop";

import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface EventPosterCropUploaderProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = src;
  });
}

async function getCroppedImage(imageSrc: string, pixelCrop: Area) {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  const context = canvas.getContext("2d");

  if (!context) {
    return "";
  }

  context.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL("image/jpeg", 0.92);
}

export function EventPosterCropUploader({
  value,
  onChange,
  disabled
}: EventPosterCropUploaderProps) {
  const [sourceImage, setSourceImage] = React.useState("");
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(null);

  const onCropComplete = React.useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const fileAsDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(new Error("Unable to read selected image."));
      reader.readAsDataURL(file);
    });

    setSourceImage(fileAsDataUrl);
  };

  const handleApplyCrop = async () => {
    if (!sourceImage || !croppedAreaPixels) {
      return;
    }

    try {
      const croppedImage = await getCroppedImage(sourceImage, croppedAreaPixels);

      if (croppedImage) {
        onChange(croppedImage);
        setSourceImage("");
      }
    } catch {
      // Keep UI stable if image decoding or canvas processing fails.
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="event-poster">Event Poster (16:9)</Label>
        <Input
          id="event-poster"
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleFileUpload}
          disabled={disabled}
        />
      </div>

      {sourceImage ? (
        <div className="space-y-4 rounded-xl border p-4">
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
            <Cropper
              image={sourceImage}
              crop={crop}
              zoom={zoom}
              aspect={16 / 9}
              cropShape="rect"
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="space-y-2">
            <Label>Zoom</Label>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(value) => setZoom(value[0] ?? 1)}
            />
          </div>
          <Button type="button" onClick={handleApplyCrop} className="w-full sm:w-auto">
            <Scissors className="size-4" />
            Apply 16:9 Crop
          </Button>
        </div>
      ) : null}

      {value ? (
        <div className="space-y-2">
          <Label>Poster Preview</Label>
          <div className="relative aspect-video w-full max-w-2xl overflow-hidden rounded-lg border">
            <NextImage
              src={value}
              alt="Event poster preview"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 80vw, 896px"
              unoptimized
              className="object-cover"
            />
          </div>
        </div>
      ) : (
        <div className="flex aspect-video w-full max-w-2xl items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
          <div className="flex flex-col items-center gap-2 text-center">
            <ImageUp className="size-5" />
            <p>No poster selected</p>
          </div>
        </div>
      )}
    </div>
  );
}
