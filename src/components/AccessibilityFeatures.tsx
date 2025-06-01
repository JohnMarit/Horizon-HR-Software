import React, { createContext, useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  SettingsIcon,
  EyeIcon,
  KeyboardIcon,
  VolumeXIcon,
  MousePointerIcon,
  TypeIcon,
  ContrastIcon,
  ZoomInIcon
} from 'lucide-react';

interface AccessibilityContextProps {
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: number;
  screenReader: boolean;
  keyboardNavigation: boolean;
  setHighContrast: (value: boolean) => void;
  setReducedMotion: (value: boolean) => void;
  setFontSize: (value: number) => void;
  setScreenReader: (value: boolean) => void;
  setKeyboardNavigation: (value: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextProps | null>(null);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider = ({ children }: { children: React.ReactNode }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [screenReader, setScreenReader] = useState(false);
  const [keyboardNavigation, setKeyboardNavigation] = useState(true);

  // Load preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('accessibility-preferences');
    if (savedPreferences) {
      const prefs = JSON.parse(savedPreferences);
      setHighContrast(prefs.highContrast || false);
      setReducedMotion(prefs.reducedMotion || false);
      setFontSize(prefs.fontSize || 16);
      setScreenReader(prefs.screenReader || false);
      setKeyboardNavigation(prefs.keyboardNavigation !== false);
    }

    // Detect system preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReducedMotion(true);
    }
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      setHighContrast(true);
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    const preferences = {
      highContrast,
      reducedMotion,
      fontSize,
      screenReader,
      keyboardNavigation
    };
    localStorage.setItem('accessibility-preferences', JSON.stringify(preferences));
  }, [highContrast, reducedMotion, fontSize, screenReader, keyboardNavigation]);

  // Apply CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size
    root.style.setProperty('--base-font-size', `${fontSize}px`);
    
    // High contrast
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    // Keyboard navigation
    if (keyboardNavigation) {
      root.classList.add('keyboard-navigation');
    } else {
      root.classList.remove('keyboard-navigation');
    }
  }, [highContrast, reducedMotion, fontSize, keyboardNavigation]);

  const value = {
    highContrast,
    reducedMotion,
    fontSize,
    screenReader,
    keyboardNavigation,
    setHighContrast,
    setReducedMotion,
    setFontSize,
    setScreenReader,
    setKeyboardNavigation
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Accessibility Settings Panel
export const AccessibilityPanel = ({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  const {
    highContrast,
    reducedMotion,
    fontSize,
    screenReader,
    keyboardNavigation,
    setHighContrast,
    setReducedMotion,
    setFontSize,
    setScreenReader,
    setKeyboardNavigation
  } = useAccessibility();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Accessibility Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Visual Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <EyeIcon className="h-4 w-4" />
              Visual
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="high-contrast" className="text-sm font-medium">
                  High Contrast
                </label>
                <Switch
                  id="high-contrast"
                  checked={highContrast}
                  onCheckedChange={setHighContrast}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="font-size" className="text-sm font-medium">
                  Font Size: {fontSize}px
                </label>
                <Slider
                  id="font-size"
                  min={12}
                  max={24}
                  step={1}
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Motion Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <MousePointerIcon className="h-4 w-4" />
              Motion
            </h3>
            
            <div className="flex items-center justify-between">
              <label htmlFor="reduced-motion" className="text-sm font-medium">
                Reduce Motion
              </label>
              <Switch
                id="reduced-motion"
                checked={reducedMotion}
                onCheckedChange={setReducedMotion}
              />
            </div>
          </div>

          {/* Navigation Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <KeyboardIcon className="h-4 w-4" />
              Navigation
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="keyboard-nav" className="text-sm font-medium">
                  Keyboard Navigation
                </label>
                <Switch
                  id="keyboard-nav"
                  checked={keyboardNavigation}
                  onCheckedChange={setKeyboardNavigation}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="screen-reader" className="text-sm font-medium">
                  Screen Reader Support
                </label>
                <Switch
                  id="screen-reader"
                  checked={screenReader}
                  onCheckedChange={setScreenReader}
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setHighContrast(false);
                  setReducedMotion(false);
                  setFontSize(16);
                  setScreenReader(false);
                  setKeyboardNavigation(true);
                }}
              >
                Reset to Default
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setHighContrast(true);
                  setReducedMotion(true);
                  setFontSize(20);
                  setScreenReader(true);
                  setKeyboardNavigation(true);
                }}
              >
                Max Accessibility
              </Button>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Keyboard Navigation Component
export const KeyboardNavigationHelper = () => {
  const [showShortcuts, setShowShortcuts] = useState(false);

  const shortcuts = [
    { key: 'Tab', description: 'Navigate to next element' },
    { key: 'Shift + Tab', description: 'Navigate to previous element' },
    { key: 'Enter / Space', description: 'Activate button or link' },
    { key: 'Escape', description: 'Close modal or dialog' },
    { key: 'Arrow Keys', description: 'Navigate within components' },
    { key: 'Alt + S', description: 'Open accessibility settings' },
    { key: 'Alt + H', description: 'Return to dashboard' },
    { key: 'Alt + M', description: 'Open main menu' },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + S for accessibility settings
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        setShowShortcuts(!showShortcuts);
      }
      
      // Alt + H for home/dashboard
      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        window.location.href = '/';
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showShortcuts]);

  if (!showShortcuts) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 bg-white shadow-lg border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between">
            Keyboard Shortcuts
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowShortcuts(false)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex justify-between text-xs">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {shortcut.key}
                </span>
                <span className="text-gray-600 ml-2">{shortcut.description}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Skip Links Component
export const SkipLinks = () => (
  <div className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 z-50">
    <a
      href="#main-content"
      className="block bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Skip to main content
    </a>
    <a
      href="#navigation"
      className="block bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Skip to navigation
    </a>
  </div>
);

// ARIA Live Region for Announcements
export const LiveRegion = ({ message }: { message: string }) => (
  <div
    aria-live="polite"
    aria-atomic="true"
    className="sr-only"
    role="status"
  >
    {message}
  </div>
); 