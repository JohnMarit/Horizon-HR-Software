import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldIcon, 
  CheckCircleIcon, 
  StarIcon, 
  UsersIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  GlobeIcon,
  CreditCardIcon,
  TrendingUpIcon,
  DollarSignIcon,
  BuildingIcon,
  ClockIcon
} from "lucide-react";

export default function CompanyInfo() {
  const bankingServices = [
    {
      category: "Personal Banking",
      icon: <UsersIcon className="h-6 w-6" />,
      services: [
        "Personal Current Account",
        "Personal Savings Account", 
        "Salary Current Account",
        "Junubi Homeward",
        "Student Account",
        "Entrepreneur Pay-As-you-Go"
      ]
    },
    {
      category: "Corporate Banking",
      icon: <BuildingIcon className="h-6 w-6" />,
      services: [
        "Corporate Current Account",
        "Bulk Payments",
        "Over the Counter 3rd Party Payments",
        "Pensions Processing",
        "Statutory Collections",
        "Cash In Transit"
      ]
    },
    {
      category: "Business Loans",
      icon: <CreditCardIcon className="h-6 w-6" />,
      services: [
        "Secured Business Loan",
        "Secured Overdraft",
        "Property Finance",
        "Construction Finance",
        "Plot Purchase Loan",
        "Contract Financing"
      ]
    },
    {
      category: "Trade Finance",
      icon: <TrendingUpIcon className="h-6 w-6" />,
      services: [
        "Documentary Letters of Credit",
        "Bank Guarantees & Bonds",
        "Standby Letters Of Credit",
        "Documentary Collections",
        "Value Chain Finance Loans",
        "Structured Trade Finance"
      ]
    }
  ];

  const operatingHours = [
    { day: "Monday - Friday", hours: "8:00 - 17:00" },
    { day: "Saturday", hours: "8:00 - 15:00" },
    { day: "Sunday", hours: "Closed" }
  ];

  const departments = [
    { name: "Personal Banking", head: "Grace Ajak", staff: 85 },
    { name: "Corporate Banking", head: "Mary Deng", staff: 42 },
    { name: "Trade Finance", head: "Peter Musa", staff: 18 },
    { name: "Finance & Accounting", head: "Peter Garang", staff: 25 },
    { name: "Operations", head: "James Kur", staff: 35 },
    { name: "Human Resources", head: "Sarah Akol", staff: 12 },
    { name: "Information Technology", head: "David Majok", staff: 15 },
    { name: "Risk Management", head: "Rebecca Akuoc", staff: 10 }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">HB</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Horizon Bank</h1>
            <p className="text-xl text-blue-600 font-medium">South Sudan</p>
          </div>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          A premier national bank that aspires to power developments and financial freedom in South Sudan.
        </p>
      </div>

      {/* Vision & Mission */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-900 flex items-center gap-2">
              <StarIcon className="h-6 w-6" />
              Our Vision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-700 leading-relaxed">
              "To be the trusted national premier Bank and preferred financial services provider with world class solutions."
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-900 flex items-center gap-2">
              <TrendingUpIcon className="h-6 w-6" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <p className="text-gray-700">To deliver world-class products and services to our customers.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <p className="text-gray-700">To attract, develop and retain the best talent in South Sudan.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <p className="text-gray-700">To support the communities in which we operate by becoming a good Corporate Citizen.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Core Values */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-blue-900">Our Core Values</CardTitle>
          <CardDescription>The principles that guide everything we do at Horizon Bank</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <ShieldIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">Integrity</h3>
                <p className="text-sm text-gray-600 mt-2">
                  We are committed to conduct ourselves in a manner consistent with our business.
                </p>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">Prudence</h3>
                <p className="text-sm text-gray-600 mt-2">
                  We exercise good judgment and common sense in all we do.
                </p>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                <StarIcon className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">Excellence</h3>
                <p className="text-sm text-gray-600 mt-2">
                  We strive to redefine the standard of excellence in everything we do.
                </p>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <UsersIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">Collaboration</h3>
                <p className="text-sm text-gray-600 mt-2">
                  We recognize we won't thrive without recognizing one another's strengths.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Banking Services */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-blue-900">Banking Services</CardTitle>
          <CardDescription>Comprehensive financial solutions for individuals and businesses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {bankingServices.map((service) => (
              <div key={service.category} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    {service.icon}
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900">{service.category}</h3>
                </div>
                <div className="space-y-2 ml-15">
                  {service.services.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Contact Information */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-900">Contact Information</CardTitle>
            <CardDescription>Get in touch with Horizon Bank</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPinIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Main Branch</p>
                <p className="text-sm text-gray-600">Kokora Road, Nimra Talata, Juba, South Sudan</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <PhoneIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Phone</p>
                <p className="text-sm text-gray-600">+211 920 961 800</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <MailIcon className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">info@horizonbankss.com</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <GlobeIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Website</p>
                <p className="text-sm text-gray-600">www.horizonbankss.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operating Hours */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-900 flex items-center gap-2">
              <ClockIcon className="h-6 w-6" />
              Operating Hours
            </CardTitle>
            <CardDescription>Banking hours and service availability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {operatingHours.map((schedule) => (
              <div key={schedule.day} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="font-medium text-gray-900">{schedule.day}</span>
                <Badge variant={schedule.hours === "Closed" ? "secondary" : "outline"} className="text-sm">
                  {schedule.hours}
                </Badge>
              </div>
            ))}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              <p className="text-sm text-blue-800">
                <strong>Customer Service:</strong> Available during all operating hours for inquiries and support.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Organizational Structure */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-blue-900">Organizational Structure</CardTitle>
          <CardDescription>Department heads and team composition across Horizon Bank</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept) => (
              <div key={dept.name} className="p-4 rounded-lg border hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Department Head:</span>
                    <span className="font-medium text-gray-900">{dept.head}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Team Size:</span>
                    <Badge variant="outline" className="text-xs">
                      {dept.staff} staff
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 