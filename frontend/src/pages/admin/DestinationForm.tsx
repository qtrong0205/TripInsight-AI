import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X, Link as LinkIcon, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';

type ImageSource = 'upload' | 'url';

interface ImageItem {
    id: string;
    url: string;
    source: ImageSource;
    name?: string;
}

export default function DestinationForm() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');
    const [featured, setFeatured] = useState(false);
    const [images, setImages] = useState<ImageItem[]>([]);
    const [imageInputMethod, setImageInputMethod] = useState<'upload' | 'url'>('upload');
    const [imageUrl, setImageUrl] = useState('');
    const [urlError, setUrlError] = useState('');

    const MAX_IMAGES = 3;
    const isMaxImagesReached = images.length >= MAX_IMAGES;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || isMaxImagesReached) return;

        const remainingSlots = MAX_IMAGES - images.length;
        const filesToAdd = Array.from(files).slice(0, remainingSlots);

        const newImages: ImageItem[] = filesToAdd.map((file) => ({
            id: `upload-${Date.now()}-${Math.random()}`,
            url: URL.createObjectURL(file),
            source: 'upload' as ImageSource,
            name: file.name,
        }));

        setImages([...images, ...newImages]);
        e.target.value = ''; // Reset input
    };

    const handleAddImageUrl = () => {
        setUrlError('');

        if (!imageUrl.trim()) {
            setUrlError('Please enter an image URL');
            return;
        }

        // Basic URL format validation (accepts any valid URL)
        try {
            new URL(imageUrl);
        } catch {
            setUrlError('Please enter a valid URL format');
            return;
        }

        if (isMaxImagesReached) {
            setUrlError('Maximum of 3 images reached');
            return;
        }

        const newImage: ImageItem = {
            id: `url-${Date.now()}`,
            url: imageUrl,
            source: 'url',
        };

        setImages([...images, newImage]);
        setImageUrl('');
    };

    const removeImage = (id: string) => {
        setImages(images.filter((img) => img.id !== id));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddImageUrl();
        }
    };

    return (
        <div className="pt-20 md:pt-2 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4 mb-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/admin/dashboard')}
                            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2} />
                            Back
                        </Button>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Add New Destination</h1>
                    <p className="text-gray-500 mt-1">Fill in the details to create a new destination</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <Card className="bg-white border-gray-200">
                            <CardHeader className="border-b border-gray-100 px-6 py-4">
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Basic Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-gray-700 font-medium">
                                        Destination Name *
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="e.g., Bali Paradise Resort"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="bg-gray-50 border-gray-200 h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location" className="text-gray-700 font-medium">
                                        Location *
                                    </Label>
                                    <Input
                                        id="location"
                                        type="text"
                                        placeholder="e.g., Bali, Indonesia"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="bg-gray-50 border-gray-200 h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-gray-700 font-medium">
                                        Description *
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe the destination, attractions, and what makes it special..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="bg-gray-50 border-gray-200 min-h-32 resize-none"
                                    />
                                    <p className="text-xs text-gray-500">
                                        {description.length} / 500 characters
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Image Upload - Redesigned */}
                        <Card className="bg-white border-gray-200">
                            <CardHeader className="border-b border-gray-100 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg font-semibold text-gray-900">
                                            Destination Images
                                        </CardTitle>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Add up to 3 images. Supported formats: JPG, PNG, WebP
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-gray-500">Images:</span>
                                        <span className={`font-semibold ${isMaxImagesReached ? 'text-amber-600' : 'text-blue-600'}`}>
                                            {images.length} / {MAX_IMAGES}
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                {/* Tab Switch */}
                                <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg w-fit">
                                    <button
                                        onClick={() => setImageInputMethod('upload')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${imageInputMethod === 'upload'
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        <Upload className="w-4 h-4" strokeWidth={2} />
                                        Upload Image
                                    </button>
                                    <button
                                        onClick={() => setImageInputMethod('url')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${imageInputMethod === 'url'
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        <LinkIcon className="w-4 h-4" strokeWidth={2} />
                                        Image URL
                                    </button>
                                </div>

                                {/* Upload Method */}
                                {imageInputMethod === 'upload' && (
                                    <div>
                                        <div
                                            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isMaxImagesReached
                                                ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                                                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer'
                                                }`}
                                        >
                                            <input
                                                type="file"
                                                id="image-upload"
                                                multiple
                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                onChange={handleImageUpload}
                                                disabled={isMaxImagesReached}
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor="image-upload"
                                                className={isMaxImagesReached ? 'cursor-not-allowed' : 'cursor-pointer'}
                                            >
                                                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isMaxImagesReached ? 'bg-gray-200' : 'bg-blue-100'
                                                    }`}>
                                                    <Upload className={`w-6 h-6 ${isMaxImagesReached ? 'text-gray-400' : 'text-blue-600'}`} strokeWidth={2} />
                                                </div>
                                                <p className={`font-medium mb-1 ${isMaxImagesReached ? 'text-gray-400' : 'text-gray-700'}`}>
                                                    {isMaxImagesReached ? 'Maximum images reached' : 'Click to upload or drag and drop'}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {isMaxImagesReached ? 'Remove an image to add more' : 'JPG, PNG or WebP (max. 5MB each)'}
                                                </p>
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {/* URL Method */}
                                {imageInputMethod === 'url' && (
                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <div className="flex-1">
                                                <Input
                                                    type="url"
                                                    placeholder="https://example.com/image.jpg"
                                                    value={imageUrl}
                                                    onChange={(e) => {
                                                        setImageUrl(e.target.value);
                                                        setUrlError('');
                                                    }}
                                                    onKeyPress={handleKeyPress}
                                                    disabled={isMaxImagesReached}
                                                    className={`bg-gray-50 border-gray-200 h-11 ${urlError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                                                        }`}
                                                />
                                                {urlError && (
                                                    <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
                                                        <AlertCircle className="w-4 h-4" strokeWidth={2} />
                                                        <span>{urlError}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <Button
                                                onClick={handleAddImageUrl}
                                                disabled={isMaxImagesReached || !imageUrl.trim()}
                                                className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-6"
                                            >
                                                Add Image
                                            </Button>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Paste any valid image URL (supports CDN links like Unsplash, Cloudinary, etc.)
                                        </p>
                                    </div>
                                )}

                                {/* Max Images Warning */}
                                {isMaxImagesReached && (
                                    <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" strokeWidth={2} />
                                        <p className="text-sm text-amber-800">
                                            <strong className="font-semibold">Maximum of 3 images reached.</strong> Remove an image to add more.
                                        </p>
                                    </div>
                                )}

                                {/* Image Previews */}
                                {images.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-medium text-gray-700">Added Images</h4>
                                            <span className="text-xs text-gray-500">
                                                {images.length === 1 && 'First image will be the primary'}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            {images.map((image, index) => (
                                                <div
                                                    key={image.id}
                                                    className="relative group bg-gray-50 rounded-lg border-2 border-gray-200 overflow-hidden"
                                                >
                                                    {/* Image Preview */}
                                                    <div className="aspect-square relative">
                                                        <img
                                                            src={image.url}
                                                            alt={`Preview ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                // Visual fallback for broken/invalid images
                                                                const target = e.currentTarget;
                                                                target.style.display = 'none';
                                                                const parent = target.parentElement;
                                                                if (parent && !parent.querySelector('.error-overlay')) {
                                                                    const errorDiv = document.createElement('div');
                                                                    errorDiv.className = 'error-overlay absolute inset-0 flex flex-col items-center justify-center bg-red-50 text-red-600 p-4';
                                                                    errorDiv.innerHTML = `
                                    <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <p class="text-xs font-medium text-center">Failed to load image</p>
                                    <p class="text-xs text-center mt-1 opacity-75">Invalid URL or image unavailable</p>
                                  `;
                                                                    parent.appendChild(errorDiv);
                                                                }
                                                            }}
                                                        />
                                                        {/* Primary Badge */}
                                                        {index === 0 && (
                                                            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded shadow-sm">
                                                                Primary
                                                            </div>
                                                        )}
                                                        {/* Remove Button */}
                                                        <button
                                                            onClick={() => removeImage(image.id)}
                                                            className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                                                        >
                                                            <X className="w-4 h-4 text-red-600" strokeWidth={2} />
                                                        </button>
                                                    </div>
                                                    {/* Source Label */}
                                                    <div className="px-2 py-1.5 bg-white border-t border-gray-200">
                                                        <div className="flex items-center gap-1.5">
                                                            {image.source === 'upload' ? (
                                                                <>
                                                                    <Upload className="w-3.5 h-3.5 text-gray-500" strokeWidth={2} />
                                                                    <span className="text-xs text-gray-600 truncate">
                                                                        {image.name || 'Uploaded'}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <LinkIcon className="w-3.5 h-3.5 text-gray-500" strokeWidth={2} />
                                                                    <span className="text-xs text-gray-600 truncate">From URL</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Empty State */}
                                {images.length === 0 && (
                                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                                        <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
                                        <p className="text-sm text-gray-500">No images added yet</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {imageInputMethod === 'upload'
                                                ? 'Upload files or switch to URL input'
                                                : 'Add any valid image URL (CDN links supported)'}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Publish Settings */}
                        <Card className="bg-white border-gray-200">
                            <CardHeader className="border-b border-gray-100 px-6 py-4">
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Publish Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">Featured Destination</p>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            Show on homepage
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setFeatured(!featured)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${featured ? 'bg-blue-600' : 'bg-gray-200'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${featured ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <Label className="text-gray-700 font-medium mb-2 block">Status</Label>
                                    <select className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option>Active</option>
                                        <option>Archived</option>
                                    </select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Categories */}
                        <Card className="bg-white border-gray-200">
                            <CardHeader className="border-b border-gray-100 px-6 py-4">
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Categories
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-3">
                                    {['Beach', 'Mountain', 'City', 'Cultural', 'Adventure', 'Nature'].map((category) => (
                                        <label key={category} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                            />
                                            <span className="text-gray-700 group-hover:text-gray-900">{category}</span>
                                        </label>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 shadow-sm">
                                Publish Destination
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => navigate('/admin/destinations')}
                                className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-11"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
