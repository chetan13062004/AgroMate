"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Save,
  Shield,
  Bell,
  Mail,
  CreditCard,
  Globe,
  Users,
  AlertTriangle,
  CheckCircle,
  Key,
  Server,
  Smartphone,
} from "lucide-react"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "FarmFresh Marketplace",
    siteDescription: "Connect farmers directly with consumers for fresh, quality produce",
    contactEmail: "admin@farmfresh.com",
    supportPhone: "+91 1800-123-4567",
    maintenanceMode: false,

    // User Management
    allowUserRegistration: true,
    requireEmailVerification: true,
    autoApproveFarmers: false,
    maxProductsPerFarmer: 50,

    // Payment Settings
    razorpayEnabled: true,
    codEnabled: true,
    minOrderAmount: 100,
    deliveryFee: 50,
    freeDeliveryThreshold: 500,

    // Notification Settings
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    adminAlerts: true,

    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,

    // System Settings
    backupFrequency: "daily",
    logRetention: 30,
    cacheEnabled: true,
    compressionEnabled: true,
  })

  const [apiKeys, setApiKeys] = useState({
    razorpayKeyId: "rzp_test_****",
    razorpayKeySecret: "****",
    emailApiKey: "****",
    smsApiKey: "****",
    mapsApiKey: "****",
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = () => {
    // Save settings logic
    alert("Settings saved successfully!")
  }

  const handleTestConnection = (service: string) => {
    // Test connection logic
    alert(`Testing ${service} connection...`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center">
              <Settings className="h-8 w-8 mr-3" />
              Admin Settings
            </h1>
            <p className="text-slate-600">Configure marketplace settings and system preferences</p>
          </div>
          <Button onClick={handleSaveSettings} className="flex items-center">
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Site Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) => handleSettingChange("siteName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => handleSettingChange("contactEmail", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => handleSettingChange("siteDescription", e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input
                    id="supportPhone"
                    value={settings.supportPhone}
                    onChange={(e) => handleSettingChange("supportPhone", e.target.value)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Maintenance Mode</Label>
                    <p className="text-sm text-gray-600">Temporarily disable the site for maintenance</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleSettingChange("maintenanceMode", checked)}
                  />
                </div>

                {settings.maintenanceMode && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Maintenance mode is enabled. Only administrators can access the site.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  User Management Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Allow User Registration</Label>
                    <p className="text-sm text-gray-600">Enable new users to register on the platform</p>
                  </div>
                  <Switch
                    checked={settings.allowUserRegistration}
                    onCheckedChange={(checked) => handleSettingChange("allowUserRegistration", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Require Email Verification</Label>
                    <p className="text-sm text-gray-600">Users must verify their email before accessing the platform</p>
                  </div>
                  <Switch
                    checked={settings.requireEmailVerification}
                    onCheckedChange={(checked) => handleSettingChange("requireEmailVerification", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Auto-Approve Farmers</Label>
                    <p className="text-sm text-gray-600">Automatically approve farmer registrations</p>
                  </div>
                  <Switch
                    checked={settings.autoApproveFarmers}
                    onCheckedChange={(checked) => handleSettingChange("autoApproveFarmers", checked)}
                  />
                </div>

                <div>
                  <Label htmlFor="maxProducts">Maximum Products per Farmer</Label>
                  <Input
                    id="maxProducts"
                    type="number"
                    value={settings.maxProductsPerFarmer}
                    onChange={(e) => handleSettingChange("maxProductsPerFarmer", Number.parseInt(e.target.value))}
                    className="w-32"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Razorpay Payments</Label>
                    <p className="text-sm text-gray-600">Enable online payments via Razorpay</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.razorpayEnabled}
                      onCheckedChange={(checked) => handleSettingChange("razorpayEnabled", checked)}
                    />
                    <Button variant="outline" size="sm" onClick={() => handleTestConnection("Razorpay")}>
                      Test
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Cash on Delivery</Label>
                    <p className="text-sm text-gray-600">Allow customers to pay on delivery</p>
                  </div>
                  <Switch
                    checked={settings.codEnabled}
                    onCheckedChange={(checked) => handleSettingChange("codEnabled", checked)}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="minOrder">Minimum Order Amount (₹)</Label>
                    <Input
                      id="minOrder"
                      type="number"
                      value={settings.minOrderAmount}
                      onChange={(e) => handleSettingChange("minOrderAmount", Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="deliveryFee">Delivery Fee (₹)</Label>
                    <Input
                      id="deliveryFee"
                      type="number"
                      value={settings.deliveryFee}
                      onChange={(e) => handleSettingChange("deliveryFee", Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="freeDelivery">Free Delivery Threshold (₹)</Label>
                    <Input
                      id="freeDelivery"
                      type="number"
                      value={settings.freeDeliveryThreshold}
                      onChange={(e) => handleSettingChange("freeDeliveryThreshold", Number.parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-medium mb-4 block">API Keys</Label>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="razorpayKey">Razorpay Key ID</Label>
                        <Input
                          id="razorpayKey"
                          value={apiKeys.razorpayKeyId}
                          onChange={(e) => setApiKeys((prev) => ({ ...prev, razorpayKeyId: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="razorpaySecret">Razorpay Key Secret</Label>
                        <Input
                          id="razorpaySecret"
                          type="password"
                          value={apiKeys.razorpayKeySecret}
                          onChange={(e) => setApiKeys((prev) => ({ ...prev, razorpayKeySecret: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <Label className="text-base font-medium">Email Notifications</Label>
                      <p className="text-sm text-gray-600">Send notifications via email</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                    />
                    <Button variant="outline" size="sm" onClick={() => handleTestConnection("Email")}>
                      Test
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-green-600" />
                    <div>
                      <Label className="text-base font-medium">SMS Notifications</Label>
                      <p className="text-sm text-gray-600">Send notifications via SMS</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) => handleSettingChange("smsNotifications", checked)}
                    />
                    <Button variant="outline" size="sm" onClick={() => handleTestConnection("SMS")}>
                      Test
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-purple-600" />
                    <div>
                      <Label className="text-base font-medium">Push Notifications</Label>
                      <p className="text-sm text-gray-600">Send browser push notifications</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Admin Alerts</Label>
                    <p className="text-sm text-gray-600">Receive alerts for important system events</p>
                  </div>
                  <Switch
                    checked={settings.adminAlerts}
                    onCheckedChange={(checked) => handleSettingChange("adminAlerts", checked)}
                  />
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-medium mb-4 block">API Keys</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emailApi">Email API Key</Label>
                      <Input
                        id="emailApi"
                        type="password"
                        value={apiKeys.emailApiKey}
                        onChange={(e) => setApiKeys((prev) => ({ ...prev, emailApiKey: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="smsApi">SMS API Key</Label>
                      <Input
                        id="smsApi"
                        type="password"
                        value={apiKeys.smsApiKey}
                        onChange={(e) => setApiKeys((prev) => ({ ...prev, smsApiKey: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSettingChange("twoFactorAuth", checked)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleSettingChange("sessionTimeout", Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxAttempts"
                      type="number"
                      value={settings.maxLoginAttempts}
                      onChange={(e) => handleSettingChange("maxLoginAttempts", Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="passwordLength">Min Password Length</Label>
                    <Input
                      id="passwordLength"
                      type="number"
                      value={settings.passwordMinLength}
                      onChange={(e) => handleSettingChange("passwordMinLength", Number.parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <Alert>
                  <Key className="h-4 w-4" />
                  <AlertDescription>
                    Security settings will be applied to all new user sessions. Existing sessions may need to be
                    refreshed.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="h-5 w-5 mr-2" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="backupFreq">Backup Frequency</Label>
                    <Select
                      value={settings.backupFrequency}
                      onValueChange={(value) => handleSettingChange("backupFrequency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="logRetention">Log Retention (days)</Label>
                    <Input
                      id="logRetention"
                      type="number"
                      value={settings.logRetention}
                      onChange={(e) => handleSettingChange("logRetention", Number.parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Enable Caching</Label>
                    <p className="text-sm text-gray-600">Improve performance with caching</p>
                  </div>
                  <Switch
                    checked={settings.cacheEnabled}
                    onCheckedChange={(checked) => handleSettingChange("cacheEnabled", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Enable Compression</Label>
                    <p className="text-sm text-gray-600">Compress responses to reduce bandwidth</p>
                  </div>
                  <Switch
                    checked={settings.compressionEnabled}
                    onCheckedChange={(checked) => handleSettingChange("compressionEnabled", checked)}
                  />
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-medium mb-4 block">System Status</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm font-medium">Database</span>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm font-medium">Cache</span>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm font-medium">File Storage</span>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Available
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm font-medium">Background Jobs</span>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Running
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
