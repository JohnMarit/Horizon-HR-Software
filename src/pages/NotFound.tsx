import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  HomeIcon, 
  ArrowLeftIcon, 
  SearchIcon, 
  HeadphonesIcon, 
  MapPinIcon, 
  InfoIcon 
} from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Log to analytics in production
    if (process.env.NODE_ENV === 'production') {
      // Analytics tracking for 404 errors
      // Example: analytics.track('404_error', { path: location.pathname });
    }
  }, [location.pathname]);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const commonPages = [
    { name: "Dashboard", path: "/", icon: <HomeIcon className="h-4 w-4" /> },
    { name: "Employee Records", path: "/employees", icon: <SearchIcon className="h-4 w-4" /> },
    { name: "Payroll & Tax", path: "/payroll", icon: <MapPinIcon className="h-4 w-4" /> },
    { name: "Training", path: "/training", icon: <InfoIcon className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">HB</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Horizon Bank</h1>
              <p className="text-blue-600 font-medium">HR Management System</p>
            </div>
          </div>
        </div>

        {/* 404 Card */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="text-center pb-4">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl font-bold text-red-600">404</span>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              Page Not Found
            </CardTitle>
            <p className="text-lg text-gray-600">
              We couldn't find the page you're looking for in the Horizon Bank HR system.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Details */}
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                <strong>Requested URL:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-sm">{location.pathname}</code>
                <br />
                <span className="text-sm text-gray-600 mt-1 block">
                  This page may have been moved, deleted, or you may have entered an incorrect URL.
                </span>
              </AlertDescription>
            </Alert>

            {/* What can you do */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">What can you do?</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  Check the URL for any typos or spelling errors
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  Use the navigation menu to find what you're looking for
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  Contact your system administrator if you believe this is an error
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  Return to the dashboard and try again
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={() => navigate('/')}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <HomeIcon className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={handleGoBack}
                className="flex-1"
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>

            {/* Quick Links */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-center">
                Or try these popular pages:
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {commonPages.map((page) => (
                  <Button
                    key={page.path}
                    variant="ghost"
                    onClick={() => navigate(page.path)}
                    className="h-auto p-3 justify-start text-left"
                  >
                    <div className="flex items-center gap-3">
                      {page.icon}
                      <span className="text-sm">{page.name}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Support Contact */}
            <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <HeadphonesIcon className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Need Help?</span>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                If you continue to experience issues, please contact our IT support team.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <a 
                  href="mailto:it-support@horizonbankss.com" 
                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  it-support@horizonbankss.com
                </a>
                <span className="hidden sm:inline text-gray-400">•</span>
                <a 
                  href="tel:+211123456789" 
                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  +211 123 456 789
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-4 text-xs text-gray-500">
              Error ID: {Date.now().toString(36).toUpperCase()} | 
              Horizon Bank HR System v1.0 | 
              {new Date().toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
