import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  CheckCircle2, 
  Clock, 
  FileText,
  Image as ImageIcon,
  Video,
  Box,
  Loader2,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { applyWatermark } from "@/lib/image-processing";
import type { StyleboxSubmission, DesignerFileType } from "@/types/designer-submissions";

interface Deliverable {
  id: string;
  name: string;
  description?: string;
  file_type: string;
  is_required: boolean;
}

interface DeliverablesChecklistProps {
  deliverables: Deliverable[];
  submission: StyleboxSubmission;
  darkroomMode: boolean;
  isReadOnly?: boolean;
  onRefresh: () => void;
}

export function DeliverablesChecklist({
  deliverables = [],
  submission,
  darkroomMode,
  isReadOnly = false,
  onRefresh,
}: DeliverablesChecklistProps) {
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const getFileTypeIcon = (fileType: string) => {
    const lowerType = fileType.toLowerCase();
    if (lowerType.includes('pdf') || lowerType.includes('document')) return FileText;
    if (lowerType.includes('jpg') || lowerType.includes('png') || lowerType.includes('image')) return ImageIcon;
    if (lowerType.includes('mp4') || lowerType.includes('video')) return Video;
    if (lowerType.includes('obj') || lowerType.includes('glb') || lowerType.includes('3d')) return Box;
    return FileText;
  };

  const mapFileTypeToEnum = (fileType: string): DesignerFileType => {
    const lowerType = fileType.toLowerCase();
    if (lowerType.includes('pdf')) return 'technical_pack';
    if (lowerType.includes('jpg') || lowerType.includes('png') || lowerType.includes('image')) return 'image_2d';
    if (lowerType.includes('mp4') || lowerType.includes('mov') || lowerType.includes('video')) return 'video';
    if (lowerType.includes('obj') || lowerType.includes('glb') || lowerType.includes('3d')) return 'model_3d';
    return 'document';
  };

  const getAcceptedFileTypes = (fileType: string): string => {
    const lowerType = fileType.toLowerCase();
    if (lowerType.includes('pdf')) return '.pdf';
    if (lowerType.includes('jpg') || lowerType.includes('png') || lowerType.includes('image')) return 'image/jpeg,image/png';
    if (lowerType.includes('video')) return 'video/mp4,video/quicktime';
    if (lowerType.includes('3d')) return '.obj,.glb,.gltf';
    return '*';
  };

  const handleFileUpload = async (deliverable: Deliverable, file: File) => {
    if (!user) return;

    setUploadingFile(deliverable.id);
    setUploadProgress(0);

    try {
      let fileToUpload = file;

      // Apply watermark for images
      if (file.type.startsWith('image/')) {
        setUploadProgress(10);
        fileToUpload = await applyWatermark(file, {
          text: 'ADORZIA STUDIO - DRAFT',
          opacity: 0.25,
        });
        setUploadProgress(30);
      }

      // For large files (>50MB), show chunked upload message
      const isLargeFile = file.size > 50 * 1024 * 1024;
      if (isLargeFile) {
        toast({
          title: "Large file detected",
          description: "Uploading in chunks. This may take a few minutes.",
        });
      }

      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${submission.stylebox_id}/${deliverable.id}/${fileName}`;

      setUploadProgress(50);

      const { error: uploadError } = await supabase.storage
        .from('stylebox-designer-submissions')
        .upload(filePath, fileToUpload);

      if (uploadError) throw uploadError;

      setUploadProgress(70);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('stylebox-designer-submissions')
        .getPublicUrl(filePath);

      // Create submission file record
      const { error: dbError } = await supabase
        .from('submission_files')
        .insert({
          submission_id: submission.id,
          deliverable_id: deliverable.id,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: mapFileTypeToEnum(deliverable.file_type),
          mime_type: file.type,
          status: 'uploaded',
          is_watermarked: file.type.startsWith('image/'),
          preview_url: publicUrl,
        });

      if (dbError) throw dbError;

      setUploadProgress(100);

      toast({
        title: "Upload successful",
        description: `${deliverable.name} has been uploaded.`,
      });

      onRefresh();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingFile(null);
      setUploadProgress(0);
    }
  };

  const triggerFileInput = (deliverableId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const deliverable = deliverables.find(d => d.id === deliverableId);
        if (deliverable) {
          handleFileUpload(deliverable, file);
        }
      }
    };
    input.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <h3
          className={cn(
            "text-xs font-bold uppercase tracking-widest",
            darkroomMode ? "text-white/80" : "text-gray-900"
          )}
        >
          Deliverables Checklist
        </h3>
        <p
          className={cn(
            "text-[10px] italic",
            darkroomMode ? "text-white/40" : "text-gray-500"
          )}
        >
          Complete all to activate submission
        </p>
      </div>

      <div className="space-y-3">
        {deliverables.length > 0 ? (
          deliverables.map((deliverable) => {
            const Icon = getFileTypeIcon(deliverable.file_type);
            const isUploading = uploadingFile === deliverable.id;
            const isUploaded = false; // TODO: Check if file exists in submission_files

            return (
              <div
                key={deliverable.id}
                className={cn(
                  "p-3 rounded-xl border transition-all",
                  darkroomMode
                    ? "bg-white/5 border-white/10 hover:border-white/20"
                    : "bg-white border-gray-200 hover:border-gray-300",
                  isUploaded && "bg-green-500/10 border-green-500/30"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "h-5 w-5 rounded-full border border-dashed flex-shrink-0 flex items-center justify-center mt-0.5",
                      isUploaded
                        ? "bg-green-500 border-green-500"
                        : darkroomMode
                        ? "border-white/30"
                        : "border-gray-400"
                    )}
                  >
                    {isUploaded ? (
                      <CheckCircle2 className="h-3 w-3 text-white" />
                    ) : (
                      <Clock className="h-2.5 w-2.5 text-current opacity-40" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p
                          className={cn(
                            "text-xs font-semibold",
                            darkroomMode ? "text-white/90" : "text-gray-900"
                          )}
                        >
                          {deliverable.name}
                        </p>
                        {deliverable.description && (
                          <p
                            className={cn(
                              "text-[10px] mt-0.5",
                              darkroomMode ? "text-white/50" : "text-gray-600"
                            )}
                          >
                            {deliverable.description}
                          </p>
                        )}
                      </div>
                      <Icon
                        className={cn(
                          "h-4 w-4 flex-shrink-0",
                          darkroomMode ? "text-white/40" : "text-gray-400"
                        )}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[8px] h-4 px-1.5 font-bold",
                          darkroomMode
                            ? "border-white/20 text-white/60"
                            : "border-gray-300 text-gray-600"
                        )}
                      >
                        {deliverable.file_type}
                      </Badge>
                      {deliverable.is_required && (
                        <Badge
                          variant="outline"
                          className="text-[8px] h-4 px-1.5 font-bold border-red-500/50 text-red-500"
                        >
                          Required
                        </Badge>
                      )}
                    </div>

                    {isUploading && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className={cn(darkroomMode ? "text-white/60" : "text-gray-600")}>
                            Uploading...
                          </span>
                          <span className={cn(darkroomMode ? "text-white/60" : "text-gray-600")}>
                            {uploadProgress}%
                          </span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {!isUploaded && !isUploading && !isReadOnly && (
                      <>
                        <input
                          type="file"
                          id={`file-input-${deliverable.id}`}
                          accept={getAcceptedFileTypes(deliverable.file_type)}
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Validate file size (500MB max)
                              if (file.size > 500 * 1024 * 1024) {
                                toast({
                                  title: "File too large",
                                  description: "Maximum file size is 500MB. Please compress your file.",
                                  variant: "destructive",
                                });
                                return;
                              }
                              handleFileUpload(deliverable, file);
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className={cn(
                            "w-full h-7 text-[10px] gap-1.5",
                            darkroomMode
                              ? "border-white/20 hover:bg-white/10"
                              : "border-gray-300 hover:bg-gray-100"
                          )}
                          onClick={() => triggerFileInput(deliverable.id)}
                        >
                          <Upload className="h-3 w-3" />
                          Upload File
                        </Button>
                      </>
                    )}
                    {isReadOnly && !isUploaded && (
                      <p className={cn(
                        "text-[10px] italic text-center",
                        darkroomMode ? "text-white/30" : "text-gray-400"
                      )}>
                        No file uploaded
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div
            className={cn(
              "text-center py-8 text-xs italic",
              darkroomMode ? "text-white/40" : "text-gray-500"
            )}
          >
            No deliverables configured.
          </div>
        )}
      </div>
    </div>
  );
}
