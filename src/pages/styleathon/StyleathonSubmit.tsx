import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ImagePlus,
  Loader2,
  Save,
  Upload,
  X,
} from "lucide-react";
import PublicLayout from "@/components/public/PublicLayout";
import SEOHead from "@/components/public/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const StyleathonSubmit = () => {
  const [projectTitle, setProjectTitle] = useState("");
  const [conceptStatement, setConceptStatement] = useState("");
  const [numberOfLooks, setNumberOfLooks] = useState("");
  const [materials, setMaterials] = useState<string[]>([]);
  const [techniques, setTechniques] = useState<string[]>([]);
  const [materialInput, setMaterialInput] = useState("");
  const [techniqueInput, setTechniqueInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const wordCount = conceptStatement.trim().split(/\s+/).filter(Boolean).length;

  const handleAddMaterial = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && materialInput.trim()) {
      e.preventDefault();
      if (!materials.includes(materialInput.trim())) {
        setMaterials([...materials, materialInput.trim()]);
      }
      setMaterialInput("");
    }
  };

  const handleAddTechnique = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && techniqueInput.trim()) {
      e.preventDefault();
      if (!techniques.includes(techniqueInput.trim())) {
        setTechniques([...techniques, techniqueInput.trim()]);
      }
      setTechniqueInput("");
    }
  };

  const handleRemoveMaterial = (material: string) => {
    setMaterials(materials.filter((m) => m !== material));
  };

  const handleRemoveTechnique = (technique: string) => {
    setTechniques(techniques.filter((t) => t !== technique));
  };

  // Simulate image upload
  const handleImageUpload = () => {
    const placeholderImages = [
      "https://images.unsplash.com/photo-1558171813-01ed3d751c2c?w=400&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    ];
    if (images.length < 10) {
      const nextImage = placeholderImages[images.length % placeholderImages.length];
      setImages([...images, nextImage]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  const completedSections = [
    projectTitle.length > 0,
    images.length >= 6,
    conceptStatement.length > 0 && wordCount <= 300,
    numberOfLooks !== "",
    materials.length > 0,
    techniques.length > 0,
  ].filter(Boolean).length;

  return (
    <PublicLayout>
      <SEOHead
        title="Submit Project - Styleathon 01 | Adorzia"
        description="Submit your thesis collection to Styleathon 01"
      />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  to="/styleathon/01"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Overview</span>
                </Link>
                {projectTitle && (
                  <>
                    <span className="text-muted-foreground">/</span>
                    <span className="font-medium text-foreground truncate max-w-[200px]">
                      {projectTitle}
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-4">
                {/* Auto-save indicator */}
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="hidden sm:inline">Auto-saved</span>
                    </>
                  )}
                </div>
                {/* Progress */}
                <div className="hidden md:flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">{completedSections}/6 sections</span>
                  <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${(completedSections / 6) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Submit Your Project
              </h1>
              <p className="text-muted-foreground mb-12">
                Styleathon 01 — Graduation Thesis Edition
              </p>

              <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>
                {/* Project Title */}
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-base font-medium">
                    Project Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter your collection name"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className="h-14 text-lg"
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">
                      Collection Images
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {images.length}/10 images
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground -mt-2">
                    Upload 6-10 high-resolution images of your collection
                  </p>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted group"
                      >
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {index === 0 && (
                          <div className="absolute top-2 left-2">
                            <Badge variant="secondary" className="text-xs">
                              Cover
                            </Badge>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-foreground/80 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {images.length < 10 && (
                      <button
                        type="button"
                        onClick={handleImageUpload}
                        className="aspect-[3/4] rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
                      >
                        <ImagePlus className="w-6 h-6" />
                        <span className="text-xs">Add Image</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Concept Statement */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="concept" className="text-base font-medium">
                      Concept Statement
                    </Label>
                    <span
                      className={`text-sm ${
                        wordCount > 300 ? "text-destructive" : "text-muted-foreground"
                      }`}
                    >
                      {wordCount}/300 words
                    </span>
                  </div>
                  <Textarea
                    id="concept"
                    placeholder="Describe your collection's inspiration, narrative, and design philosophy..."
                    value={conceptStatement}
                    onChange={(e) => setConceptStatement(e.target.value)}
                    className="min-h-[200px] text-base leading-relaxed resize-none"
                  />
                </div>

                {/* Collection Details */}
                <div className="space-y-6 p-8 bg-muted/30 rounded-2xl border border-border">
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    Collection Details
                  </h3>

                  {/* Number of Looks */}
                  <div className="space-y-3">
                    <Label htmlFor="looks" className="text-base font-medium">
                      Number of Looks
                    </Label>
                    <Select value={numberOfLooks} onValueChange={setNumberOfLooks}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select number of looks" />
                      </SelectTrigger>
                      <SelectContent>
                        {[4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} looks
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Materials */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Key Materials</Label>
                    <Input
                      placeholder="Type a material and press Enter"
                      value={materialInput}
                      onChange={(e) => setMaterialInput(e.target.value)}
                      onKeyDown={handleAddMaterial}
                      className="h-12"
                    />
                    {materials.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {materials.map((material) => (
                          <Badge
                            key={material}
                            variant="secondary"
                            className="px-3 py-1.5 text-sm cursor-pointer hover:bg-destructive/20"
                            onClick={() => handleRemoveMaterial(material)}
                          >
                            {material}
                            <X className="w-3 h-3 ml-2" />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Techniques */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Techniques Used</Label>
                    <Input
                      placeholder="Type a technique and press Enter"
                      value={techniqueInput}
                      onChange={(e) => setTechniqueInput(e.target.value)}
                      onKeyDown={handleAddTechnique}
                      className="h-12"
                    />
                    {techniques.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {techniques.map((technique) => (
                          <Badge
                            key={technique}
                            variant="secondary"
                            className="px-3 py-1.5 text-sm cursor-pointer hover:bg-destructive/20"
                            onClick={() => handleRemoveTechnique(technique)}
                          >
                            {technique}
                            <X className="w-3 h-3 ml-2" />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="flex-1 h-14"
                    onClick={handleSave}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Preview Submission
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1 h-14"
                    disabled={completedSections < 6}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Submit Project
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default StyleathonSubmit;
