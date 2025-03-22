import { useState } from "react"
import {
  ArrowRight,
  BarChart3,
  Car,
  CheckCircle,
  FileCheck,
  Globe,
  Key,
  Layers,
  Lock,
  Network,
  Shield,
  User,
  Users,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("super")
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Network className="h-6 w-6 text-primary" />
            <span>VCDOS</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="transition-colors hover:text-primary">
              Features
            </a>
            <a href="#technology" className="transition-colors hover:text-primary">
              Technology
            </a>
            <a href="#demo" className="transition-colors hover:text-primary">
              Demo
            </a>
            <a href="#documentation" className="transition-colors hover:text-primary">
              Documentation
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="hidden md:flex">
              GitHub
            </Button>
            <Button size="sm" onClick={() => navigate("/signin")}>Sign In</Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Vendor Cab and Driver Onboarding System
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    A comprehensive multi-level vendor management system for fleet operations, vehicle onboarding, and
                    driver management with hierarchical access control.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button 
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => navigate("/signin")}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    View on GitHub
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full h-[350px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden border bg-background p-2">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                    <div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=800')] bg-center bg-no-repeat opacity-30"></div>
                  </div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between border-b p-2">
                      <div className="flex items-center gap-2">
                        <Network className="h-5 w-5 text-primary" />
                        <span className="font-medium">VCDOS Dashboard</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 p-2 flex-1">
                      <div className="col-span-1 flex flex-col gap-2">
                        <div className="rounded border p-2 bg-card shadow-sm">
                          <h3 className="text-sm font-medium">Vendor Hierarchy</h3>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-1 text-xs">
                              <div className="h-2 w-2 rounded-full bg-primary"></div>
                              <span>Super Admin</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs pl-3">
                              <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                              <span>Regional Admin</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs pl-6">
                              <div className="h-2 w-2 rounded-full bg-green-400"></div>
                              <span>City Admin</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs pl-9">
                              <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                              <span>Local Admin</span>
                            </div>
                          </div>
                        </div>
                        <div className="rounded border p-2 bg-card shadow-sm flex-1">
                          <h3 className="text-sm font-medium">Quick Stats</h3>
                          <div className="mt-2 space-y-2">
                            <div className="flex justify-between text-xs">
                              <span>Total Vehicles</span>
                              <span className="font-medium">247</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span>Active Drivers</span>
                              <span className="font-medium">189</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span>Pending Approvals</span>
                              <span className="font-medium">12</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2 flex flex-col gap-2">
                        <div className="rounded border p-2 bg-card shadow-sm">
                          <h3 className="text-sm font-medium">Performance Overview</h3>
                          <div className="mt-2 h-24 flex items-end gap-1">
                            {[40, 65, 50, 80, 75, 90, 85].map((height, i) => (
                              <div
                                key={i}
                                className="flex-1 bg-primary/80 rounded-t"
                                style={{ height: `${height}%` }}
                              ></div>
                            ))}
                          </div>
                          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                            <span>Mon</span>
                            <span>Tue</span>
                            <span>Wed</span>
                            <span>Thu</span>
                            <span>Fri</span>
                            <span>Sat</span>
                            <span>Sun</span>
                          </div>
                        </div>
                        <div className="rounded border p-2 bg-card shadow-sm flex-1">
                          <h3 className="text-sm font-medium">Recent Activity</h3>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center gap-2 text-xs">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span>New driver onboarded</span>
                              <span className="ml-auto text-muted-foreground">2m ago</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                              <span>Vehicle document updated</span>
                              <span className="ml-auto text-muted-foreground">15m ago</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                              <span>Compliance alert resolved</span>
                              <span className="ml-auto text-muted-foreground">1h ago</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <div className="h-2 w-2 rounded-full bg-red-500"></div>
                              <span>Document verification pending</span>
                              <span className="ml-auto text-muted-foreground">3h ago</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                  Powerful Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Comprehensive Fleet Management</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to manage your vendor network, vehicles, and drivers in one place.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
              <Card>
                <CardHeader className="pb-2">
                  <Layers className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Multi-Level Hierarchy</CardTitle>
                  <CardDescription>Flexible N-level vendor hierarchy with customizable permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Super → Regional → City → Local</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Role-based access management</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Parent-child relationship</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <BarChart3 className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Super Vendor Dashboard</CardTitle>
                  <CardDescription>Complete vendor network overview with real-time monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Real-time fleet status monitoring</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Document verification management</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Performance analytics and reporting</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <Car className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Vehicle Management</CardTitle>
                  <CardDescription>Complete vehicle lifecycle management and tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Vehicle onboarding and registration</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Document tracking and verification</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Compliance monitoring</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <User className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Driver Management</CardTitle>
                  <CardDescription>Streamlined driver onboarding and performance tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Driver onboarding and verification</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Document upload and tracking</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Performance monitoring</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <Lock className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Access Control</CardTitle>
                  <CardDescription>Granular permission management and role-based access</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Granular permission management</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Role-based access control</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Activity audit trails</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <FileCheck className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Document Verification</CardTitle>
                  <CardDescription>Streamlined document management and verification</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Automated document verification</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Expiry notifications and alerts</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Compliance status tracking</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                  Live Demo
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Experience the Platform</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Try out different admin levels using our demo credentials.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-4xl mt-12">
              <Tabs defaultValue="super" className="w-full" onValueChange={(value) => setActiveTab(value)}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="super">Super Admin</TabsTrigger>
                  <TabsTrigger value="regional">Regional Admin</TabsTrigger>
                  <TabsTrigger value="city">City Admin</TabsTrigger>
                  <TabsTrigger value="local">Local Admin</TabsTrigger>
                </TabsList>
                <TabsContent value="super" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Super Admin Dashboard</CardTitle>
                      <CardDescription>
                        Complete vendor network overview with full administrative capabilities.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-md border p-4">
                        <div className="flex items-center gap-4">
                          <Shield className="h-10 w-10 text-primary" />
                          <div>
                            <h3 className="font-medium">Super Admin Access</h3>
                            <p className="text-sm text-muted-foreground">Email: super@vendor.com</p>
                            <p className="text-sm text-muted-foreground">Password: Any 6+ characters</p>
                          </div>
                          <Button className="ml-auto" size="sm">
                            Login as Super Admin
                          </Button>
                        </div>
                      </div>
                      <div className="aspect-video overflow-hidden rounded-md border">
                        <div className="w-full h-full bg-card p-4 flex flex-col">
                          <div className="flex items-center justify-between border-b pb-2">
                            <h3 className="font-medium">Super Admin Dashboard Preview</h3>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span className="text-xs">Full Access</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-4 flex-1">
                            <div className="flex flex-col gap-2">
                              <div className="rounded border p-2 bg-background">
                                <h4 className="text-sm font-medium">Global Vendor Network</h4>
                                <div className="mt-2 h-24 flex items-center justify-center">
                                  <Network className="h-16 w-16 text-primary/30" />
                                </div>
                              </div>
                              <div className="rounded border p-2 bg-background">
                                <h4 className="text-sm font-medium">Performance Analytics</h4>
                                <div className="mt-2 h-24 flex items-center justify-center">
                                  <BarChart3 className="h-16 w-16 text-primary/30" />
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="rounded border p-2 bg-background">
                                <h4 className="text-sm font-medium">System Configuration</h4>
                                <div className="mt-2 h-24 flex items-center justify-center">
                                  <Key className="h-16 w-16 text-primary/30" />
                                </div>
                              </div>
                              <div className="rounded border p-2 bg-background">
                                <h4 className="text-sm font-medium">User Management</h4>
                                <div className="mt-2 h-24 flex items-center justify-center">
                                  <Users className="h-16 w-16 text-primary/30" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Full Demo
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="regional" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Regional Admin Dashboard</CardTitle>
                      <CardDescription>Manage all vendors, vehicles, and drivers within your region.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-md border p-4">
                        <div className="flex items-center gap-4">
                          <Globe className="h-10 w-10 text-primary" />
                          <div>
                            <h3 className="font-medium">Regional Admin Access</h3>
                            <p className="text-sm text-muted-foreground">Email: north@vendor.com</p>
                            <p className="text-sm text-muted-foreground">Password: Any 6+ characters</p>
                          </div>
                          <Button className="ml-auto" size="sm">
                            Login as Regional Admin
                          </Button>
                        </div>
                      </div>
                      <div className="aspect-video overflow-hidden rounded-md border">
                        <div className="w-full h-full bg-card p-4 flex flex-col">
                          <div className="flex items-center justify-between border-b pb-2">
                            <h3 className="font-medium">Regional Admin Dashboard Preview</h3>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                              <span className="text-xs">Regional Access</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-4 flex-1">
                            <div className="flex flex-col gap-2">
                              <div className="rounded border p-2 bg-background">
                                <h4 className="text-sm font-medium">Regional Overview</h4>
                                <div className="mt-2 h-24 flex items-center justify-center">
                                  <Globe className="h-16 w-16 text-primary/30" />
                                </div>
                              </div>
                              <div className="rounded border p-2 bg-background">
                                <h4 className="text-sm font-medium">City Management</h4>
                                <div className="mt-2 h-24 flex items-center justify-center">
                                  <Users className="h-16 w-16 text-primary/30" />
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="rounded border p-2 bg-background">
                                <h4 className="text-sm font-medium">Regional Analytics</h4>
                                <div className="mt-2 h-24 flex items-center justify-center">
                                  <BarChart3 className="h-16 w-16 text-primary/30" />
                                </div>
                              </div>
                              <div className="rounded border p-2 bg-background">
                                <h4 className="text-sm font-medium">Document Verification</h4>
                                <div className="mt-2 h-24 flex items-center justify-center">
                                  <FileCheck className="h-16 w-16 text-primary/30" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Full Demo
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="city" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>City Admin Dashboard</CardTitle>
                      <CardDescription>Manage local vendors, vehicles, and drivers within your city.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-md border p-4">
                        <div className="flex items-center gap-4">
                          <Layers className="h-10 w-10 text-primary" />
                          <div>
                            <h3 className="font-medium">City Admin Access</h3>
                            <p className="text-sm text-muted-foreground">Email: citya@vendor.com</p>
                            <p className="text-sm text-muted-foreground">Password: Any 6+ characters</p>
                          </div>
                          <Button className="ml-auto" size="sm">
                            Login as City Admin
                          </Button>
                        </div>
                      </div>
                      <div className="aspect-video overflow-hidden rounded-md border">
                        <div className="w-full h-full bg-card p-4 flex flex-col">
                          <div className="flex items-center justify-between border-b pb-2">
                            <h3 className="font-medium">City Admin Dashboard Preview</h3>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span className="text-xs">City Access</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-4 flex-1">
                            <div className="flex flex-col gap-2">
                              <div className="rounded border p-2 bg-background">
                                <h4 className="text-sm font-medium">City Overview</h4>
                                <div className="mt-2 h-24 flex items-center justify-center">
                                  <Layers className="h-16 w-16 text-primary/30" />
                                </div>
                              </div>
                              <div className="rounded border p-2 bg-background">
                                <h4 className="text-sm font-medium">Local Vendor Management</h4>
                                <div className="mt-2 h-24 flex items-center justify-center">
                                  <Users className="h-16 w-16 text-primary/30" />
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="rounded border p-2 bg-background">
                                <h4 className="text-sm font-medium">Vehicle Tracking</h4>
                                <div className="mt-2 h-24 flex items-center justify-center">
                                  <Car className="h-16 w-16 text-primary/30" />
                                </div>
                              </div>
                              <div className="rounded border p-2 bg-background">
                                <h4 className="text-sm font-medium">Driver Management</h4>
                                <div className="mt-2 h-24 flex items-center justify-center">
                                  <User className="h-16 w-16 text-primary/30" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Full Demo
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="local" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Local Admin Dashboard</CardTitle>
                      <CardDescription>Manage your local fleet operations and driver assignments.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-md border p-4">
                        <div className="flex items-center gap-4">
                          <Car className="h-10 w-10 text-primary" />
                          <div>
                            <h3 className="font-medium">Local Admin Access</h3>
                            <p className="text-sm text-muted-foreground">Email: local@vendor.com</p>
                            <p className="text-sm text-muted-foreground">Password: Any 6+ characters</p>
                          </div>
                          <Button className="ml-auto" size="sm">
                            Login as Local Admin
                          </Button>
                        </div>
                      </div>
                      <div className="aspect-video overflow-hidden rounded-md border">
                        <div className="w-full h-full bg-card p-4 flex flex-col">
                          <div className="flex items-center justify-between border-b pb-2">
                            <h3 className="font-medium">Local Admin Dashboard Preview</h3>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                              <span className="text-xs">Local Access</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-4 flex-1">
                            <div className="flex flex-col gap-2">
                              <div className="rounded border p-2 bg-background">
                                <h4 className="text-sm font-medium">Vehicle Management</h4>
                                <div className="mt-2 h-24 flex items-center justify-center">
                                  <Car className="h-16 w-16 text-primary/30" />
                                </div>
                              </div>
                              <div className="rounded border p-2 bg-background">
                                <h4 className="text-sm font-medium">Driver Assignments</h4>
                                <div className="mt-2 h-24 flex items-center justify-center">
                                  <User className="h-16 w-16 text-primary/30" />
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="rounded border p-2 bg-background">
                                <h4 className="text-sm font-medium">Document Upload</h4>
                                <div className="mt-2 h-24 flex items-center justify-center">
                                  <FileCheck className="h-16 w-16 text-primary/30" />
                                </div>
                              </div>
                              <div className="rounded border p-2 bg-background">
                                <h4 className="text-sm font-medium">Daily Operations</h4>
                                <div className="mt-2 h-24 flex items-center justify-center">
                                  <BarChart3 className="h-16 w-16 text-primary/30" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Full Demo
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section id="technology" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                  Modern Stack
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Built with Modern Technologies</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Leveraging the latest web technologies for a fast, responsive, and scalable application.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 mt-12">
              {[
                { name: "React.js", icon: "⚛️" },
                { name: "TypeScript", icon: "TS" },
                { name: "Zustand", icon: "🐻" },
                { name: "Tailwind CSS", icon: "🎨" },
                { name: "Recharts", icon: "📊" },
                { name: "React Router", icon: "🔀" },
                { name: "React Hook Form", icon: "📝" },
                { name: "Lucide Icons", icon: "🔍" },
              ].map((tech) => (
                <div
                  key={tech.name}
                  className="flex flex-col items-center justify-center rounded-lg border bg-card p-4 text-center"
                >
                  <div className="text-3xl mb-2">{tech.icon}</div>
                  <h3 className="text-sm font-medium">{tech.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Documentation Section */}
        <section id="documentation" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                  Documentation
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Comprehensive Documentation</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to know about the system components and implementation.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-4xl mt-12">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Core Components</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="rounded-md border p-4">
                        <h3 className="font-medium">VendorHierarchyTree</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Displays the organizational hierarchy of vendors in a tree structure with interactive
                          expand/collapse nodes.
                        </p>
                        <div className="mt-2 bg-muted p-2 rounded-md text-xs">
                          <code>{`import { VendorHierarchyTree } from '../components/VendorHierarchyTree';`}</code>
                        </div>
                      </div>
                      <div className="rounded-md border p-4">
                        <h3 className="font-medium">ManageVehicleModal</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Modal for vehicle management operations including editing, document management, and driver
                          assignment.
                        </p>
                        <div className="mt-2 bg-muted p-2 rounded-md text-xs">
                          <code>{`import { ManageVehicleModal } from '../components/ManageVehicleModal';`}</code>
                        </div>
                      </div>
                      <div className="rounded-md border p-4">
                        <h3 className="font-medium">RoleBasedDashboard</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Renders appropriate dashboard based on vendor level with dynamic dashboard switching.
                        </p>
                        <div className="mt-2 bg-muted p-2 rounded-md text-xs">
                          <code>{`import RoleBasedDashboard from '../components/RoleBasedDashboard';`}</code>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Authentication Components</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="rounded-md border p-4">
                        <h3 className="font-medium">AuthProvider</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Manages authentication state and user permissions with role-based access control.
                        </p>
                        <div className="mt-2 bg-muted p-2 rounded-md text-xs">
                          <code>{`import { AuthProvider } from '../contexts/AuthContext';`}</code>
                        </div>
                      </div>
                      <div className="rounded-md border p-4">
                        <h3 className="font-medium">ProtectedRoute</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Route protection based on authentication and permissions with redirect handling.
                        </p>
                        <div className="mt-2 bg-muted p-2 rounded-md text-xs">
                          <code>{`import ProtectedRoute from '../components/ProtectedRoute';`}</code>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Management Interfaces</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="rounded-md border p-4">
                        <h3 className="font-medium">AddDriverModal</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Modal for adding new drivers with document upload and bank details collection.
                        </p>
                        <div className="mt-2 bg-muted p-2 rounded-md text-xs">
                          <code>{`import { AddDriverModal } from '../components/AddDriverModal';`}</code>
                        </div>
                      </div>
                      <div className="rounded-md border p-4">
                        <h3 className="font-medium">ManageDriverModal</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Modal for managing existing drivers with document management and status updates.
                        </p>
                        <div className="mt-2 bg-muted p-2 rounded-md text-xs">
                          <code>{`import { ManageDriverModal } from '../components/ManageDriverModal';`}</code>
                        </div>
                      </div>
                      <div className="rounded-md border p-4">
                        <h3 className="font-medium">OrgChart</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Visual representation of organizational structure with interactive org chart.
                        </p>
                        <div className="mt-2 bg-muted p-2 rounded-md text-xs">
                          <code>{`import OrgChart from '../components/OrgChart';`}</code>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>State Management</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="rounded-md border p-4">
                        <h3 className="font-medium">VehicleStore</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Global vehicle state management with CRUD operations and document management.
                        </p>
                        <div className="mt-2 bg-muted p-2 rounded-md text-xs">
                          <code>{`import { useVehicleStore } from '../stores/vehicleStore';`}</code>
                        </div>
                      </div>
                      <div className="rounded-md border p-4">
                        <h3 className="font-medium">DriverStore</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Global driver state management with CRUD operations and performance metrics.
                        </p>
                        <div className="mt-2 bg-muted p-2 rounded-md text-xs">
                          <code>{`import { useDriverStore } from '../stores/driverStore';`}</code>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Get Started?</h2>
                <p className="mx-auto max-w-[700px] md:text-xl">
                  Experience the comprehensive vendor management system that streamlines your fleet operations.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
                  View Live Demo
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  GitHub Repository
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-background py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <Network className="h-5 w-5 text-primary" />
            <span>VCDOS</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Vendor Cab and Driver Onboarding System. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">
              GitHub
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">
              Documentation
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
