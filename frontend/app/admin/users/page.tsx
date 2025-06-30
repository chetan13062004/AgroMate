"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  Search,
  UserPlus,
  Edit,
  Ban,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Download,
  Eye,
  AlertTriangle,
} from "lucide-react"

// Mock user data
const mockUsers = [
  {
    id: "1",
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    phone: "+91 98765 43210",
    role: "farmer",
    status: "active",
    location: "Punjab, India",
    joinDate: "2024-01-15",
    lastActive: "2024-01-20",
    totalOrders: 45,
    totalSpent: 12500,
    avatar: "/placeholder.svg?height=40&width=40",
    verified: true,
    farmDetails: {
      farmName: "Green Valley Farm",
      farmSize: "10 acres",
      specialization: "Organic Vegetables",
      certifications: ["Organic", "Fair Trade"],
    },
  },
  {
    id: "2",
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 87654 32109",
    role: "buyer",
    status: "active",
    location: "Mumbai, India",
    joinDate: "2024-01-10",
    lastActive: "2024-01-21",
    totalOrders: 23,
    totalSpent: 8750,
    avatar: "/placeholder.svg?height=40&width=40",
    verified: true,
  },
  {
    id: "3",
    name: "Suresh Patel",
    email: "suresh@example.com",
    phone: "+91 76543 21098",
    role: "farmer",
    status: "pending",
    location: "Gujarat, India",
    joinDate: "2024-01-18",
    lastActive: "2024-01-19",
    totalOrders: 0,
    totalSpent: 0,
    avatar: "/placeholder.svg?height=40&width=40",
    verified: false,
    farmDetails: {
      farmName: "Sunrise Organic Farm",
      farmSize: "15 acres",
      specialization: "Grains & Pulses",
      certifications: ["Pending"],
    },
  },
  {
    id: "4",
    name: "Amit Singh",
    email: "amit@example.com",
    phone: "+91 65432 10987",
    role: "buyer",
    status: "suspended",
    location: "Delhi, India",
    joinDate: "2024-01-05",
    lastActive: "2024-01-15",
    totalOrders: 12,
    totalSpent: 3200,
    avatar: "/placeholder.svg?height=40&width=40",
    verified: true,
    suspensionReason: "Multiple payment failures",
  },
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch only buyers
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        const res = await fetch('/api/users', {
          credentials: 'include',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        if (!res.ok) {
          throw new Error('Failed to fetch users')
        }
        const json = await res.json()
        const usersData = json.data?.users ?? json
        setUsers(usersData)
      } catch (err: any) {
        setError(err.message || 'Error fetching users')
        console.error('Error fetching users:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])
  const [searchTerm, setSearchTerm] = useState("")
  // Role filter removed - default to buyers only
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)

    const matchesRole = user.role === "buyer"
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleUserAction = (userId: string, action: string) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === userId) {
          switch (action) {
            case "activate":
              return { ...user, status: "active" }
            case "suspend":
              return { ...user, status: "suspended" }
            case "verify":
              return { ...user, verified: true }
            default:
              return user
          }
        }
        return user
      }),
    )
  }

  const exportUsers = () => {
    const csvContent = [
      ["Name", "Email", "Phone", "Role", "Status", "Join Date", "Total Orders", "Total Spent"],
      ...filteredUsers.map((user) => [
        user.name,
        user.email,
        user.phone,
        user.role,
        user.status,
        user.joinDate,
        user.totalOrders,
        user.totalSpent,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "users-export.csv"
    a.click()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center">
              <Users className="h-8 w-8 mr-3" />
              User Management
            </h1>
            <p className="text-slate-600">Manage buyers, and their accounts</p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={exportUsers} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Buyers</p>
                  <p className="text-3xl font-bold">{users.filter((u) => u.role === "buyer").length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Farmers</p>
                  <p className="text-3xl font-bold text-green-600">
                    {users.filter((u) => u.role === "farmer" && u.status === "active").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Buyers</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {users.filter((u) => u.role === "buyer" && u.status === "active").length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {users.filter((u) => u.status === "pending").length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
                

                
                
                  
                  
              <Select value={statusFilter} onValueChange={setStatusFilter}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Status" />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="all">All Status</SelectItem>
    <SelectItem value="active">Active</SelectItem>
    <SelectItem value="pending">Pending</SelectItem>
    <SelectItem value="suspended">Suspended</SelectItem>
  </SelectContent>
</Select>
                
              
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                        
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{user.name}</h3>
                        {user.verified && <CheckCircle className="h-4 w-4 text-green-600" />}
                        <Badge variant="outline" className="capitalize">
                          {user.role}
                        </Badge>
                        {getStatusBadge(user.status)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email}
                        </span>
                        <span className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {user.phone}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {typeof user.location === 'string' ? user.location : user.location?.address ?? ''}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        <span>Joined: {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : '—'}</span>
                        <span>Orders: {user.totalOrders}</span>
                        <span>Spent: ₹{(user.totalSpent ?? 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>User Details</DialogTitle>
                        </DialogHeader>
                        {selectedUser && (
                          <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-16 w-16">
                                <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              
                              <div>
                                <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                                <p className="text-gray-600">{selectedUser.email}</p>
                                <div className="flex items-center space-x-2 mt-2">
                                  <Badge variant="outline" className="capitalize">
                                    {selectedUser.role}
                                  </Badge>
                                  {getStatusBadge(selectedUser.status)}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Contact Information</Label>
                                <div className="space-y-2 mt-2">
                                  <p className="text-sm">📧 {selectedUser.email}</p>
                                  <p className="text-sm">📱 {selectedUser.phone}</p>
                                  <p className="text-sm">📍 {selectedUser.location}</p>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Account Details</Label>
                                <div className="space-y-2 mt-2">
                                  <p className="text-sm">Joined: {selectedUser.joinDate}</p>
                                  <p className="text-sm">Last Active: {selectedUser.lastActive}</p>
                                  <p className="text-sm">Verified: {selectedUser.verified ? "Yes" : "No"}</p>
                                </div>
                              </div>
                            </div>

                            {selectedUser.role === "farmer" && selectedUser.farmDetails && (
                              <div>
                                <Label className="text-sm font-medium">Farm Details</Label>
                                <div className="space-y-2 mt-2">
                                  <p className="text-sm">Farm Name: {selectedUser.farmDetails.farmName}</p>
                                  <p className="text-sm">Size: {selectedUser.farmDetails.farmSize}</p>
                                  <p className="text-sm">Specialization: {selectedUser.farmDetails.specialization}</p>
                                  <p className="text-sm">
                                    Certifications: {selectedUser.farmDetails.certifications.join(", ")}
                                  </p>
                                </div>
                              </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Activity Stats</Label>
                                <div className="space-y-2 mt-2">
                                  <p className="text-sm">Total Orders: {selectedUser.totalOrders}</p>
                                  <p className="text-sm">Total Spent: ₹{selectedUser.totalSpent.toLocaleString()}</p>
                                </div>
                              </div>
                            </div>

                            {selectedUser.status === "suspended" && selectedUser.suspensionReason && (
                              <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                  <strong>Suspension Reason:</strong> {selectedUser.suspensionReason}
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditDialogOpen(true)}
                      className="text-blue-600"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>

                    {user.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => handleUserAction(user.id, "activate")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    )}

                    {user.status === "active" && (
                      <Button variant="destructive" size="sm" onClick={() => handleUserAction(user.id, "suspend")}>
                        <Ban className="h-4 w-4 mr-1" />
                        Suspend
                      </Button>
                    )}

                    {user.status === "suspended" && (
                      <Button size="sm" onClick={() => handleUserAction(user.id, "activate")}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Reactivate
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
