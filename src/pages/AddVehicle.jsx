import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Car, Bike, X, Package } from 'lucide-react';
import { partService } from '../services/partService';
import { CAR_BRANDS, BIKE_BRANDS, FUEL_TYPES, TRANSMISSION_TYPES, OWNERSHIP_TYPES, PARTS_CATEGORIES } from '../utils/constants';

const AddVehicle = () => {
  const [formData, setFormData] = useState({
    type: 'car',
    brand: '',
    model: '',
    partscategories:'',
    year: new Date().getFullYear(),
    price: '',
    quantity: 1,
    // kilometersDriven: '',
    // mileage: '',
    description: '',
    fuelType: 'Petrol',
    transmission: 'Manual',
    // ownership: '1st Owner',
    location: { city: '', state: '' },
    features: [],
    lat: '',
    lng: ''
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData();

      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'location') {
          data.append('location', JSON.stringify(formData.location));
        } else if (key === 'features') {
          data.append('features', JSON.stringify(formData.features));
        } else {
          data.append(key, formData[key]);
        }
      });

      // Append images
      images.forEach(image => {
        data.append('images', image);
      });

      await partService.addPart(data);
      navigate('/my-listings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add part');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 5 - images.length;
    const filesToAdd = files.slice(0, remainingSlots);

    setImages([...images, ...filesToAdd]);

    // Create previews
    filesToAdd.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    if (featureInput.trim() && formData.features.length < 10) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const brands = formData.type === 'car' ? CAR_BRANDS : BIKE_BRANDS;

  const inField = 'cro-input';
  const selField = 'cro-input cursor-pointer';

  return (
    <div className="cro-page">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-olx-dark sm:text-4xl text-balance">
            List a part for sale
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-olx-muted leading-relaxed">
            Clear photos and accurate fitment details help buyers find compatible parts quickly.
          </p>
        </div>

        <div className="cro-card-xl">
          {error && <div className="cro-alert-error mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vehicle Type */}
            <div>
              <label className="block text-olx-dark font-bold text-sm mb-3">Vehicle type *</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'car', brand: '' })}
                  className={`py-4 rounded-lg border-2 transition flex items-center justify-center gap-3 ${
                    formData.type === 'car'
                      ? 'bg-olx-dark border-olx-dark text-white'
                      : 'bg-olx-bg border-olx-border text-olx-muted hover:border-olx-dark'
                  }`}
                >
                  <Car className="w-6 h-6" />
                  <span className="font-bold">Car</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'bike', brand: '' })}
                  className={`py-4 rounded-lg border-2 transition flex items-center justify-center gap-3 ${
                    formData.type === 'bike'
                      ? 'bg-olx-dark border-olx-dark text-white'
                      : 'bg-olx-bg border-olx-border text-olx-muted hover:border-olx-dark'
                  }`}
                >
                  <Bike className="w-6 h-6" />
                  <span className="font-bold">Bike</span>
                </button>
              </div>
            </div>



                



            {/* Brand & Model */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-olx-dark font-semibold text-sm mb-2">Brand *</label>
                <select
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className={selField}
                >
                  <option value="">Select brand</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand} className="text-black bg-white">
                      {brand}
                    </option>
                  ))}
                </select>

              </div>

              <div>
                <label className="block text-olx-dark font-semibold text-sm mb-2">Model *</label>
                <input
                  type="text"
                  required
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className={inField}
                  placeholder="e.g., Swift, City, Classic 350"
                />
              </div>
            </div>



              {/* ***************** */}

                   {/* PARTS CATEGORY  */}
            <div>
              <label className="block text-olx-dark font-semibold text-sm mb-2">Parts Category*</label>
              <select
                required
                value={formData.partscategories}
                onChange={(e) => setFormData({ ...formData, partscategories: e.target.value })}
                className={selField}
              >
                 <option value="">Select Parts Category</option>
                {PARTS_CATEGORIES.map(type => (
                  <option key={type} value={type} className="text-black bg-white">
                    {type}
                  </option>
                ))}
              </select>
            </div>


                  {/* ***************** */}


            {/* Year, Price & Quantity */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-olx-dark font-semibold text-sm mb-2">Year *</label>
                <input
                  type="number"
                  required
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className={inField}
                />
              </div>

              <div>
                <label className="block text-olx-dark font-semibold text-sm mb-2">Price (₹) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={inField}
                  placeholder="500000"
                />
              </div>

              <div>
                <label className="block text-olx-dark font-semibold text-sm mb-2">Quantity *</label>
                <div className="relative">
                  <Package className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-olx-muted" />
                  <input
                    type="number"
                    required
                    min="1"
                    step="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="cro-input-has-icon"
                    placeholder="1"
                  />
                </div>
                <p className="mt-1 text-xs text-olx-muted">Number of units available for buyers.</p>
              </div>
            </div>

            {/* Kilometers Driven & Mileage */}



            {/* <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-olx-dark font-semibold text-sm mb-2">
                  Kilometers Driven * (Odometer Reading)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.kilometersDriven}
                  onChange={(e) => setFormData({ ...formData, kilometersDriven: e.target.value })}
                  className={inField}
                  placeholder="e.g., 25000"
                />
                <p className="text-olx-muted text-xs mt-1">Total kilometers the vehicle has run</p>
              </div>

              <div>
                <label className="block text-olx-dark font-semibold text-sm mb-2">
                  Mileage (Fuel Efficiency)
                </label>
                <input
                  type="text"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                  className={inField}
                  placeholder="e.g., 15 km/l or 20 km/l"
                />
                <p className="text-olx-muted text-xs mt-1">Fuel efficiency in km per liter</p>
              </div>
            </div> */}





            {/* Fuel Type & Transmission */}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-olx-dark font-semibold text-sm mb-2">Fuel Type</label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                  className={selField}
                >
                  {FUEL_TYPES.map(type => (
                    <option key={type} value={type} className="text-black bg-white">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-olx-dark font-semibold text-sm mb-2">Transmission</label>
                <select
                  value={formData.transmission}
                  onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                  className={selField}
                >
                  {TRANSMISSION_TYPES.map(type => (
                    <option key={type} value={type} className="text-black bg-white">
                      {type}
                    </option>
                  ))}
                </select>

              </div>
            </div>

            {/* Ownership}



            <div>
              <label className="block text-olx-dark font-semibold text-sm mb-2">Ownership *</label>
              <select
                required
                value={formData.ownership}
                onChange={(e) => setFormData({ ...formData, ownership: e.target.value })}
                className={selField}
              >
                {OWNERSHIP_TYPES.map(type => (
                  <option key={type} value={type} className="text-black bg-white">
                    {type}
                  </option>
                ))}
              </select>
            </div> */}




            {/* Location */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-olx-dark font-semibold text-sm mb-2">City</label>
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, city: e.target.value }
                  })}
                  className={inField}
                  placeholder="e.g., Mumbai"
                />
              </div>

              <div>
                <label className="block text-olx-dark font-semibold text-sm mb-2">State</label>
                <input
                  type="text"
                  value={formData.location.state}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, state: e.target.value }
                  })}
                  className={inField}
                  placeholder="e.g., Maharashtra"
                />
              </div>
            </div>

          {/* Precise Coordinates (optional for nearby search) */}




          {/* <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-olx-dark font-semibold text-sm mb-2">Latitude (optional)</label>
              <input
                type="number"
                step="any"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                className={inField}
                placeholder="e.g., 19.0760"
              />
            </div>
            <div>
              <label className="block text-olx-dark font-semibold text-sm mb-2">Longitude (optional)</label>
              <input
                type="number"
                step="any"
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                className={inField}
                placeholder="e.g., 72.8777"
              />
            </div>
          </div> */}





            {/* Description */}
            <div>
              <label className="block text-olx-dark font-semibold text-sm mb-2">Description</label>
              <textarea
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="cro-input resize-none"
                placeholder="Describe your vehicle's condition, service history, etc..."
              ></textarea>
            </div>

            {/* Features */}
            <div>
              <label className="block text-olx-dark font-semibold text-sm mb-2">Features (Optional)</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  className={inField}
                  placeholder="e.g., AC, Power Steering, ABS"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-6 py-3 bg-olx-dark text-white rounded-lg font-bold hover:bg-olx-muted transition"
                >
                  Add
                </button>
              </div>
              {formData.features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-olx-bg text-olx-dark border border-olx-border rounded-full text-sm flex items-center gap-2 font-medium"
                    >
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="hover:text-red-400 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Images Upload */}
            <div>
              <label className="block text-olx-dark font-semibold text-sm mb-2">
                Upload Images ({images.length}/5)
              </label>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-5 gap-4 mb-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {images.length < 5 && (
                <div className="border-2 border-dashed border-olx-border rounded-lg p-8 text-center hover:border-olx-dark transition cursor-pointer bg-olx-bg/50">
                  <Upload className="w-12 h-12 text-olx-muted mx-auto mb-4" />
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer"
                  >
                    <span className="text-olx-dark font-bold underline decoration-olx-teal">
                      Click to upload images
                    </span>
                    <p className="text-olx-muted text-sm mt-2">
                      PNG, JPG up to 5MB each (Max 5 images)
                    </p>
                  </label>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-olx-sell py-4 text-lg font-extrabold text-olx-dark shadow-md transition hover:brightness-105 hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Adding Part...' : 'List Part'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;
