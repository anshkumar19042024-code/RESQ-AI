import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Camera, MapPin, Users, ArrowLeft, Send, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Language, EmergencyType, LocationData } from '../../types';
import { translations } from '../../utils/translations';
import { createSpeechRecognizer, isSpeechRecognitionSupported } from '../../utils/speech';

interface ReportFlowProps {
  lang: Language;
  initialType?: EmergencyType;
  onBack: () => void;
  onSubmit: (reportData: {
    emergencyType: EmergencyType;
    description: string;
    peopleAffected: number;
    location: LocationData;
    imageUrl?: string;
  }) => void;
}

export const ReportFlow: React.FC<ReportFlowProps> = ({
  lang,
  initialType = 'accident',
  onBack,
  onSubmit
}) => {
  const t = translations[lang];

  const [selectedType, setSelectedType] = useState<EmergencyType>(initialType);
  const [description, setDescription] = useState<string>('');
  const [peopleAffected, setPeopleAffected] = useState<number>(1);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [location, setLocation] = useState<LocationData>({
    address: 'Avinashi Road, near PSG College, Coimbatore',
    latitude: 11.0251,
    longitude: 76.9972
  });

  // Voice recording state
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [recognizer, setRecognizer] = useState<any>(null);

  // Location detection state
  const [locLoading, setLocLoading] = useState<boolean>(false);
  const [locStatus, setLocStatus] = useState<string | null>(null);

  // Confirmation modal
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (recognizer) {
        try { recognizer.stop(); } catch (e) {}
      }
    };
  }, [recognizer]);

  const toggleVoiceRecording = () => {
    setVoiceError(null);
    if (isListening) {
      if (recognizer) {
        try { recognizer.stop(); } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      setVoiceError('Voice input is not supported on this browser. You can type your description.');
      return;
    }

    const rec = createSpeechRecognizer(
      (transcript) => {
        setDescription((prev) => prev ? `${prev} ${transcript}` : transcript);
      },
      (err) => {
        setVoiceError(err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      },
      lang
    );

    if (rec) {
      setRecognizer(rec);
      try {
        rec.start();
        setIsListening(true);
      } catch (e) {
        setVoiceError('Unable to access microphone. Please type manually.');
        setIsListening(false);
      }
    }
  };

  const handleFetchCurrentLocation = () => {
    setLocLoading(true);
    setLocStatus(null);
    if (!navigator.geolocation) {
      setLocStatus('Geolocation is not supported by your browser.');
      setLocLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocation({
          address: `Detected GPS Coords: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          latitude: lat,
          longitude: lng
        });
        setLocStatus('📍 Live Geolocation captured!');
        setLocLoading(false);
      },
      (err) => {
        setLocStatus('Location permission denied or unavailable. Using manual/demo location.');
        setLocLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleUseDemoLocation = () => {
    setLocation({
      address: 'Avinashi Road, near PSG College, Coimbatore',
      latitude: 11.0251,
      longitude: 76.9972
    });
    setLocStatus('📍 Loaded demo location: Avinashi Road, Coimbatore');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setImageUrl(evt.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirm(false);
    onSubmit({
      emergencyType: selectedType,
      description: description || 'Emergency report submitted via Citizen App.',
      peopleAffected,
      location,
      imageUrl
    });
  };

  const emergencyTypes: { type: EmergencyType; label: string; icon: string; bg: string }[] = [
    { type: 'accident', label: t.roadAccident, icon: '🚗', bg: 'bg-red-50 hover:bg-red-100 border-red-200' },
    { type: 'fire', label: t.fire, icon: '🔥', bg: 'bg-orange-50 hover:bg-orange-100 border-orange-200' },
    { type: 'medical', label: t.medical, icon: '🏥', bg: 'bg-blue-50 hover:bg-blue-100 border-blue-200' },
    { type: 'crime', label: t.crime, icon: '🚔', bg: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200' },
    { type: 'disaster', label: t.disaster, icon: '🌊', bg: 'bg-cyan-50 hover:bg-cyan-100 border-cyan-200' },
    { type: 'other', label: t.other, icon: '❓', bg: 'bg-slate-50 hover:bg-slate-100 border-slate-200' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      
      {/* Header with back button */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-600" />
          {t.reportEmergency}
        </h2>
      </div>

      <form onSubmit={handleSubmitAttempt} className="space-y-6">
        
        {/* Step 1: Emergency Type Selection */}
        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-white mb-3">
            1. Select Emergency Type *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {emergencyTypes.map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => setSelectedType(item.type)}
                className={`p-4 rounded-xl border-2 text-left flex flex-col items-center sm:items-start justify-center transition ${item.bg} ${
                  selectedType === item.type
                    ? 'border-red-600 ring-2 ring-red-500/30 font-extrabold shadow-md bg-red-100 dark:bg-red-950/40 text-red-950 dark:text-red-200'
                    : 'text-slate-800 dark:text-slate-200 dark:bg-slate-800 dark:border-slate-700'
                }`}
              >
                <span className="text-3xl mb-1">{item.icon}</span>
                <span className="text-xs sm:text-sm font-bold text-center sm:text-left">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Description + Voice Reporting */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-slate-900 dark:text-white">
              2. Describe Emergency & Voice Input
            </label>
            
            {/* Mic button */}
            <button
              type="button"
              onClick={toggleVoiceRecording}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isListening ? t.speaking : t.voiceInput}</span>
            </button>
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.describeEmergency}
            rows={3}
            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
          />

          {voiceError && (
            <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {voiceError}
            </p>
          )}
        </div>

        {/* Step 3: Location */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-600" />
              3. Emergency Location *
            </label>
            
            <button
              type="button"
              onClick={handleUseDemoLocation}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {t.useDemoLocation}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={location.address}
              onChange={(e) => setLocation({ ...location, address: e.target.value })}
              className="flex-1 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={handleFetchCurrentLocation}
              disabled={locLoading}
              className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 flex-shrink-0"
            >
              <MapPin className="w-4 h-4 text-red-400" />
              <span>{locLoading ? 'Locating...' : t.getCurrentLocation}</span>
            </button>
          </div>

          {locStatus && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {locStatus}
            </p>
          )}
        </div>

        {/* Step 4: People Affected + Image Upload */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* People Affected counter */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 shadow-sm">
            <label className="block text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              {t.peopleAffected}
            </label>
            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setPeopleAffected(Math.max(1, peopleAffected - 1))}
                className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 font-bold text-lg text-slate-800 dark:text-white hover:bg-slate-300 transition"
              >
                -
              </button>
              <span className="text-2xl font-black text-slate-900 dark:text-white w-8 text-center">
                {peopleAffected}
              </span>
              <button
                type="button"
                onClick={() => setPeopleAffected(peopleAffected + 1)}
                className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 font-bold text-lg text-slate-800 dark:text-white hover:bg-slate-300 transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 shadow-sm">
            <label className="block text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-purple-600" />
              {t.uploadPhoto}
            </label>
            <div className="pt-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                id="photo-input"
                className="hidden"
              />
              <label
                htmlFor="photo-input"
                className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
              >
                <Camera className="w-4 h-4" />
                <span>{imageUrl ? 'Change Photo' : 'Select Image'}</span>
              </label>

              {imageUrl && (
                <div className="mt-2 relative rounded-lg overflow-hidden h-16 w-full bg-slate-100 dark:bg-slate-900 border border-slate-200">
                  <img src={imageUrl} alt="Emergency site" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageUrl(undefined)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-red-600/30 transition flex items-center justify-center space-x-2"
        >
          <Send className="w-5 h-5" />
          <span>{t.submitReport}</span>
        </button>

      </form>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <ShieldAlert className="w-8 h-8 flex-shrink-0" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t.confirmTitle}
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {t.confirmBody}
            </p>
            <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 text-xs text-red-800 dark:text-red-300 font-medium">
              Category: <strong>{selectedType.toUpperCase()}</strong> • Location: <strong>{location.address}</strong>
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 bg-slate-200 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200 rounded-xl text-sm hover:bg-slate-300 transition"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="flex-1 py-3 bg-red-600 font-bold text-white rounded-xl text-sm hover:bg-red-700 transition shadow-md shadow-red-600/30"
              >
                {t.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
